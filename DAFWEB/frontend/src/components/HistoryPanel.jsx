import React, { useEffect, useState } from "react";
import { historyService } from "../services/history";

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function HistoryPanel({ onOpenResult, refreshKey }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");
      const history = await historyService.list();
      setItems(history);
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel carregar o historico.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, [refreshKey]);

  async function handleRemove(id) {
    try {
      setRemovingId(id);
      await historyService.remove(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Nao foi possivel remover este item.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <section className="animate__animated animate__fadeInUp p-4 rounded-3 shadow-lg bg-white">
      <div
        className="mb-4 text-center text-white rounded-3"
        style={{
          background: "linear-gradient(135deg, #6a5acd, #a6b1ff)",
          padding: "20px",
        }}
      >
        <h4 className="fw-bold mb-0">Historico de simulacoes</h4>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center py-4">Carregando historico...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-4 text-muted">
          Nenhuma simulacao salva ainda.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#a6b1ff", color: "white" }}>
              <tr>
                <th>Data</th>
                <th>Profissao</th>
                <th>Renda</th>
                <th>Custos</th>
                <th>Melhor opcao</th>
                <th className="text-end">Acoes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const result = item.result || {};
                const input = result.input || {};
                const betterOption = Number(result.PJ?.liquido || 0) > Number(result.PF?.liquido || 0)
                  ? "PJ"
                  : "PF";

                return (
                  <tr key={item.id}>
                    <td>{item.createdAt ? dateTime.format(new Date(item.createdAt)) : "-"}</td>
                    <td>{input.profissao || "-"}</td>
                    <td>{money.format(item.rendaMensal || input.rendaMensal || 0)}</td>
                    <td>{money.format(item.custosMensais || input.custosMensais || 0)}</td>
                    <td>
                      <span
                        className="badge rounded-pill"
                        style={{ backgroundColor: "#6a5acd" }}
                      >
                        {betterOption}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary rounded-pill px-3"
                          onClick={() => onOpenResult(result)}
                          disabled={!result.PF || !result.PJ}
                        >
                          Ver
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger rounded-pill px-3"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                        >
                          {removingId === item.id ? "Removendo..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
