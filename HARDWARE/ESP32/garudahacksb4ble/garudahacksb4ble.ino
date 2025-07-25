#include "ACS712.h" // Library for ACS712 current sensor
#include <ZMPT101B.h> // Library for ZMPT101B voltage sensor
#include <EEPROM.h> // Library for EEPROM to store persistent energy
#include <BLEDevice.h> // BLE core library
#include <BLEServer.h> // BLE server library
#include <BLEUtils.h> // BLE utilities
#include <BLE2902.h> // BLE descriptor for notification

// Sensor setup
ACS712 ACS(34, 3.3, 4095, 125); // Setup ACS712 on pin 34, 3.3V reference, 12-bit ADC, 125A model
ZMPT101B voltageSensor(35, 50.0); // Setup ZMPT101B on pin 35, expected max voltage = 50V

// EEPROM setup
#define EEPROM_SIZE 512 // EEPROM size to allocate
#define UNIT_ADDRESS 0 // EEPROM address to store total kWh

// Energy variables
float unit = 0.0; // Energy in kWh
float ratePerkWh = 6.5; // Cost per kWh in local currency
float cost = 0.0; // Total calculated cost
unsigned long lastMillis = 0; // Timestamp for energy time calculation

// BLE UUID definitions
#define SERVICE_UUID "6e400001-b5a3-f393-e0a9-e50e24dcca9e" // Custom service UUID
#define CHARACTERISTIC_UUID "6e400003-b5a3-f393-e0a9-e50e24dcca9e"  // Characteristic for notification

// BLE characteristic pointer
BLECharacteristic *pCharacteristic; // Pointer to BLE characteristic object

void setup() {
  Serial.begin(115200); // Initialize serial monitor
  EEPROM.begin(EEPROM_SIZE); // Begin EEPROM with defined size

  unit = EEPROM.readFloat(UNIT_ADDRESS); // Read stored kWh value
  if (isnan(unit)) unit = 0.0; // If data is invalid, reset to 0

  Serial.println("Energy Meter Starting..."); // Startup message
  Serial.print("Previous kWh: "); // Display previously stored energy
  Serial.println(unit, 4); // Print kWh value to 4 decimal places

  ACS.autoMidPoint(); // Automatically detect mid-point for ACS712 sensor
  voltageSensor.setSensitivity(500.0f); // Set sensitivity for ZMPT101B

  lastMillis = millis(); // Store initial timestamp

  // BLE Setup
  BLEDevice::init("ESP32_Energy_Meter"); // Initialize BLE device with name
  BLEServer *pServer = BLEDevice::createServer(); // Create BLE server
  BLEService *pService = pServer->createService(SERVICE_UUID); // Create custom service

  pCharacteristic = pService->createCharacteristic( // Create characteristic with notify/read
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_NOTIFY
  );

  pCharacteristic->addDescriptor(new BLE2902()); // Add descriptor to enable notifications
  pService->start(); // Start the BLE service
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising(); // Get BLE advertising object
  pAdvertising->start(); // Start BLE advertising
  Serial.println("BLE started, waiting for client..."); // Debug message
}

void loop() {
  float avg_mA = 0; // Average current in mA

  for (int i = 0; i < 100; i++) { // Take 100 samples
    avg_mA += ACS.mA_AC(); // Read AC current in mA
  }

  avg_mA /= 100.0; // Compute average
  int current_mA = (avg_mA > 5) ? avg_mA : 0; // Apply threshold to ignore noise

  float voltage = voltageSensor.getRmsVoltage(); // Read RMS voltage
  int volt = (voltage > 50) ? voltage : 0; // Apply minimum voltage threshold

  float watt = voltage * (avg_mA / 1000.0); // Calculate power in watts (P = V x I)
  int power = watt; // Convert to integer for display

  unsigned long currentMillis = millis(); // Get current time
  float deltaTime = (currentMillis - lastMillis) / 3600000.0; // Time in hours
  lastMillis = currentMillis; // Update last timestamp

  float kWh = watt * deltaTime; // Calculate kWh (Energy = P x t)
  unit += kWh; // Accumulate total energy
  cost = unit * ratePerkWh; // Calculate total cost

  // Serial output for monitoring
  Serial.print("Voltage: "); Serial.print(volt); Serial.println(" V"); // Print voltage
  Serial.print("Current: "); Serial.print(current_mA); Serial.println(" mA"); // Print current
  Serial.print("Power  : "); Serial.print(power); Serial.println(" W"); // Print power
  Serial.print("Energy : "); Serial.print(unit, 4); Serial.println(" kWh"); // Print energy
  Serial.print("Cost   : "); Serial.print(cost, 2); Serial.println(); // Print cost
  Serial.println("----"); // Separator

  // Format BLE data as CSV: "voltage,current,power"
  String bleData = String(volt) + "," + String(current_mA) + "," + String(power);
  pCharacteristic->setValue(bleData.c_str()); // Set BLE characteristic value
  pCharacteristic->notify(); // Send notification to client

  EEPROM.writeFloat(UNIT_ADDRESS, unit); // Save current kWh to EEPROM
  EEPROM.commit(); // Commit write to EEPROM

  delay(1000); // Delay for 1 second
}
