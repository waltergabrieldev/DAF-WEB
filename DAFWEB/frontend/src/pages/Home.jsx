import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CalculatorForm from "../components/CalculatorForm";
import CompareResult from "../components/CompareResult";
import HistoryPanel from "../components/HistoryPanel";
import { compareTaxes } from "../util/tax";
import { Link } from "react-router-dom";
import { historyService } from "../services/history";

export default function Home() {
  const [result, setResult] = useState(null);
  const [activeView, setActiveView] = useState("calculator");
  const [historyMessage, setHistoryMessage] = useState("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  async function handleCompare(data) {
    const comparison = compareTaxes({
      rendaMensal: data.rendaMensal,
      custosMensais: data.custosMensais,
      profissao: data.profissao,
    });
    const nextResult = {
      ...comparison,
      input: {
        rendaMensal: data.rendaMensal,
        custosMensais: data.custosMensais,
        profissao: data.profissao,
        sendEmail: data.sendEmail,
        emailUser: data.emailUser,
        emailNAF: data.emailNAF,
      },
    };

    setResult(nextResult);
    setActiveView("calculator");
    setHistoryMessage("");

    try {
      await historyService.create(nextResult);
      setHistoryRefreshKey((current) => current + 1);
    } catch (err) {
      setHistoryMessage(
        err.response?.data?.error || "A simulacao foi calculada, mas nao foi salva no historico."
      );
    }
  }

  function handleBack() {
    setResult(null);
  }

  function openHistoryResult(savedResult) {
    setResult(savedResult);
    setActiveView("calculator");
    setHistoryMessage("");
  }

  return (
    <div
      className="container-fluid min-vh-100"
      style={{ backgroundColor: "#f3f1ff", color: "#333" }}
    >
      {/* Header com botão de sair */}
      <div
        className="header mb-4 d-flex justify-content-between align-items-center"
        style={{
          background: "linear-gradient(135deg, #6a5acd, #a6b1ff)",
          marginLeft: "-12px",
          marginRight: "-10px",
          padding: "25px",
          color: "white",
        }}
      >
        <div>
          <h1 className="fw-bold mb-0">Calculadora Tributária</h1>
          <p className="mb-0">Compare PF vs PJ de forma simples</p>
        </div>
        <div className="d-flex gap-2">
          <button
            onClick={() => {
              setActiveView("calculator");
              setResult(null);
            }}
            className="btn btn-outline-light fw-bold rounded-pill px-4"
            type="button"
          >
            Simulador
          </button>
          <button
            onClick={() => setActiveView("history")}
            className="btn btn-outline-light fw-bold rounded-pill px-4"
            type="button"
          >
            Historico
          </button>
          <Link to="/faq">
            <button
              className="btn btn-outline-light fw-bold rounded-pill px-4"
              type="button"
            >
              FAQ
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="btn btn-light fw-bold rounded-pill px-4"
            type="button"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="container">
        <div>
          <div className="card-body">
            {historyMessage && (
              <div className="alert alert-warning">{historyMessage}</div>
            )}

            {activeView === "history" ? (
              <HistoryPanel
                onOpenResult={openHistoryResult}
                refreshKey={historyRefreshKey}
              />
            ) : !result ? (
              <CalculatorForm onCompare={handleCompare} />
            ) : (
              <CompareResult result={result} onBack={handleBack} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
