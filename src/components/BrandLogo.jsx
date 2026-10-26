import React from "react";

export function BrandLogo({ className = "" }) {
  return (
    <img
      className={`brand-logo ${className}`.trim()}
      src="./culto-chaman-logo.png"
      alt="Culto Chamán TCG Store"
      width="1124"
      height="509"
    />
  );
}
