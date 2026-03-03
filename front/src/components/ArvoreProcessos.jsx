import React, { useState } from "react";

export default function ProcessosArvore({ processo, onAdd, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const temFilhos = processo.subProcessos && processo.subProcessos.length > 0;

  return (
    <div style={containerStyle}>
      <div
        style={{
          ...itemHeaderStyle,
          backgroundColor: isOpen ? "#f1f5f9" : "white",
          borderLeft: processo.isSistemico
            ? "4px solid #3b82f6"
            : "4px solid #64748b",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div style={headerInfoStyle}>
          <span style={{ fontSize: "1.2rem" }}>
            {processo.isSistemico ? "⚙️" : "👤"}
          </span>
          <strong style={{ color: "#1e293b" }}>{processo.nome}</strong>
        </div>

        <div style={actionsContainerStyle}>
          <button
            title="Adicionar SubProcesso"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(processo.idArea, processo.id);
            }}
            style={btnActionStyle}
          >
            ➕
          </button>
          <button
            title="Editar"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(processo);
            }}
            style={btnActionStyle}
          >
            ✏️
          </button>
          <button
            title="Deletar"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(processo.id);
            }}
            style={btnDeleteStyle}
          >
            🗑️
          </button>
          {temFilhos && <span style={arrowStyle}>{isOpen ? "▲" : "▼"}</span>}
        </div>
      </div>

      {/* Conteúdo Expandido */}
      {isOpen && (
        <div style={contentBodyStyle}>
          <div style={detailsBoxStyle}>
            <p style={textStyle}>
              <strong>Descrição:</strong> {processo.descricao}
            </p>
            <p style={textStyle}>
              <strong>🛠️ Ferramentas:</strong> {processo.ferramentas || "N/A"}
            </p>
            <p style={textStyle}>
              <strong>👥 Responsáveis:</strong> {processo.responsaveis || "N/A"}
            </p>
            {processo.documentacao && (
              <p style={textStyle}>
                <strong>📄 Doc:</strong> {processo.documentacao}
              </p>
            )}
          </div>

          {/* Recursividade: Renderiza os filhos com o mesmo estilo */}
          {temFilhos && (
            <div style={subProcessListStyle}>
              {processo.subProcessos.map((sub) => (
                <ProcessosArvore 
                key={sub.id} 
                processo={sub}
                onAdd={onAdd}
                onEdit={onEdit}
                onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// --- ESTILOS PADRONIZADOS (Seguindo seu modelo do Modal) ---

const containerStyle = {
  marginBottom: "10px",
  width: "100%",
};

const itemHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 15px",
  borderRadius: "6px",
  cursor: "pointer",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
};

const headerInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const arrowStyle = {
  fontSize: "0.8rem",
  color: "#64748b",
};

const actionsContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
};

const btnActionStyle = {
  border: "none",
  background: "#f1f5f9",
  cursor: "pointer",
  padding: "5px 8px",
  borderRadius: "4px",
  fontSize: "0.9rem",
  transition: "0.2s",
};

const btnDeleteStyle = {
  ...btnActionStyle,
  background: "#fee2e2",
  color: "#ef4444",
};

const contentBodyStyle = {
  paddingLeft: "20px",
  marginTop: "5px",
  borderLeft: "2px dashed #cbd5e1",
  marginLeft: "15px",
};

const detailsBoxStyle = {
  backgroundColor: "#f8fafc",
  padding: "15px",
  borderRadius: "0 0 8px 8px",
  border: "1px solid #e2e8f0",
  borderTop: "none",
};

const textStyle = {
  margin: "5px 0",
  fontSize: "0.9rem",
  color: "#334155",
};

const subProcessListStyle = {
  marginTop: "10px",
};
