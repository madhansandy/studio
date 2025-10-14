"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell, Line, LineChart } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const prescriptionData = [
  { name: 'Jan', safe: 4, caution: 2, risk: 1 },
  { name: 'Feb', safe: 3, caution: 1, risk: 0 },
  { name: 'Mar', safe: 5, caution: 3, risk: 1 },
  { name: 'Apr', safe: 2, caution: 1, risk: 0 },
  { name: 'May', safe: 6, caution: 2, risk: 2 },
  { name: 'Jun', safe: 4, caution: 1, risk: 0 },
];

const alertsData = [
  { name: 'Low Stock', value: 3 },
  { name: 'Expiring Soon', value: 1 },
];
const ALERT_COLORS = ['#FBBF24', '#F87171'];

const healthTrendData = [
    { date: '2024-07-01', symptomScore: 2 },
    { date: '2024-07-02', symptomScore: 3 },
    { date: '2024-07-03', symptomScore: 1 },
    { date: '2024-07-04', symptomScore: 4 },
    { date: '2024-07-05', symptomScore: 2 },
    { date: '2024-07-06', symptomScore: 3 },
    { date: '2024-07-07', symptomScore: 1 },
];

export function PrescriptionSummaryChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescription Validation Summary</CardTitle>
        <CardDescription>Number of prescriptions by safety level over the last 6 months.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={prescriptionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="safe" stackId="a" fill="hsl(var(--chart-1))" name="Safe (PSS > 80)" />
            <Bar dataKey="caution" stackId="a" fill="hsl(var(--chart-2))" name="Caution (PSS 50-79)" />
            <Bar dataKey="risk" stackId="a" fill="hsl(var(--destructive))" name="High Risk (PSS < 50)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AlertsChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Upcoming Medication Alerts</CardTitle>
                <CardDescription>Breakdown of current medication alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={alertsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            nameKey="name"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                            {alertsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={ALERT_COLORS[index % ALERT_COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export function HealthTrendChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Health Trend Visualization</CardTitle>
                <CardDescription>Symptom severity tracking over the past week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="symptomScore" name="Symptom Score" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
