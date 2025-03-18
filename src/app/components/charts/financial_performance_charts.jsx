'use client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';

const COLORS = {
  yourCompany: '#7C3AED',
  competitorA: '#06B6D4',
  competitorB: '#F43F5E',
};

const chartStyles = {
  fontFamily: 'Poppins, sans-serif',
  fontSize: 12,
  fontWeight: 500,
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'rgba(17, 17, 17, 0.85)',
        padding: '8px 12px',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
        backdropFilter: 'blur(8px)',
        color: '#fff',
      }}>
        <p style={{ marginBottom: 2, color: '#9ca3af', fontSize: 12 }}>{label}</p>
        {payload.map((item) => (
          <p key={item.dataKey} style={{ margin: 0, color: item.color, fontSize: 12 }}>
            {item.name}: <strong>{item.value}</strong>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ChartContainer = ({ title, children }) => (
  <div style={{
    background: 'linear-gradient(145deg, #111827, #1f2937)',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
    marginBottom: '24px',
  }}>
    <h3 style={{
      fontFamily: 'Poppins, sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      color: '#fff',
      marginBottom: '12px',
      textAlign: 'center',
    }}>
      {title}
    </h3>
    {children}
  </div>
);

export const RevenueChart = ({ data }) => (
  <ChartContainer title="Quarterly Revenue Comparison">
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis
          dataKey="quarter"
          tick={{ fill: '#9ca3af', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 10 }}
          axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="yourCompany"
          stroke={COLORS.yourCompany}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.yourCompany }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="competitorA"
          stroke={COLORS.competitorA}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.competitorA }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="competitorB"
          stroke={COLORS.competitorB}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.competitorB }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);

export const EBITMarginChart = ({ data }) => (
  <ChartContainer title="EBIT Margin Comparison">
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis dataKey="quarter" tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="yourCompany"
          fill={COLORS.yourCompany}
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
        <Bar
          dataKey="competitorA"
          fill={COLORS.competitorA}
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
        <Bar
          dataKey="competitorB"
          fill={COLORS.competitorB}
          radius={[4, 4, 0, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  </ChartContainer>
);

export const FreeCashFlowChart = ({ data }) => (
  <ChartContainer title="Free Cash Flow Over Time">
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis dataKey="year" tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="yourCompany"
          stroke={COLORS.yourCompany}
          fillOpacity={0.2}
          fill={COLORS.yourCompany}
          strokeWidth={1.5}
        />
        <Area
          type="monotone"
          dataKey="competitorA"
          stroke={COLORS.competitorA}
          fillOpacity={0.2}
          fill={COLORS.competitorA}
          strokeWidth={1.5}
        />
        <Area
          type="monotone"
          dataKey="competitorB"
          stroke={COLORS.competitorB}
          fillOpacity={0.2}
          fill={COLORS.competitorB}
          strokeWidth={1.5}
        />
      </AreaChart>
    </ResponsiveContainer>
  </ChartContainer>
);

export const StockPerformanceChart = ({ data }) => (
  <ChartContainer title="Monthly Stock Performance">
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data}>
        <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <YAxis tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="yourCompany"
          stroke={COLORS.yourCompany}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.yourCompany }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="competitorA"
          stroke={COLORS.competitorA}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.competitorA }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="competitorB"
          stroke={COLORS.competitorB}
          strokeWidth={2}
          dot={{ r: 3, fill: COLORS.competitorB }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
);
