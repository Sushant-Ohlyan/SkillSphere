import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, {
        email,
      });

      if (data.success) {
        alert("OTP sent to your email. Please check your inbox.");
        navigate("/email-verify"); // or '/verify-otp' if you named it differently
      } else {
        alert(data.message || "Failed to send reset email.");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Reset Password</h1>
      <p style={{ marginBottom: "20px" }}>
        Enter your email address to receive a password reset OTP.
      </p>

      <form onSubmit={onSubmitHandler} style={formStyle}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Remembered your password?{" "}
        <span
          onClick={() => navigate("/login")}
          style={{ color: "#007bff", cursor: "pointer" }}
        >
          Go back to login
        </span>
      </p>
    </div>
  );
};

// 🎨 Simple inline styles (replace with Tailwind later)
const containerStyle = {
  maxWidth: "400px",
  margin: "80px auto",
  textAlign: "center",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const titleStyle = {
  fontSize: "24px",
  marginBottom: "10px",
  color: "#333",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  alignItems: "center",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#007bff",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
};

export default ResetPassword;
