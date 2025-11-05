"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GarbageChart({ data }) {
    if (!data || data.length === 0) {
        return <div style={{ color: 'white', textAlign: 'center' }}>No data to display</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
                <XAxis 
                    dataKey="frame" 
                    stroke="white"
                    tick={{ fill: 'white' }}
                    label={{ value: 'Seconds', position: 'insideBottom', offset: -10, fill: 'white' }}
                />
                <YAxis 
                    stroke="white"
                    tick={{ fill: 'white' }}
                    label={{ value: 'Garbage Count', angle: -90, position: 'insideLeft', fill: 'white', dy: 50 }}
                />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#010416', 
                        border: '1px solid white', 
                        color: 'white',
                        borderRadius: '8px'
                    }}
                    itemStyle={{ color: 'white' }}
                />
                <Line 
                    type="monotone" 
                    dataKey="garbage" 
                    stroke="#FFFFFF"
                    strokeWidth={2}
                    dot={{ fill: '#3696ac', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

