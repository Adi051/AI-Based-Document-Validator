import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const GaugeMeter = ({ value = 97 }) => {
  const data = {
    labels: ["Confidence Score", "Remaining"],
    datasets: [
      {
        data: [value, 100 - value],
        backgroundColor: ["#4caf50", "#e0e0e0"],
        borderWidth: 0,
        circumference: 180, // Semi-circle
        rotation: 270,      // Start angle
      },
    ],
  };

  const options = {
    cutout: "70%",
    responsive: true,
    animation: {
      animateRotate: true,
      duration: 1500,
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="verification-history-tab px-4 py-3">

      {/* Title */}
      <h4 className="fw-bold mb-4 text-center">Verification History</h4>

      {/* Gauge Meter */}
      <div className="d-flex justify-content-center mb-4">
        <div style={{ width: "200px" }}>
          <Doughnut data={data} options={options} />
        </div>
      </div>

      {/* Details */}
      <ul className="fs-6 mb-4">
        <li><strong>Current Validation</strong> — {value}% confidence</li>
        <li><strong>Institutional Verification</strong> — Verified by Demo University</li>
        
      </ul>

      {/* Button */}
      <div className="text-center">
        <button className="btn btn-dark px-4">Validate More Documents</button>
      </div>

    </div>
  );
};

export default GaugeMeter;
