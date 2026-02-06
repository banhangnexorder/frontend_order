import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function OrdersChart({ data }) {
  return (
    <div className="chart-card">
      <h3>📈 Đơn & Doanh thu</h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="orders"
            stroke="var(--coffee-medium)"
            strokeWidth={3}
            name="Số đơn"
          />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="var(--success)"
            strokeWidth={3}
            name="Doanh thu"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
