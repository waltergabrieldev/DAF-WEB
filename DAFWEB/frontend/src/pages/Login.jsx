import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email e obrigatorio";
    if (!formData.password) newErrors.password = "Senha e obrigatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const { data } = await api.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (error) {
      setErrors({
        form: error.response?.data?.error || "Nao foi possivel fazer login",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 animate__animated animate__fadeInUp"
      style={{
        background: "linear-gradient(135deg, #6a5acd, #a6b1ff)",
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px",
          backgroundColor: "white",
          color: "#333",
        }}
      >
        <h2 className="text-center mb-4 fw-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          {errors.form && <div className="alert alert-danger">{errors.form}</div>}

          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className={`form-control rounded-3 ${errors.email ? "is-invalid" : ""}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Senha:</label>
            <input
              type="password"
              className={`form-control rounded-3 ${errors.password ? "is-invalid" : ""}`}
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn fw-bold rounded-pill"
              style={{ backgroundColor: "#6a5acd", color: "white" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Entrando..." : "Entrar"}
            </button>
          </div>
        </form>

        <p className="text-center mt-3">
          Nao tem conta?{" "}
          <Link to="/register" style={{ color: "#6a5acd", fontWeight: "600" }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
