import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Uppy
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import Tus from "@uppy/tus";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import { uploadFile } from "../lib/api";

const Uploads = () => {
  const navigate = useNavigate();

  const [previewSrc, setPreviewSrc] = useState(null);
  const [fileType, setFileType] = useState("");
  const [fileName, setFileName] = useState("");
  const [customFile, setCustomFile] = useState(null);
  const [uppyFile, setUppyFile] = useState(null);
  const [subject, setSubject] = useState("NLP");
  const [semester, setSemester] = useState("8");
  const [examType, setExamType] = useState("CIE");
  const [uploadMode, setUploadMode] =
useState("validation");



  const dragDropRef = useRef(null);
  const uppyRef = useRef(null);

  /* =======================
     MANUAL FILE UPLOAD
  ======================= */
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFile(file);
    setFileType(file.type);
    setFileName(file.name);

    // Image preview only
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewSrc(null);
    }
  };

  /* =======================
     UPPY SETUP
  ======================= */
  useEffect(() => {
    const uppy = new Uppy({
      autoProceed: false,
      restrictions: {
        maxNumberOfFiles: 1,
        allowedFileTypes: ["image/*", ".pdf", ".doc", ".docx"],
      },
    });

    uppy.use(Dashboard, {
      inline: true,
      target: dragDropRef.current,
      height: 300,
      proudlyDisplayPoweredByUppy: false,
    });

    uppy.use(Tus, {
      endpoint: "https://ai-based-document-validator.onrender.com/upload/file",
    });

    uppy.on("file-added", (file) => {
      setUppyFile(file);
    });

    uppy.on("upload-success", async (file, response) => {
      try {
        const uploadedFile =
          response?.body?.filePath ||
          response?.uploadURL?.replace("https://ai-based-document-validator.onrender.com", "");

        if (!uploadedFile) return;

        // 🔥 Save history
        await axios.post(
          "https://ai-based-document-validator.onrender.com",
          {
            image: uploadedFile,
            explanation:
              "Certificate validated successfully with AI — no tampering detected",
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        navigate("/app/validation", {
  state: {
    fileType: "uppy",
    file: file.name,
    filePath: uploadedFile,
    result: response.body // 🔥 ADD THIS
  },
});
      } catch (err) {
        console.error("History save failed", err);
        alert("Upload done but history not saved");
      }
    });

    uppyRef.current = uppy;
    return () => uppy.close();
  }, [navigate]);

  /* =======================
     PREVIEW UI
  ======================= */
  const renderPreview = () => {
    if (!customFile) return <span className="text-muted">No file selected</span>;

    if (fileType.startsWith("image/") && previewSrc) {
      return (
        <img
          src={previewSrc}
          alt="Preview"
          style={{ maxHeight: "100%", maxWidth: "100%" }}
        />
      );
    }

    return (
      <div className="text-center">
        <h1>
          {fileType.includes("pdf") ? "📕" : "📄"}
        </h1>
        <p className="fw-semibold">{fileName}</p>
        <small className="text-muted">
          {fileType.includes("pdf") ? "PDF Document" : "Word Document"}
        </small>
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      <div className="page-content container-fluid">

        <div className="row justify-content-center">

          {/* LEFT: MANUAL UPLOAD */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Custom File Upload</h4>
              </div>

              <div className="card-body">
                <div
                  className="d-flex justify-content-center align-items-center border rounded p-3"
                  style={{ height: 200 }}
                >
                  {renderPreview()}
                </div>

                <input
                  type="file"
                  id="manual-upload"
                  hidden
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  onChange={handleFileInputChange}
                />

                <label
                  htmlFor="manual-upload"
                  className="btn btn-primary mt-3"
                >
                  Upload File
                </label>

                <select
  className="form-control mt-3"

  value={uploadMode}

  onChange={(e) =>
    setUploadMode(e.target.value)
  }
>
  <option value="validation">
    Certificate Validation
  </option>

  <option value="answer-sheet">
    Answer Sheet Evaluation
  </option>
</select>

     {uploadMode ===
"answer-sheet" && (

<div className="mt-3">

  <input
    className="form-control mb-2"
    value={subject}
    onChange={(e) =>
      setSubject(e.target.value)
    }
    placeholder="Subject"
  />

  <input
    className="form-control mb-2"
    value={semester}
    onChange={(e) =>
      setSemester(e.target.value)
    }
    placeholder="Semester"
  />

  <input
    className="form-control"
    value={examType}
    onChange={(e) =>
      setExamType(e.target.value)
    }
    placeholder="Exam Type"
  />

</div>

)}

                
              </div>
            </div>
          </div>

  

          {/* RIGHT: DRAG & DROP */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h4 className="card-title">Drag & Drop Upload</h4>
              </div>
              <div className="card-body">
                <div ref={dragDropRef}></div>

                {uppyFile && (
                  <button className="btn btn-warning w-100 mt-3">
                    Analyze & Validate
                  </button>
                )}
              </div>
            </div>
          </div>

         {customFile && (

<button
  className="btn btn-success w-100 mt-3"

  onClick={async () => {

    try {

      const token =
      localStorage.getItem("token");

      if (!token) {

        alert("Login first bro!");
        navigate("/login");
        return;
      }

      // ======================
      // ANSWER SHEET MODE
      // ======================

      if (
        uploadMode ===
        "answer-sheet"
      ) {

        const formData =
        new FormData();

        formData.append(
          "file",
          customFile
        );

        formData.append(
          "subject",
          subject
        );

        formData.append(
          "semester",
          semester
        );

        formData.append(
          "examType",
          examType
        );

        const res =
        await axios.post(

          "https://ai-based-document-validator.onrender.com/api/student/upload-answer-sheet",

          formData,

          {
            headers: {

              Authorization:
              `Bearer ${token}`,

              "Content-Type":
              "multipart/form-data"
            }
          }
        );

        navigate(
          "/app/validation",
          {
            state: {

              result:
              res.data,

              fileType:
              "answer-sheet"
            }
          }
        );

      }

      // ======================
      // NORMAL VALIDATION MODE
      // ======================

      else {

        const res =
        await uploadFile(
          customFile
        );

        navigate(
          "/app/validation",
          {
            state: {

              fileType:
              "custom",

              file:
              res.data.fileName,

              filePath:
              res.data.filePath,

              result:
              res.data
            }
          }
        );
      }

    } catch (err) {

      console.log(err);

      alert("Operation failed");
    }
  }}
>

  {
    uploadMode ===
    "answer-sheet"

    ?

    "Evaluate Answer Sheet"

    :

    "Analyze & Validate"
  }

</button>

)}

        </div>

      </div>
    </div>
  );
};

export default Uploads;
