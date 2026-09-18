import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import axiosInstance from "../utils/axiosinstance.js";

const ResetPassword = () => {
  const { token } = useParams({ from: "/reset-password/$token" });
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await axiosInstance.post(`/api/auth/reset-password/${token}`, {
        password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate({ to: "/auth" });
      }, 2000);
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to reset password"
      );
    }
  };

  return (
    <div style={styles.wrapper}>
      {!success ? (
        <>
          {/* Title */}
          <div style={styles.titleRow}>
            <h2 style={styles.title}>Create New Password</h2>
            <p style={styles.subtitle}>Enter a strong password for your account</p>
          </div>

          {/* Error */}
          {error && (
            <div style={styles.errorBox}>
              <span style={{ fontSize: 15 }}>⚠</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* New Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="new-password">
                New Password
              </label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  id="new-password"
                  type={showPass ? "text" : "password"}
                  placeholder="Enter new password (min 6 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="new-password"
                  style={{ ...styles.input, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={styles.eyeBtn}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={styles.fieldGroup}>
              <label style={styles.label} htmlFor="confirm-password">
                Confirm Password
              </label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  id="confirm-password"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="new-password"
                  style={{ ...styles.input, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  style={styles.eyeBtn}
                >
                  {showConfirmPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            <div style={styles.requirementsBox}>
              <p style={styles.requirementTitle}>Password Requirements:</p>
              <ul style={styles.requirementsList}>
                <li style={styles.requirementItem}>
                  <span style={{ color: password.length >= 6 ? "#2ed573" : "#999" }}>
                    {password.length >= 6 ? "✓" : "○"}
                  </span>
                  {" "}At least 6 characters
                </li>
                <li style={styles.requirementItem}>
                  <span style={{ color: password === confirmPassword && password ? "#2ed573" : "#999" }}>
                    {password === confirmPassword && password ? "✓" : "○"}
                  </span>
                  {" "}Passwords match
                </li>
              </ul>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={styles.spinner} /> Resetting...
                </span>
              ) : (
                "Reset Password →"
              )}
            </button>
          </form>
        </>
      ) : (
        <div style={styles.successBox}>
          <span style={styles.successIcon}>✓</span>
          <h3 style={styles.successTitle}>Password Reset Successfully!</h3>
          <p style={styles.successText}>
            Your password has been updated. Redirecting you to login...
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
  eyeBtn: {
    position: "absolute",
    right: 12,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    opacity: 0.5,
    padding: 4,
  },

  requirementsBox: {
    background: "rgba(100,100,100,0.05)",
    border: "1px solid rgba(100,100,100,0.1)",
    borderRadius: 8,
    padding: "12px 14px",
  },
  requirementTitle: {
    margin: "0 0 8px",
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    color: "#666",
  },
  requirementsList: {
    margin: 0,
    paddingLeft: 0,
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  requirementItem: {
    fontSize: 12,
    color: "#999",
    display: "flex",
    alignItems: "center",
    gap: 6,
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
    margin: 0,
    fontSize: 14,
    color: "#999",
    lineHeight: 1.5,
  },
};

export default ResetPassword;
