import { Line } from "react-chartjs-2";

const lineColor = "rgb(96 165 250)";
const fillColor = "rgba(96, 165, 250, 0.12)";

export function StepsChart({ labels, values }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Steps",
        data: values,
        borderColor: lineColor,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#0f172a",
        pointBorderColor: lineColor,
        pointBorderWidth: 2,
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
        text: "Steps trend (last 7 days)",
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
        title: { display: true, text: "Steps", color: "#64748b" },
      },
    },
  };

  return (
    <div className="h-64 w-full sm:h-72">
      <Line data={data} options={options} />
    </div>
  );
}
