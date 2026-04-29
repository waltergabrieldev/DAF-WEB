import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // lógica de login aqui
    navigate("/home");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100 animate__animated animate__fadeInUp"
      style={{
        background: "linear-gradient(135deg, #6a5acd, #a6b1ff)", // gradiente roxo-azul
      }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          borderRadius: "20px", // caixa arredondada
          backgroundColor: "white", // fundo branco
          color: "#333", // texto preto
        }}
      >
        <h2 className="text-center mb-4 fw-bold">Login</h2>
        <form onSubmit={handleSubmit}>
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
            >
              Entrar
            </button>
          </div>
        </form>

        {/* Botão/link para cadastro */}
        <p className="text-center mt-3">
          Não tem conta?{" "}
          <Link to="/register" style={{ color: "#6a5acd", fontWeight: "600" }}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}