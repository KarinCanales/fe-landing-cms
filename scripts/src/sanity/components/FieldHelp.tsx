"use client";

import { useId, useState } from "react";
import type { FieldProps } from "sanity";

type HelpOptions = {
  helpText?: string;
  example?: string;
  warning?: string;
  designNote?: string;
};

const studioHelp = {
  surface: "#151722",
  surfaceSoft: "#1b1e2b",
  surfaceWarm: "#202018",
  border: "rgba(255, 255, 255, 0.10)",
  borderStrong: "rgba(210, 171, 128, 0.28)",
  text: "rgba(245, 245, 247, 0.92)",
  muted: "rgba(245, 245, 247, 0.70)",
  subtle: "rgba(245, 245, 247, 0.56)",
  accent: "#d2ab80",
  accentSoft: "rgba(210, 171, 128, 0.13)",
  green: "#809671",
  greenSoft: "rgba(128, 150, 113, 0.14)",
  dangerSoft: "rgba(210, 171, 128, 0.15)",
};

function readHelpOptions(schemaType: FieldProps["schemaType"]) {
  const schema = schemaType as FieldProps["schemaType"] & {
    description?: string;
    options?: HelpOptions;
  };

  const options = (schema.options || {}) as HelpOptions;

  return {
    description: schema.description,
    helpText: options.helpText,
    example: options.example,
    warning: options.warning,
    designNote: options.designNote,
  };
}

export function FieldHelp(props: FieldProps) {
  const [open, setOpen] = useState(false);
  const helpId = useId();

  const { description, helpText, example, warning, designNote } =
    readHelpOptions(props.schemaType);

  const hasHelp = Boolean(
    description || helpText || example || warning || designNote,
  );

  if (!hasHelp) return props.renderDefault(props);

  return (
    <div style={{ position: "relative", paddingRight: 34 }}>
      <div style={{ position: "absolute", right: 0, top: 2, zIndex: 20 }}>
        <button
          type="button"
          aria-label={`Ver explicación del campo ${
            props.schemaType.title || props.schemaType.name
          }`}
          aria-expanded={open}
          aria-controls={helpId}
          onClick={() => setOpen((value) => !value)}
          style={{
            display: "grid",
            width: 26,
            height: 26,
            placeItems: "center",
            border: open
              ? `1px solid ${studioHelp.borderStrong}`
              : "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: 999,
            color: open ? "#151722" : studioHelp.accent,
            background: open
              ? `linear-gradient(135deg, #e5d2b8, ${studioHelp.accent})`
              : "rgba(255, 255, 255, 0.055)",
            boxShadow: open
              ? "0 10px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255,255,255,.35)"
              : "0 8px 18px rgba(0, 0, 0, 0.18)",
            fontSize: 13,
            fontWeight: 900,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          i
        </button>
      </div>

      <div>{props.renderDefault(props)}</div>

      {open ? (
        <div
          id={helpId}
          role="note"
          style={{
            marginTop: 12,
            overflow: "hidden",
            border: `1px solid ${studioHelp.border}`,
            borderRadius: 14,
            background: `linear-gradient(135deg, ${studioHelp.surface} 0%, ${studioHelp.surfaceSoft} 100%)`,
            boxShadow:
              "0 18px 42px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.045)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "11px 14px",
              borderBottom: `1px solid ${studioHelp.border}`,
              color: studioHelp.text,
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.045), rgba(210,171,128,0.075))",
              fontSize: 11.5,
              fontWeight: 850,
              letterSpacing: "0.045em",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                display: "grid",
                width: 18,
                height: 18,
                placeItems: "center",
                flex: "0 0 auto",
                borderRadius: 999,
                color: "#151722",
                background: studioHelp.accent,
                fontSize: 11,
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              i
            </span>
            Ayuda para editar este campo
          </div>

          <div
            style={{
              padding: "14px 15px 15px",
              color: studioHelp.text,
              fontSize: 13.5,
              lineHeight: 1.6,
              background:
                "radial-gradient(circle at 12% 0%, rgba(210, 171, 128, 0.07), transparent 34%), rgba(255,255,255,0.015)",
            }}
          >
            {description ? (
              <p
                style={{
                  margin: "0 0 10px",
                  color: studioHelp.text,
                  fontWeight: 650,
                }}
              >
                {description}
              </p>
            ) : null}

            {helpText ? (
              <p
                style={{
                  margin: "0 0 10px",
                  color: studioHelp.muted,
                  fontWeight: 500,
                }}
              >
                {helpText}
              </p>
            ) : null}

            {example ? (
              <p
                style={{
                  margin: "11px 0 0",
                  padding: "10px 11px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 12,
                  color: studioHelp.muted,
                  background: "rgba(255, 255, 255, 0.035)",
                }}
              >
                <strong style={{ color: studioHelp.accent }}>Ejemplo:</strong>{" "}
                <span style={{ color: studioHelp.text, fontWeight: 600 }}>
                  {example}
                </span>
              </p>
            ) : null}

            {designNote ? (
              <p
                style={{
                  margin: "11px 0 0",
                  padding: "10px 11px",
                  border: "1px solid rgba(128, 150, 113, 0.24)",
                  borderRadius: 12,
                  background: studioHelp.greenSoft,
                  color: studioHelp.text,
                  fontWeight: 520,
                }}
              >
                <strong style={{ color: "#b3b792" }}>Nota de diseño:</strong>{" "}
                <span style={{ color: studioHelp.muted }}>{designNote}</span>
              </p>
            ) : null}

            {warning ? (
              <p
                style={{
                  margin: "11px 0 0",
                  padding: "10px 11px",
                  border: "1px solid rgba(210, 171, 128, 0.28)",
                  borderRadius: 12,
                  background: studioHelp.dangerSoft,
                  color: studioHelp.text,
                  fontWeight: 520,
                }}
              >
                <strong style={{ color: studioHelp.accent }}>Cuidado:</strong>{" "}
                <span style={{ color: studioHelp.muted }}>{warning}</span>
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}