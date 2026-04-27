import React, { useState } from "react";
import API from "../utils/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", {
  email,
  password,
});
      alert("Registered! Now login");
      navigate("/");
    } catch (err) {
      alert("Register failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Register</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
    margin: "100px auto",
  },
};

export default Register;