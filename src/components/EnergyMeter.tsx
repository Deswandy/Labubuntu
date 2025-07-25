'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBLE } from '@/hooks/useBLE';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EnergyMeter() {
  const { data, connected, connect } = useBLE();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSeries, setTimeSeries] = useState<
    { time: number; voltage: number; current: number; power: number }[]
  >([]);
  const [summary, setSummary] = useState<{
    avrg_voltage: number;
    avrg_current: number;
    avrg_power: number;
    avrg_energy: number;
    cost: number;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (data.length === 0) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const now = Date.now();
    const elapsedSeconds = ((now - (startTime ?? now)) / 1000).toFixed(1);

    const latest = data[data.length - 1];
    setTimeSeries((prev) => [
      ...prev,
      {
        time: parseFloat(elapsedSeconds),
        voltage: latest.voltage,
        current: latest.current,
        power: latest.power,
      },
    ]);
  }, [data, startTime]);

  useEffect(() => {
    if (startTime && Date.now() - startTime >= 30_000 && summary === null) {
      // Calculate summary after 30 seconds
      const voltages = data.map((d) => d.voltage);
      const currents = data.map((d) => d.current);
      const powers = data.map((d) => d.power);

      const avrg_voltage = voltages.reduce((a, b) => a + b, 0) / voltages.length;
      const avrg_current = currents.reduce((a, b) => a + b, 0) / currents.length;
      const avrg_power = powers.reduce((a, b) => a + b, 0) / powers.length;

      // Energy in kWh = (Watt avg * time) / (1000 * 3600)
      const avrg_energy = (avrg_power * 30) / 3600 / 1000;

      const cost = avrg_energy * 1700;

      setSummary({
        avrg_voltage,
        avrg_current,
        avrg_power,
        avrg_energy,
        cost,
      });
    }
  }, [startTime, data, summary]);

const handleNext = async () => {
  const supabase = createClient();

  const { error } = await supabase.from('items').insert({
    name: 'ESP32 Meter Session',
    cost: summary?.cost ?? 0,
    desc: 'Auto-generated session',
    id_category: 1, // adjust to match your DB schema
    avrg_voltage: summary?.avrg_voltage ?? 0,
    avrg_current: summary?.avrg_current ?? 0,
    avrg_power: summary?.avrg_power ?? 0,
    avrg_energy: summary?.avrg_energy ?? 0,
  });

  if (error) {
    console.error('Supabase insert error:', error);
  } else {
    router.push('/dashboard');
  }
};


  const isRecording = startTime && Date.now() - startTime < 30_000;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>ESP32 Energy Meter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={connect} disabled={!!connected || !!isRecording}>
            {connected
              ? isRecording
                ? 'Recording...'
                : 'Connected'
              : 'Connect BLE'}
          </Button>

          <div className="h-80">
            {timeSeries.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No data yet. Connect to see chart.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="time"
                    label={{
                      value: 'Time (s)',
                      position: 'insideBottomRight',
                      offset: -5,
                    }}
                  />
                  <YAxis
                    label={{
                      value: 'Value',
                      angle: -90,
                      position: 'insideLeft',
                    }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="voltage"
                    stroke="#8884d8"
                    name="Voltage (V)"
                  />
                  <Line
                    type="monotone"
                    dataKey="current"
                    stroke="#82ca9d"
                    name="Current (mA)"
                  />
                  <Line
                    type="monotone"
                    dataKey="power"
                    stroke="#ff7300"
                    name="Power (W)"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {summary && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>🔋 Average Voltage: {summary.avrg_voltage.toFixed(2)} V</p>
            <p>🔌 Average Current: {summary.avrg_current.toFixed(2)} mA</p>
            <p>⚡ Average Power: {summary.avrg_power.toFixed(2)} W</p>
            <p>🔢 Average Energy: {summary.avrg_energy.toFixed(4)} kWh</p>
            <p>💰 Cost: Rp {Math.round(summary.cost)}</p>
            <Button className="mt-4" onClick={handleNext}>
              Next
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
