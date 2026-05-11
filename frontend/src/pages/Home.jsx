import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <div
        className="home-section d-flex justify-content-center align-items-center"
        style={{
          minHeight: "calc(100vh - 80px)",
          transition: "all 1s ease",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(30px)",
        }}
      >
        <div className="text-center" style={{ maxWidth: "800px" }}>
          {/* Heading */}
          <h1
            className="fw-bold display-5"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease",
              transitionDelay: "0.2s",
            }}
          >
            A Secure Framework for Academic Document <br /> and Content
            Authentication
          </h1>

          {/* Subtext */}
          <p
            className="mt-3 fs-5 home-subtext"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease",
              transitionDelay: "0.4s",
            }}
          >
            Protect academic integrity with our AI-powered certificate
            validation platform. Detect forgeries, plagiarism, and AI-generated
            content with industry-leading accuracy.
          </p>

          {/* Buttons */}
          <div
            className="d-flex justify-content-center gap-3 mt-4"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease",
              transitionDelay: "0.6s",
            }}
          >
            <Link to="/Login" style={{ textDecoration: "none" }}>
              <button
                className="btn px-4 py-2 home-btn-dark"
                style={{
                  borderRadius: "8px",
                  transition: "0.3s",
                }}
              >
                Login
              </button>
            </Link>

            <Link to="/signup" style={{ textDecoration: "none" }}>
              <button
                className="btn px-4 py-2 home-btn-light"
                style={{
                  borderRadius: "8px",
                  transition: "0.3s",
                  fontWeight: "600",
                }}
              >
                Sign Up
              </button>
            </Link>
          </div>

          {/* Accuracy Badge */}
          <div
            className="home-card text-center rounded shadow-sm mt-5 mx-auto p-3"
            style={{
              maxWidth: "350px",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease",
              transitionDelay: "0.8s",
            }}
          >
            <span className="fw-semibold text-success">
              98.7% Detection Accuracy
            </span>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="home-section py-5">
        <h2
          className="fw-bold text-center mb-2"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease",
            transitionDelay: "1s",
          }}
        >
          Powerful Features
        </h2>

        <p
          className="text-center mb-5 home-subtext"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease",
            transitionDelay: "1.2s",
          }}
        >
          Everything you need to verify academic credentials with confidence
        </p>

        {/* CARDS GRID */}
        <div className="container">
          <div className="row g-4">
            {[
              {
                icon: "📄",
                title: "Document Analysis",
                text: "Deep learning evaluates certificate structure & authenticity.",
              },
              {
                icon: "🤖",
                title: "AI Detection",
                text: "Detect forged, manipulated or AI-generated content.",
              },
              {
                icon: "🔍",
                title: "QR Code Verification",
                text: "Verify documents instantly with blockchain QR codes.",
              },
              {
                icon: "🛡",
                title: "Authenticity Checks",
                text: "Multi-layered security ensures tamper-proof validation.",
              },
              {
                icon: "📊",
                title: "Detailed Reports",
                text: "Get analytics, confidence score & verification logs.",
              },
              {
                icon: "🏛",
                title: "Institution Portal",
                text: "Manage & verify documents on an institute dashboard.",
              },
            ].map((card, index) => (
              <div className="col-md-4" key={index}>
                <div
                  className="home-card p-4 rounded shadow-sm h-100"
                  style={{
                    opacity: loaded ? 1 : 0,
                    transform: loaded
                      ? "translateY(0)"
                      : "translateY(40px)",
                    transition: "all 0.9s ease",
                    transitionDelay: `${1.3 + index * 0.15}s`,
                  }}
                >
                  <h5 className="fw-semibold">
                    {card.icon} {card.title}
                  </h5>
                  <p className="mt-2 home-subtext">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
