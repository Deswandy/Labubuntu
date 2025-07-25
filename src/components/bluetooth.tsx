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

export default function EnergyMeter() {
  const { data, connected, connect } = useBLE();
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSeries, setTimeSeries] = useState<
    { time: number; voltage: number; current: number; power: number }[]
  >([]);

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

  const isRecording = startTime && Date.now() - startTime < 30_000;

  return (
    <Card className="max-w-3xl mx-auto">
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
                  label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                  label={{ value: 'Value', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="voltage" stroke="#8884d8" name="Voltage (V)" />
                <Line type="monotone" dataKey="current" stroke="#82ca9d" name="Current (mA)" />
                <Line type="monotone" dataKey="power" stroke="#ff7300" name="Power (W)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
