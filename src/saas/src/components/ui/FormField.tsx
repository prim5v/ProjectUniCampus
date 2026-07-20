
import React from "react";

let idCounter = 0;

export function FormField({
  label,
  hint,
  error,
  required,
  children






}: {label: string;hint?: string;error?: string;required?: boolean;children: (props: {id: string;"aria-invalid"?: boolean;}) => React.ReactNode;}) {
  const id = React.useMemo(() => `field-${++idCounter}`, []);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {children({ id, "aria-invalid": error ? true : undefined })}
      {error ?
      <p className="text-xs text-danger">{error}</p> :
      hint ?
      <p className="text-xs text-ink-muted">{hint}</p> :
      null}
    </div>);

}