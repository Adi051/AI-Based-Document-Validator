import React, { useState } from "react";
import { createSupportTicket } from "../lib/api";
import { toast } from "react-toastify";

const HelpSupport = () => {
  const [form, setForm] = useState({
    subject: "",
    category: "Technical",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await createSupportTicket(form);
      toast.success("🎫 Ticket submitted successfully!");
      setForm({ subject: "", category: "Technical", message: "" });
    } catch {
      toast.error("Failed to submit ticket");
    }
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">
        <div className="container-fluid support-page">

          {/* HERO HEADER */}
          <div className="support-hero mb-4">
            <h2>Help & Support Center</h2>
            <p>We’re here to help you 24/7 🚀</p>

            <div className="hero-stats">
              <div>
                <h4>⚡ 2h</h4>
                <span>Avg Response</span>
              </div>
              <div>
                <h4>📩 98%</h4>
                <span>Resolution Rate</span>
              </div>
              <div>
                <h4>🌍 24/7</h4>
                <span>Support Available</span>
              </div>
            </div>
          </div>

          <div className="row g-4">

            {/* TICKET FORM */}
            <div className="col-lg-6">
              <div className="support-card">
                <h5 className="mb-3">🎫 Raise Support Ticket</h5>

                <form onSubmit={submit}>
                  <div className="mb-3">
                    <label>Subject</label>
                    <input
                      className="form-control"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label>Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                    >
                      <option>Technical</option>
                      <option>Verification</option>
                      <option>Account</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label>Message</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button className="btn btn-dark w-100">
                    Submit Ticket
                  </button>
                </form>
              </div>
            </div>

            {/* FAQ SECTION */}
            <div className="col-lg-6">
              <div className="support-card">
                <h5 className="mb-3">❓ Frequently Asked Questions</h5>

                <div className="faq-item">
                  <h6>How to upload certificate?</h6>
                  <p>Go to Upload page and click Analyze & Validate.</p>
                </div>

                <div className="faq-item">
                  <h6>Is document secure?</h6>
                  <p>Yes, files are encrypted and stored safely.</p>
                </div>

                <div className="faq-item">
                  <h6>Can I download reports?</h6>
                  <p>Yes, after validation you can export PDF report.</p>
                </div>
              </div>
            </div>

          </div>

          {/* CONTACT CARDS */}
          <div className="row g-3 mt-4">
            <div className="col-md-4">
              <div className="contact-card">
                <h5>📧 Email</h5>
                <p>support@authvalidator.com</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-card">
                <h5>📞 Phone</h5>
                <p>+91 98765 43210</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="contact-card">
                <h5>💬 Live Chat</h5>
                <p>Coming Soon</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HelpSupport;
