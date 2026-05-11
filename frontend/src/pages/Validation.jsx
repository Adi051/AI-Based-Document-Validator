import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import GaugeMeter from "../components/GaugeMeter";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

export default function ValidationPage() {

  const location = useLocation();
  const fileDetails = location.state;
  const result = fileDetails?.result;

  const [activeTab, setActiveTab] = useState("data");
  const [isSaved, setIsSaved] = useState(false);

  const explanation =
    "AI validation completed successfully. No tampering detected.";

  useEffect(() => {
    if (!fileDetails || !fileDetails.filePath || isSaved) return;

    const saveHistory = async () => {
      try {
        await axios.post(
          "https://ai-based-document-validator.onrender.com///history",
          {
            image: fileDetails.filePath,
            explanation,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsSaved(true);
      } catch (err) {
        console.log("History error", err);
      }
    };

    saveHistory();
  }, [fileDetails, isSaved]);
  const formatAadhaar = (num) => {
  if (!num) return "Not detected";

  const clean = num.replace(/\D/g, "");

  if (clean.length < 4) return "Not detected";

  return "XXXX XXXX " + clean.slice(-4);
};

  if (!result) {
    return <h3 style={{ marginLeft: "300px" }}>Loading result...</h3>;
  }
  // ==============================
// ANSWER SHEET RESULT UI
// ==============================

if (
  fileDetails?.fileType ===
  "answer-sheet"
) {

  return (

    <div
      style={{
        marginLeft: "260px",
        marginTop: "100px",
        padding: "20px",
        maxWidth: "1100px"
      }}
    >

      <h2 className="fw-bold mb-3">
        Answer Sheet Evaluation
      </h2>

      <div className="card p-4 shadow-sm">

        <h4 className="mb-3">
          Total Score:
          {" "}
          {result.totalScore}
        </h4>

        <h5 className="mb-4">
          Total Questions:
          {" "}
          {result.totalQuestions}
        </h5>

        {

          result.results.map(
            (item, index) => (

            <div
              key={index}
              className="border rounded p-3 mb-3"
            >

              <h5>
                Q{index + 1}.
                {" "}
                {item.question}
              </h5>

              <p>
                <b>
                  Student Question:
                </b>
                {" "}
                {
                  item.studentQuestion
                }
              </p>

              <p>
                <b>
                  Score:
                </b>
                {" "}
                {item.score}
              </p>

              <p>
                <b>
                  Percentage:
                </b>
                {" "}
                {item.percentage}%
              </p>

              <p>
                <b>
                  Matched Keywords:
                </b>
                {" "}
                {

                  item.matchedKeywords?.join(", ")
                }
              </p>

            </div>
          ))
        }

      </div>

    </div>
  );
}
  return (
    <div
      style={{
        marginLeft: "260px",
        marginTop: "100px",
        padding: "20px",
        maxWidth: "1100px",
        background: "linear-gradient(135deg,#f8fafc,#e2e8f0)",
      }}
    >
      <h2 className="fw-bold mb-2">Validation Results</h2>
      <p className="text-muted mb-4">AI-powered document verification</p>

      <div className="row g-4">

        {/* LEFT PANEL */}
        <div className="col-md-3">
          <motion.div
            className="card shadow-sm p-3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
          >
            <h5 className="fw-semibold">Processed File</h5>

            <div className="mt-3 p-2 rounded border">
              <p className="mb-0 fw-semibold">{fileDetails?.file}</p>

              <span
                style={{
                  color:
                    result.status === "Authentic"
                      ? "#22c55e"
                      : result.status === "Suspicious"
                      ? "#f59e0b"
                      : "#ef4444",
                  textShadow:
                    result.status === "Authentic"
                      ? "0 0 12px #22c55e"
                      : "0 0 12px #f59e0b",
                  fontWeight: "bold",
                }}
              >
                {result.status}
              </span>

              <span className="float-end fw-bold">
                {result.score}%
              </span>
            </div>
          </motion.div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-9">
          <motion.div
            className="card shadow-sm p-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >

            <h5 className="fw-bold">{fileDetails?.file}</h5>
            <p className="text-muted">{explanation}</p>

            {/* SCORE */}
            <div className="row text-center my-4">

              <div className="col">
                <motion.h2
                  className="fw-bold text-success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {result.score}%
                </motion.h2>
                <p className="text-muted">Confidence</p>
              </div>

              <div className="col">
                <h4>{result.processingTime || "2s"}</h4>
                <p className="text-muted">Processing</p>
              </div>

              <div className="col">
                <h4>{Object.keys(result.checks || {}).length}</h4>
                <p className="text-muted">Checks</p>
              </div>

            </div>

            <hr />

            {/* TABS */}
            <div className="d-flex gap-4 mb-4 fw-semibold">
              {["data", "technical", "history"].map((tab) => (
                <span
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    cursor: "pointer",
                    color: activeTab === tab ? "#000" : "#888",
                    borderBottom: activeTab === tab ? "2px solid #000" : "",
                  }}
                >
                  {tab === "data"
                    ? "Certificate Data"
                    : tab === "technical"
                    ? "AI Analysis"
                    : "Score View"}
                </span>
              ))}
            </div>

            {/* DATA TAB */}
            {activeTab === "data" && (
              <div>
                <p><b>Document Type:</b> {result.documentType}</p>
                <p><b>PRN:</b> {result.extractedPRN || "Not Found"}</p>
                <p><b>Status:</b> {result.status}</p>
                <p><b>Aadhaar:</b> {formatAadhaar(result?.checks?.aadhaarNumber)}</p>             
                 </div>
            )}

            {/* TECHNICAL TAB */}
            {activeTab === "technical" && (
              <div className="row">
                {Object.entries(result.checks || {}).map(([key, val], i) => (
                  <motion.div
                    key={key}
                    className="col-md-6 mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div
                      className="p-3 rounded shadow-sm"
                      style={{
                        background: "#fff",
                        borderLeft: "5px solid #111",
                      }}
                    >
                      <b>{key}</b>
                      <div>
                        {typeof val === "boolean"
                          ? val ? "✔ Passed" : "❌ Failed"
                          : val}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* GAUGE */}
            {activeTab === "history" && (
              <motion.div
                className="text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <GaugeMeter value={result.score} />
              </motion.div>
            )}

            <div className="text-center mt-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-dark"
              >
                <Link to="/app/uploads" style={{ color: "#fff", textDecoration: "none" }}>
                  Validate More Documents
                </Link>
              </motion.button>
            </div>

          </motion.div>
        </div>

      </div>
    </div>
  );
}