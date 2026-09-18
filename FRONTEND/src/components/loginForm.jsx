import React, { useState } from "react";
import { loginUser } from "../api/user.api.js";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice.js";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";

const LoginForm = ({ state, showForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await loginUser(email, password);
      dispatch(login(data.user));
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate({ to: "/dashboard" });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Title */}
      <div style={styles.titleRow}>
        <h2 style={styles.title}>Sign In</h2>
        <p style={styles.subtitle}>Enter your credentials to continue</p>
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
          <label style={styles.label} htmlFor="login-email">Email Address</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>✉</span>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              autoComplete="email"
              style={styles.input}
            />
          </div>
        </div>

        {/* Password */}
        <div style={styles.fieldGroup}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <label style={styles.label} htmlFor="login-password">Password</label>
            <button
              type="button"
              onClick={() => showForgotPassword?.()}
              style={styles.forgotLink}
            >
              Forgot password?
            </button>
          </div>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              id="login-password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              required
              autoComplete="current-password"
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <span style={styles.spinner} /> Signing in...
            </span>
          ) : (
            "Sign In →"
          )}
        </button>
      </form>

      {/* Divider */}
      <div style={styles.divider}>
        <div style={styles.dividerLine} />
        <span style={styles.dividerText}>Don't have an account?</span>
        <div style={styles.dividerLine} />
      </div>

      {/* Switch to Register */}
      <button
        type="button"
        onClick={() => state(false)}
        style={styles.switchBtn}
      >
        Create a free account
      </button>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex", flexDirection: "column", gap: 20,
    fontFamily: "'Outfit', sans-serif",
  },
  titleRow: { marginBottom: 4 },
  title: {
    fontFamily: "'Syne', sans-serif", fontWeight: 800,
    fontSize: 22, margin: "0 0 4px", color: "#2d3142",
  },
  subtitle: { margin: 0, fontSize: 13, color: "#555" },

  errorBox: {
    display: "flex", alignItems: "center", gap: 8,
    background: "rgba(157,132,32,0.1)",
    border: "1px solid rgba(157,132,32,0.3)",
    borderRadius: 8, padding: "10px 14px",
    color: "#806b16", fontSize: 13,
  },

  form: { display: "flex", flexDirection: "column", gap: 18 },

  fieldGroup: { display: "flex", flexDirection: "column" },
  label: {
    fontSize: 11, fontWeight: 600, letterSpacing: "0.1em",
    textTransform: "uppercase", color: "#666", marginBottom: 8,
    display: "block",
  },
  inputWrap: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: {
    position: "absolute", left: 14, fontSize: 14,
    pointerEvents: "none", opacity: 0.5,
  },
  input: {
    width: "100%", background: "#fcfaf9",
    border: "1px solid rgba(45,49,66,0.16)",
    borderRadius: 10, padding: "12px 14px 12px 40px",
    color: "#2d3142", fontSize: 14,
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  eyeBtn: {
    position: "absolute", right: 12,
    background: "none", border: "none",
    cursor: "pointer", fontSize: 14, opacity: 0.5,
    padding: 4,
  },
  forgotLink: {
    fontSize: 11, color: "#2f6690", cursor: "pointer",
    letterSpacing: "0.03em", background: "none", border: "none",
    padding: 0, fontFamily: "'Outfit', sans-serif",
    transition: "color 0.2s", padding: "2px 4px",
  },

  submitBtn: {
    width: "100%",
    background: "#2f6690",
    border: "none", borderRadius: 10,
    color: "#fff", fontSize: 15, fontWeight: 600,
    padding: "13px 20px", cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "opacity 0.15s, transform 0.1s",
    marginTop: 4,
  },
  spinner: {
    display: "inline-block", width: 14, height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  divider: {
    display: "flex", alignItems: "center", gap: 12, margin: "4px 0",
  },
  dividerLine: { flex: 1, height: 1, background: "rgba(255,255,255,0.06)" },
  dividerText: { fontSize: 12, color: "#444", whiteSpace: "nowrap" },

  switchBtn: {
    width: "100%", background: "transparent",
    border: "1px solid rgba(157,132,32,0.45)",
    borderRadius: 10, color: "#806b16",
    fontSize: 14, fontWeight: 500,
    padding: "12px 20px", cursor: "pointer",
    fontFamily: "'Outfit', sans-serif",
    transition: "background 0.2s, border-color 0.2s",
  },
};

export default LoginForm;