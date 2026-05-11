import React, { useEffect, useState } from "react";
import { getMySettings, updateMySettings } from "../lib/api";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("appearance");
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    theme: "auto",
    fontSize: "medium",
    compactSidebar: false,

    aiSensitivity: 75,
    plagiarismThreshold: 85,
    watermark: true,
    allowPDF: true,
    allowImages: true,
    allowDocs: false,

    twoFA: false,
    blockchainMode: "hybrid",
    reAuthNeeded: true,

    emailAlerts: true,
    weeklySummary: true,
    systemIncidents: false,
  });

  /* ===============================
     LOAD SETTINGS FROM BACKEND
  =============================== */
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getMySettings();
        if (res?.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error("Settings load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ===============================
     APPLY SETTINGS TO UI 🔥🔥
     THIS IS STEP 3 & 4 FIX
  =============================== */
  useEffect(() => {
    if (loading) return;

    /* THEME */
    if (settings.theme === "dark") {
      document.body.setAttribute("data-layout-mode", "dark");
    } else if (settings.theme === "light") {
      document.body.setAttribute("data-layout-mode", "light");
    } else {
      document.body.removeAttribute("data-layout-mode");
    }

    /* FONT SIZE */
    document.body.setAttribute("data-font-size", settings.fontSize);

    /* SIDEBAR */
    if (settings.compactSidebar) {
      document.body.classList.add("sidebar-compact");
    } else {
      document.body.classList.remove("sidebar-compact");
    }

    /* SAVE TO BACKEND */
    updateMySettings(settings);
  }, [settings, loading]);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-content text-center p-5">
          <h5 className="text-muted">Loading settings...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="page-content container-fluid">

        <h3 className="fw-bold mb-3">Settings</h3>
        <p className="text-muted mb-4">
          Personalize your experience & control verification behavior
        </p>

        <div className="row g-4">
          {/* LEFT NAV */}
          <div className="col-md-3">
            <div className="settings-nav">
              {[
                ["appearance", "Appearance"],
                ["verification", "Verification"],
                ["security", "Security"],
                ["notifications", "Notifications"],
              ].map(([k, l]) => (
                <button
                  key={k}
                  className={`settings-nav-item ${activeTab === k ? "active" : ""}`}
                  onClick={() => setActiveTab(k)}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-md-9">

            {activeTab === "appearance" && (
              <div className="settings-card">
                <h5>Appearance</h5>

                <div className="settings-row">
                  <span>Theme</span>
                  <div className="btn-group">
                    {["auto", "light", "dark"].map((t) => (
                      <button
                        key={t}
                        className={`btn ${settings.theme === t ? "btn-dark" : "btn-outline-secondary"}`}
                        onClick={() => update("theme", t)}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="settings-row">
                  <span>Font Size</span>
                  <select
                    className="form-select w-auto"
                    value={settings.fontSize}
                    onChange={(e) => update("fontSize", e.target.value)}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div className="settings-row">
                  <span>Compact Sidebar</span>
                  <input
                    type="checkbox"
                    checked={settings.compactSidebar}
                    onChange={(e) => update("compactSidebar", e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "verification" && (
              <div className="settings-card">
                <h5>Verification</h5>

                <div className="settings-row">
                  <span>AI Sensitivity</span>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={settings.aiSensitivity}
                    onChange={(e) => update("aiSensitivity", Number(e.target.value))}
                  />
                  <strong>{settings.aiSensitivity}%</strong>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="settings-card">
                <h5>Security</h5>

                <div className="settings-row">
                  <span>Two Factor Auth</span>
                  <input
                    type="checkbox"
                    checked={settings.twoFA}
                    onChange={(e) => update("twoFA", e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="settings-card">
                <h5>Notifications</h5>

                <div className="settings-row">
                  <span>Email Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.emailAlerts}
                    onChange={(e) => update("emailAlerts", e.target.checked)}
                  />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
