import { memo } from "react";

export type TextFieldName = "fullname" | "email";

type FormFieldProps = {
  name: TextFieldName;
  label: string;
  type: "text" | "email";
  value: string;
  error?: string;
  placeholder: string;
  autoComplete: string;
  onValueChange: (name: TextFieldName, value: string) => void;
};

function FormField({
  name,
  label,
  type,
  value,
  error,
  placeholder,
  autoComplete,
  onValueChange,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(event) => onValueChange(name, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p className="field-error" id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default memo(FormField);
