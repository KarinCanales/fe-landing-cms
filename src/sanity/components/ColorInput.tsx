'use client';

import {useEffect, useState} from 'react';
import {set, unset, type StringInputProps} from 'sanity';

const palette = {
  ink: '#2f281d',
  carob: '#725c3a',
  chai: '#d2ab80',
  almond: '#e5e0d8',
  vanilla: '#e5d2b8',
  matcha: '#809671',
  pistachio: '#b3b792',
};

const presetColors = [
  '#809671',
  '#b3b792',
  '#d2ab80',
  '#725c3a',
  '#e5d2b8',
  '#e5e0d8',
  '#2f281d',
];

export function ColorInput(props: StringInputProps) {
  const value = typeof props.value === 'string' && props.value ? props.value : '#d2ab80';
  const [draftColor, setDraftColor] = useState(value);

  useEffect(() => {
    setDraftColor(value);
  }, [value]);

  const update = (nextValue: string) => {
    if (!nextValue) {
      props.onChange(unset());
      return;
    }
    props.onChange(set(nextValue));
  };

  return (
    <div style={{display: 'grid', gap: 10}}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '52px minmax(0, 1fr)',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <input
          aria-label="Elegir color"
          type="color"
          value={draftColor}
          onChange={(event) => setDraftColor(event.currentTarget.value)}
          onBlur={(event) => update(event.currentTarget.value)}
          style={{
            width: 52,
            height: 42,
            padding: 3,
            border: `1px solid rgba(114,92,58,.22)`,
            borderRadius: 12,
            background: '#fffaf2',
            cursor: 'pointer',
          }}
        />
        <input
          aria-label="Valor hexadecimal del color"
          value={props.value || ''}
          placeholder="#d2ab80"
          onChange={(event) => update(event.currentTarget.value)}
          style={{
            width: '100%',
            minHeight: 42,
            padding: '0 12px',
            border: `1px solid rgba(114,92,58,.2)`,
            borderRadius: 12,
            color: palette.ink,
            background: '#fffaf2',
            fontFamily: 'monospace',
            fontSize: 14,
            outline: 'none',
          }}
        />
      </div>

      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
        {presetColors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Usar color ${color}`}
            onClick={() => update(color)}
            style={{
              width: 28,
              height: 28,
              borderRadius: 999,
              border: color.toLowerCase() === draftColor.toLowerCase() ? `2px solid ${palette.ink}` : '1px solid rgba(47,40,29,.22)',
              background: color,
              boxShadow: '0 6px 14px rgba(47,40,29,.1)',
              cursor: 'pointer',
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => props.onChange(unset())}
          style={{
            minHeight: 28,
            padding: '0 10px',
            border: '1px solid rgba(114,92,58,.22)',
            borderRadius: 999,
            color: '#fffaf2',
            background: 'linear-gradient(135deg, #2a5a55, #173d39)',
            fontSize: 12,
            fontWeight: 750,
            cursor: 'pointer',
          }}
        >
          Usar color por defecto
        </button>
      </div>
    </div>
  );
}
