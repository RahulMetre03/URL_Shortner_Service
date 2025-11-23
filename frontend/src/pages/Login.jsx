import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import hook
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../index.css'
import { API, BASE_URL } from "../config/apiConfig.js";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // useNavigate for routing

  const handleLogin = async () => {
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !password) {
    toast.error("Please enter email and password");
    return;
  }

  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

    setLoading(true);
    try {
      const res = await fetch(API.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
      } else {
        toast.success("Login successful!");
        localStorage.setItem("token", data.token);

        // Navigate to dashboard after login
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="auth-card">
        <h1 className="auth-title">LinkShort</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            className="btn-primary"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="auth-footer">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/signup")} // navigate to signup page
            className="auth-link"
            disabled={loading}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
