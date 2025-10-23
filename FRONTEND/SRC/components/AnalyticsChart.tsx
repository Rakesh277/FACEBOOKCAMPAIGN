// src/components/AnalyticsChart.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function AnalyticsChart({ data }: any) {
  if (!data || !data.data) return null;
  const formatted = data.data.map((item: any) => ({
    name: item.name,
    value: item.values?.[0]?.value
  }));

  return (
    <LineChart width={500} height={300} data={formatted}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <CartesianGrid stroke="#ccc" />
      <Line type="monotone" dataKey="value" stroke="#8884d8" />
    </LineChart>
  );
}
