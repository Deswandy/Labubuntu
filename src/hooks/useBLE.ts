'use client';

import { useState, useCallback } from 'react';

// Extend Navigator type for TypeScript
declare global {
  interface Navigator {
    bluetooth: any;
  }
}

interface EnergySample {
  voltage: number;
  current: number;
  power: number;
}

export function useBLE() {
  const [data, setData] = useState<EnergySample[]>([]);
  const [connected, setConnected] = useState(false);

  const SERVICE_UUID = '6e400001-b5a3-f393-e0a9-e50e24dcca9e';
  const CHARACTERISTIC_UUID = '6e400003-b5a3-f393-e0a9-e50e24dcca9e';

  const connect = useCallback(async () => {
    try {
      console.log('Requesting Bluetooth device...');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'ESP32_Energy_Meter' }],
        optionalServices: [SERVICE_UUID],
      });

      console.log('Connecting to GATT server...');
      const server = await device.gatt?.connect();
      if (!server) throw new Error('Failed to connect to GATT server');

      console.log('Getting primary service...');
      const service = await server.getPrimaryService(SERVICE_UUID);

      console.log('Getting characteristic...');
      const characteristic = await service.getCharacteristic(CHARACTERISTIC_UUID);

      console.log('Starting notifications...');
      await characteristic.startNotifications();

    // Declare BluetoothRemoteGATTCharacteristic type if not available
    type BluetoothRemoteGATTCharacteristic = {
      value: DataView | null;
      addEventListener: (type: string, listener: EventListenerOrEventListenerObject) => void;
      startNotifications: () => Promise<void>;
    };

    interface CharacteristicValueChangedEvent extends Event {
      target: BluetoothRemoteGATTCharacteristic & EventTarget;
    }

    characteristic.addEventListener('characteristicvaluechanged', (event: CharacteristicValueChangedEvent) => {
      const value: DataView | null = (event.target as BluetoothRemoteGATTCharacteristic).value;
      if (!value) return;

      const decoder: TextDecoder = new TextDecoder('utf-8');
      const text: string = decoder.decode(value);

      console.log('Received:', text);

      const [voltStr, currentStr, powerStr]: string[] = text.split(',');
      const voltage: number = parseFloat(voltStr);
      const current: number = parseFloat(currentStr);
      const power: number = parseFloat(powerStr);

      if (!isNaN(voltage) && !isNaN(current) && !isNaN(power)) {
        setData((prev: EnergySample[]) => [...prev, { voltage, current, power }]);
      }
    });

      setConnected(true);
      console.log('Notifications started.');
    } catch (error) {
      console.error('BLE connection failed:', error);
    }
  }, []);

  return { data, connected, connect };
}
