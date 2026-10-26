import React from "react";
export function Field({ id, label, error, hint, children, ...input }) {
  return (
    <div className="mb-3">
      <label className="form-label fw-semibold" htmlFor={id}>
        {label}
      </label>
      {children ? (
        React.cloneElement(children, {
          id,
          "aria-invalid": Boolean(error),
          "aria-describedby": `${id}-help ${id}-error`,
          className: `form-select ${error ? "is-invalid" : ""}`,
        })
      ) : (
        <input
          {...input}
          id={id}
          name={id}
          className={`form-control ${error ? "is-invalid" : ""}`}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-help ${id}-error`}
        />
      )}
      <div id={`${id}-help`} className="form-text">
        {hint}
      </div>
      <div
        id={`${id}-error`}
        className="invalid-feedback"
        role={error ? "alert" : undefined}
      >
        {error}
      </div>
    </div>
  );
}
