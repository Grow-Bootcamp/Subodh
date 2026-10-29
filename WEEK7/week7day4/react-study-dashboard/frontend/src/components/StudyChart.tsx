import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartItem = {
  topic: string;
  hours: number;
};

export default function StudyChart({ data }: { data: ChartItem[] }) {
  if (data.length === 0) {
    return <p className="muted">Add a session to see the chart</p>;
  }

  return (
    <div className="chart-wrap">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 12, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="topic" />
          <YAxis allowDecimals />
          <Tooltip formatter={(value) => [`${value} hours`, "Study time"]} />
          <Bar dataKey="hours" fill="#6558d9" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
