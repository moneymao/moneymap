import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      id,
      label,
      type = "text",
      name,
      placeholder,
      icon: Icon,
      error,
      disabled = false,
      autoComplete,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>

        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
          )}

          <input
            ref={ref}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`h-11 w-full rounded-lg border bg-white text-sm text-slate-900 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100 ${
              Icon ? "pl-10" : "px-4"
            } ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                : "border-slate-300 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            }`}
            {...props}
          />
        </div>

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 text-xs text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;