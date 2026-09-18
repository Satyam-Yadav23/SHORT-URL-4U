import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import axiosInstance from "../utils/axiosinstance.js";

const ForgotPassword = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axiosInstance.post("/api/auth/forgot-password", { email });
      setSuccess(true);
      setTimeout(() => {
        onBack?.();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to send reset link"
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      {!success ? (
        <>
          {/* Title */}
          <div style={styles.titleRow}>
            <h2 style={styles.title}>Reset Password</h2>
            <p style={styles.subtitle}>Enter your email to receive reset instructions</p>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={{ fontSize: 15 }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="forgot-email">
                Email Address
              </label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>✉</span>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="email"
                  style={styles.input}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={styles.spinner} /> Sending...
                </span>
              ) : (
                "Send Reset Link →"
              )}
            </button>
          </form>

          {/* Back Button */}
          <button
            type="button"
            onClick={onBack}
            style={styles.backBtn}
          >
            ← Back to Login
          </button>
        </>
      ) : (
        <div style={styles.successBox}>
          <span style={styles.successIcon}>✓</span>
          <h3 style={styles.successTitle}>Check your email!</h3>
          <p style={styles.successText}>
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <p style={styles.successSmallText}>
            The link will expire in 15 minutes.
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    fontFamily: "'Outfit', sans-serif",
  },
  titleRow: { marginBottom: 4 },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 800,
    fontSize: 22,
    margin: "0 0 4px",
    color: "#2d3142",
  },
  subtitle: { margin: 0, fontSize: 13, color: "#555" },

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "rgba(157,132,32,0.1)",
    border: "1px solid rgba(157,132,32,0.3)",
    borderRadius: 8,
    padding: "10px 14px",
    color: "#806b16",
    fontSize: 13,
  },

  form: { display: "flex", flexDirection: "column", gap: 18 },

  fieldGroup: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#666",
    marginBottom: 8,
    display: "block",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute",
    left: 14,
    fontSize: 14,
    pointerEvents: "none",
    opacity: 0.5,
  },
  input: {
    width: "100%",
    background: "#fcfaf9",
    border: "1px solid rgba(45,49,66,0.16)",
    borderRadius: 10,
    padding: "12px 14px 12px 40px",
    color: "#2d3142",
    fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },

  submitBtn: {
    width: "100%",
    background: "#2f6690",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    padding: "13px 20px",
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "opacity 0.15s, transform 0.1s",
    marginTop: 4,
  },
  spinner: {
    display: "inline-block",
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  backBtn: {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(157,132,32,0.45)",
    borderRadius: 10,
    color: "#806b16",
    fontSize: 14,
    fontWeight: 500,
    padding: "12px 20px",
    cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "background 0.2s, border-color 0.2s",
  },

  successBox: {
    textAlign: "center",
    padding: "30px 20px",
    background: "rgba(46,213,115,0.08)",
    border: "1px solid rgba(46,213,115,0.25)",
    borderRadius: 12,
  },
  successIcon: {
    fontSize: 48,
    display: "block",
    marginBottom: 12,
    color: "#2ed573",
  },
  successTitle: {
    fontFamily: "'Syne', sans-serif",
    fontWeight: 700,
    fontSize: 18,
    margin: "0 0 8px",
    color: "#2d3142",
  },
  successText: {
    margin: "0 0 12px",
    fontSize: 14,
    color: "#999",
    lineHeight: 1.5,
  },
  successSmallText: {
    margin: 0,
    fontSize: 12,
    color: "#666",
  },
};

export default ForgotPassword;
