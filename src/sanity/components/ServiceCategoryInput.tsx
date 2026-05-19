"use client";

import React, { useEffect, useState, useCallback } from "react";
import { type StringInputProps, set, unset, useClient } from "sanity";

/**
 * Custom string input that reads service entries from the
 * servicesSection document and presents them as selectable options.
 *
 * Source of truth: servicesSection → services[] → title
 * Stores the service title as a plain string.
 */
export function ServiceCategoryInput(props: StringInputProps) {
  const { value, onChange } = props;
  const client = useClient({ apiVersion: "2024-01-01" });
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<string[]>(
        `*[_type == "servicesSection"][0].services[visible != false].title`
      )
      .then((titles) => {
        setServices((titles || []).filter(Boolean));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [client]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const v = e.currentTarget.value;
      onChange(v ? set(v) : unset());
    },
    [onChange]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <select
        value={value || ""}
        onChange={handleChange}
        disabled={loading}
        style={{
          appearance: "none",
          width: "100%",
          padding: "10px 36px 10px 12px",
          border: "1px solid var(--card-border-color, rgba(255,255,255,0.1))",
          borderRadius: 6,
          background:
            "var(--card-bg-color, #1a1a1a) url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23999' d='M1.4 0L6 4.6 10.6 0 12 1.4 6 7.4 0 1.4z'/%3E%3C/svg%3E\") no-repeat right 12px center",
          color: "var(--card-fg-color, #e5e5e5)",
          fontSize: "0.9375rem",
          cursor: "pointer",
        }}
      >
        <option value="">— Sin categoría —</option>
        {services.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {loading && (
        <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
          Cargando servicios…
        </span>
      )}

      {!loading && services.length === 0 && (
        <span style={{ fontSize: "0.8rem", opacity: 0.5 }}>
          No hay servicios definidos. Agrega servicios en la sección Servicios.
        </span>
      )}

      {value && !loading && !services.includes(value) && (
        <span style={{ fontSize: "0.8rem", color: "#e8a838" }}>
          &ldquo;{value}&rdquo; no coincide con ningún servicio actual.
        </span>
      )}
    </div>
  );
}
