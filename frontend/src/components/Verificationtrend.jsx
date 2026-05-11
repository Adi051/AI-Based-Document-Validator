// src/components/VerificationTrend.jsx
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";

// Register Chart Elements
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const VerificationTrend = () => {

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Documents Verified",
        data: [12, 19, 15, 22, 28, 35],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false }},
      y: { beginAtZero: true }
    }
  };

  return (
    <div className="card p-3">
      <h5 className="fw-bold mb-3">Document Verification Trend</h5>
      <Line data={data} options={options} />
    </div>
  );
};

export default VerificationTrend;
