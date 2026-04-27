import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ ERROR STATE

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(""); // reset error

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // ✅ SAVE TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ REDIRECT
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed"); // ✅ SHOW ERROR
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>

      {/* ✅ ERROR MESSAGE */}
      {error && <p style={styles.error}>{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>

      <p>
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};


// ✅ STYLES
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "300px",
    margin: "100px auto",
  },
  input: {
    padding: "10px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
};

export default Login;