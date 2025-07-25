#include <WiFi.h>
#include "ACS712.h"
#include <ZMPT101B.h>
#include <EEPROM.h>

// WiFi credentials (opsional)
const char* ssid = "Tplink";
const char* password = "0187754ss@@";

// Sensor setup
ACS712 ACS(34, 3.3, 4095, 125);           // ACS712 on pin 34
ZMPT101B voltageSensor(35, 50.0);         // ZMPT101B on pin 35

// EEPROM setup
#define EEPROM_SIZE 512
#define UNIT_ADDRESS 0  // EEPROM address

// Energy variables
float unit = 0.0;             // Energy in kWh
float ratePerkWh = 6.5;       // Harga per kWh
float cost = 0.0;             // Total biaya
unsigned long lastMillis = 0;

void setup() {
  Serial.begin(115200);
  EEPROM.begin(EEPROM_SIZE);

  // Load previous energy from EEPROM
  unit = EEPROM.readFloat(UNIT_ADDRESS);
  if (isnan(unit)) unit = 0.0;

  Serial.println("Energy Meter Starting...");
  Serial.print("Previous kWh: ");
  Serial.println(unit, 4);

  // Calibration
  ACS.autoMidPoint();
  voltageSensor.setSensitivity(500.0f);  // Sesuaikan sensitivitas ZMPT101B

  lastMillis = millis();
}

void loop() {
  // Hitung arus rata-rata dari 100 sampel
  float avg_mA = 0;
  for (int i = 0; i < 100; i++) {
    avg_mA += ACS.mA_AC();
  }
  avg_mA /= 100.0;
  int current_mA = (avg_mA > 5) ? avg_mA : 0;  // Threshold noise

  float voltage = voltageSensor.getRmsVoltage();
  int volt = (voltage > 50) ? voltage : 0;    // Threshold tegangan

  float watt = voltage * (avg_mA / 1000.0);   // P = V x I
  int power = watt;

  // Hitung energi berdasarkan waktu antar loop
  unsigned long currentMillis = millis();
  float deltaTime = (currentMillis - lastMillis) / 3600000.0;  // Jam
  lastMillis = currentMillis;

  float kWh = watt * deltaTime;
  unit += kWh;
  cost = unit * ratePerkWh;

  // Tampilkan ke Serial Monitor
  Serial.print("Voltage: "); Serial.print(volt); Serial.println(" V");
  Serial.print("Current: "); Serial.print(current_mA); Serial.println(" mA");
  Serial.print("Power  : "); Serial.print(power); Serial.println(" W");
  Serial.print("Energy : "); Serial.print(unit, 4); Serial.println(" kWh");
  Serial.print("Cost   : "); Serial.print(cost, 2); Serial.println();
  Serial.println("----");

  // Simpan ke EEPROM
  EEPROM.writeFloat(UNIT_ADDRESS, unit);
  EEPROM.commit();

  delay(1000);  // Sampling tiap 1 detik
}
