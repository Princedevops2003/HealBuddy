import { Bar } from "react-chartjs-2";

const teal = "rgb(45 212 191)";
const tealMuted = "rgba(45, 212, 191, 0.25)";

export function WaterChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Water (L)",
        data: values,
        backgroundColor: tealMuted,
        borderColor: teal,
        borderWidth: 2,
        borderRadius: 8,
        maxBarThickness: 36,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Water intake (last 7 days)",
        color: "#94a3b8",
        font: { size: 14, weight: "600" },
        padding: { bottom: 12 },
      },
      tooltip: {
        backgroundColor: "#1e293b",
        titleColor: "#f1f5f9",
        bodyColor: "#cbd5e1",
        borderColor: "#334155",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(148, 163, 184, 0.08)" },
        ticks: { color: "#94a3b8", maxRotation: 45, minRotation: 0 },
      },
      y: {
        beginAtZero: true,
        grid: { color: "rgba(148, 163, 184, 0.08)" },
        ticks: { color: "#94a3b8" },
        title: { display: true, text: "Liters", color: "#64748b" },
      },
    },
  };

  return (
    <div className="h-64 w-full sm:h-72">
      <Bar data={data} options={options} />
    </div>
  );
}
