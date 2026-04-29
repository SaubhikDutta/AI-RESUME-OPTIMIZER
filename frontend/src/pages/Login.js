import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "/";
    } else {
      alert("Login failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2>Login</h2>

        <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} style={styles.input}/>
        <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} style={styles.input}/>

        <button style={styles.btn} onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

const styles = {
  page:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#020617"},
  card:{background:"#0f172a",padding:"30px",borderRadius:"10px"},
  input:{display:"block",margin:"10px 0",padding:"10px",width:"200px"},
  btn:{background:"#0ea5e9",padding:"10px",border:"none",color:"white"}
};

export default Login;