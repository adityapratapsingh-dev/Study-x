import React from 'react';

/**
 * Inline accent styling for a subject swatch. Falls back to the theme's Iris
 * token (never a raw hex) so subject badges stay on-palette.
 */
export const subjectAccent = (color?: string): React.CSSProperties => {
  const c = color || 'var(--color-blue-500)';
  return {
    backgroundColor: `color-mix(in srgb, ${c} 13%, transparent)`,
    color: c,
  };
};
