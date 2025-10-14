import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);

  const [mode, setMode] = useState("signup"); // 'signup' or 'login'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;

      if (mode === "signup") {
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          alert(data.message || "Signup failed");
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email,
          password,
        });

        if (data.success) {
          setIsLoggedIn(true);
          getUserData();
          navigate("/");
        } else {
          alert(data.message || "Login failed");
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "60px" }}>
      <h1
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        SkillSphere
      </h1>

      <h2>{mode === "signup" ? "Create Account" : "Login"}</h2>
      <p>
        {mode === "signup"
          ? "Create your account to get started"
          : "Login to your account"}
      </p>

      <form
        onSubmit={onSubmitHandler}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          maxWidth: "300px",
          margin: "20px auto",
        }}
      >
        {mode === "signup" && (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Full Name"
            required
            style={inputStyle}
          />
        )}

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
          required
          style={inputStyle}
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
          required
          style={inputStyle}
        />

        <button type="submit" style={buttonStyle}>
          {mode === "signup" ? "Sign Up" : "Login"}
        </button>
      </form>

      <p
        onClick={() => navigate("/reset-password")}
        style={{ color: "#007bff", cursor: "pointer" }}
      >
        Forgot Password?
      </p>

      {mode === "signup" ? (
        <p>
          Already have an account?{" "}
          <span
            onClick={() => setMode("login")}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Login here
          </span>
        </p>
      ) : (
        <p>
          No account yet?{" "}
          <span
            onClick={() => setMode("signup")}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Sign up
          </span>
        </p>
      )}
    </div>
  );
};

// 🔹 Simple inline styles (replace with Tailwind or your CSS later)
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "16px",
  width: "100%",
  marginTop: "10px",
};

export default Login;
