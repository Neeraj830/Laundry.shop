import { forwardRef } from 'react';

const FormInput = forwardRef(({
  label,
  error,
  type = 'text',
  className = '',
  textarea = false,
  rows = 3,
  ...props
}, ref) => {
  const inputClass = `w-full rounded-xl px-4 py-3 text-sm transition-all outline-none glass-input text-slate-800 placeholder-slate-400 ${
    error
      ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
      : 'focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100'
  } ${className}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700 ml-0.5">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea
          ref={ref}
          rows={rows}
          className={inputClass}
          {...props}
        />
      ) : (
        <input
          ref={ref}
          type={type}
          className={inputClass}
          {...props}
        />
      )}
      {error && (
        <span className="text-xs font-medium text-red-500 ml-1">
          {error.message || error}
        </span>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export default FormInput;
