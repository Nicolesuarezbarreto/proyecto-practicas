export default function EventCard({ title, place, onView, onShare }) {
  return (
    <article
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: "14px 16px",
        borderRadius: "10px",
        background: "#f8f8f8",
        border: "1px solid #e2e2e2",
        marginBottom: "10px",
        boxSizing: "border-box"
      }}
    >
      {/* Columna de texto */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "600",
            color: "#222"
          }}
        >
          {title}
        </h3>

        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: "14px",
            color: "#555"
          }}
        >
          {place}
        </p>
      </div>

      {/* Botones a la derecha */}
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={onView}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Ver
        </button>

        <button
          onClick={onShare}
          style={{
            padding: "6px 14px",
            borderRadius: "8px",
            border: "1px solid #007bff",
            background: "transparent",
            color: "#007bff",
            cursor: "pointer"
          }}
        >
          Compartir
        </button>
      </div>
    </article>
  );
}
