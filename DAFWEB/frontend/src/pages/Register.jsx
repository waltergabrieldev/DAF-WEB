import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const api = axios.create({
    baseURL: "http://localhost:5000/auth",
    timeout: 1000,
    headers: { "X-Custom-Header": "foobar" },
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
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
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.email) newErrors.email = "Email é obrigatório";
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      api
        .post("/register", {
          email: formData.email,
          password: formData.password,
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      console.log("Registro:", formData);
      navigate("/login");
    }
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
          maxWidth: "420px",
          width: "100%",
          borderRadius: "20px", // caixa arredondada
          backgroundColor: "white", // fundo branco
          color: "#333", // texto preto
        }}
      >
        <h2 className="text-center mb-4 fw-bold">Registro</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome:</label>
            <input
              type="text"
              className={`form-control rounded-3 ${errors.name ? "is-invalid" : ""}`}
              placeholder="Seu Nome Completo"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Email:</label>
            <input
              type="email"
              className={`form-control rounded-3 ${errors.email ? "is-invalid" : ""}`}
              placeholder="seu@email.com"
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
            <div className="form-text">
              Sua senha deve ter entre 8 e 20 caracteres, conter letras e números e não deve conter espaços, caracteres especiais ou emojis.
            </div>
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmar Senha:</label>
            <input
              type="password"
              className={`form-control rounded-3 ${errors.confirmPassword ? "is-invalid" : ""}`}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
          </div>
          <div className="d-grid mb-3">
            <button
              type="submit"
              className="btn fw-bold rounded-pill"
              style={{ backgroundColor: "#6a5acd", color: "white" }}
            >
              Registrar
            </button>
          </div>
        </form>

        {/* Link para login */}
        <p className="text-center mt-3">
          Já tem uma conta?{" "}
          <Link to="/login" style={{ color: "#6a5acd", fontWeight: "600" }}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}