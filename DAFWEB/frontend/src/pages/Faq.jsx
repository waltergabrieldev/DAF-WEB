import React, { useState } from "react";

const faqData = [
  {
    question: "O que esta calculadora faz?",
    answer:
      "Esta ferramenta compara a carga tributária entre Pessoa Física e Pessoa Jurídica, ajudando você a entender qual opção pode ser mais vantajosa financeiramente.",
  },
  {
    question: "Para quem essa calculadora é indicada?",
    answer:
      "É indicada para profissionais autônomos, freelancers, prestadores de serviço e qualquer pessoa que esteja avaliando abrir um CNPJ.",
  },
  {
    question: "Os resultados são exatos?",
    answer:
      "Os cálculos são estimativas baseadas em regras tributárias gerais. Para decisões finais, é recomendado consultar um contador.",
  },
  {
    question: "Quais impostos são considerados?",
    answer:
      "A calculadora considera impostos comuns como INSS, Imposto de Renda e tributações aplicáveis ao regime de Pessoa Jurídica.",
  },
  {
    question: "Qual a principal diferença entre PF e PJ?",
    answer:
      "Pessoa Física paga impostos diretamente sobre a renda, enquanto Pessoa Jurídica pode optar por regimes tributários com cargas diferentes, podendo reduzir custos.",
  },
  {
    question: "Vale sempre a pena virar PJ?",
    answer:
      "Não necessariamente. Depende do faturamento, tipo de atividade e despesas. A calculadora ajuda justamente nessa análise.",
  },
  {
    question: "Preciso pagar para usar a calculadora?",
    answer:
      "Não. A ferramenta foi desenvolvida para uso gratuito com fins educacionais e de apoio à decisão.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        fontFamily: "Arial",
      }}
    >
      <h1
        className="fw-bold"
        style={{ textAlign: "center", marginBottom: "45px", color: "white" }}
      >
        Perguntas Frequentes (FAQ)
      </h1>

      {faqData.map((item, index) => (
        <div
          key={index}
          style={{
            marginBottom: "12px",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #e2dbdb",
          }}
        >
          <div
            onClick={() => toggle(index)}
            style={{
              cursor: "pointer",
              background: openIndex === index ? "#007bff" : "#f5f5f5",
              color: openIndex === index ? "#fff" : "#000",
              padding: "15px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {item.question}
            <span>{openIndex === index ? "−" : "+"}</span>
          </div>

          {openIndex === index && (
            <div
              style={{
                padding: "15px",
                background: "#fff",
                lineHeight: "1.5",
              }}
            >
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
