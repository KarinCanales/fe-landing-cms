"use client";

import React, { useCallback } from "react";
import type { StringInputProps } from "sanity";
import { resolveIcon } from "../icons";

/**
 * Custom string input that renders a visual preview of the selected icon
 * next to the standard dropdown. Used for all icon selection fields.
 */
export function IconInput(props: StringInputProps) {
  const { value, schemaType } = props;
  const listItems = (schemaType.options as any)?.list || [];

  const Icon = resolveIcon(value || undefined);
  const selectedLabel =
    listItems.find((item: any) => (item.value || item) === value)?.title || value;

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
      {/* Icon preview */}
      <div
        style={{
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
          width: 48,
          height: 48,
          marginTop: 2,
          borderRadius: 14,
          border: value
            ? "1px solid rgba(210, 171, 128, 0.32)"
            : "1px solid rgba(255, 255, 255, 0.10)",
          background: value
            ? "linear-gradient(135deg, rgba(210, 171, 128, 0.12), rgba(45, 95, 94, 0.08))"
            : "rgba(255, 255, 255, 0.04)",
          color: value ? "#d2ab80" : "rgba(255, 255, 255, 0.30)",
          boxShadow: value
            ? "0 8px 20px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08)"
            : "none",
          transition: "all 200ms ease",
        }}
        title={selectedLabel || "Sin icono seleccionado"}
      >
        {React.createElement(Icon, { size: 22 })}
      </div>

      {/* Default input (the dropdown) */}
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        {props.renderDefault(props)}
      </div>
    </div>
  );
}
