import React from 'react';

export const ChartTooltip = ({ active, payload, label, prefix = "₱", suffix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, padding: "10px 14px", boxShadow: "0 8px 24px rgba(0,0,0,.3)" }}>
      {label && <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4, fontWeight: 600 }}>{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || "#a5b4fc", fontSize: 13, fontWeight: 700, margin: 0 }}>
          {prefix}{typeof p.value === "number" ? p.value.toLocaleString() : p.value}{suffix}
        </p>
      ))}
    </div>
  );
};