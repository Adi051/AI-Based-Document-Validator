import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

/* 🔹 Detect file type */
const getFileType = (path) => {
  if (!path) return "unknown";
  const ext = path.split(".").pop().toLowerCase();

  if (["png", "jpg", "jpeg", "gif"].includes(ext)) return "image";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext)) return "doc";
  return "other";
};

/* 🔹 Convert backend path → full URL */
const formatFilePath = (path) => {
  if (!path) return "https://via.placeholder.com/300x200?text=No+Preview";
  if (path.startsWith("http")) return path;
  return `https://ai-based-document-validator.onrender.com${path}`;
};

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("https://ai-based-document-validator.onrender.com/history/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHistory(res.data);
    } catch (err) {
      console.log("History Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await axios.delete(`https://ai-based-document-validator.onrender.com/history/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.log("Delete Failed:", err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container-fluid" style={{ marginLeft: "260px", marginTop: "100px" }}>
        <h3 className="fw-bold mb-4">Verification History</h3>

        {loading ? (
          <p>Loading...</p>
        ) : history.length === 0 ? (
          <div className="text-center mt-5">
            <h5>No Documents Found</h5>
            <Link to="/app/uploads">
              <button className="btn btn-primary mt-3">Upload Document</button>
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {history.map((item) => {
              const type = getFileType(item.image);
              const fileUrl = formatFilePath(item.image);

              return (
                <div className="col-md-4" key={item._id}>
                  <div className="card shadow-sm border-0 p-2 position-relative">

                    {/* DELETE */}
                    <button
                      className="btn btn-sm btn-danger position-absolute"
                      style={{ top: "10px", right: "10px", zIndex: 10 }}
                      onClick={() => deleteHistory(item._id)}
                    >
                      🗑
                    </button>

                    {/* 🔹 PREVIEW SECTION */}
                    {type === "image" && (
                      <img
                        src={fileUrl}
                        className="card-img-top rounded"
                        style={{ height: "200px", objectFit: "cover" }}
                        alt="preview"
                      />
                    )}

                    {type === "pdf" && (
                      <iframe
                        src={fileUrl}
                        title="PDF Preview"
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "8px",
                          border: "none",
                        }}
                      />
                    )}

                    {type === "doc" && (
                      <div
                        className="d-flex flex-column justify-content-center align-items-center"
                        style={{
                          height: "200px",
                          background: "#f4f6f8",
                          borderRadius: "8px",
                        }}
                      >
                        📄 Document File
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-primary mt-2"
                        >
                          View File
                        </a>
                      </div>
                    )}

                    {type === "other" && (
                      <div
                        className="d-flex justify-content-center align-items-center"
                        style={{
                          height: "200px",
                          background: "#eee",
                          borderRadius: "8px",
                        }}
                      >
                        📁 File Uploaded
                      </div>
                    )}

                    {/* TEXT */}
                    <div className="card-body">
                      <p className="text-muted small mb-1">
                        {item.timestamp
                          ? new Date(item.timestamp).toLocaleDateString("en-GB")
                          : "No Date"}
                      </p>

                      <h6 className="fw-semibold" style={{ minHeight: "45px" }}>
                        {item.explanation
                          ? item.explanation.slice(0, 55)
                          : "Verified Successfully"}
                        ...
                      </h6>

                      <Link to="/app/validation" state={item}>
                        <button className="btn btn-primary w-100 mt-3">
                          View Full Report
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
