export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={modalOverlayStyle}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={modalContentStyle}
      >
        <div style={headerModalSolid}>
          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h3>
          <button onClick={onClose} style={btnCloseWhite}>
            &times;
          </button>
        </div>
        <div style={{ padding: "20px" }}>{children}</div>
      </div>
    </div>
  );
}

const modalContentStyle = {
  background: "white",
  borderRadius: "10px",
  minWidth: "450px",
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
};

const headerModalSolid = {
  backgroundColor: "#1e293b",
  color: "white",
  padding: "15px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const btnCloseWhite = {
  border: "none",
  background: "none",
  color: "white",
  cursor: "pointer",
  fontSize: "24px",
};

const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(15, 23, 42, 0.8)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(2px)",
};
