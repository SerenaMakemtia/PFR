import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
  type = 'text',
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = '',
  icon,
  helperText,
  autoComplete = 'on',
  min,
  max,
  maxLength,
  pattern,
  readOnly = false,
  size = 'medium',
  fullWidth = true,
}, ref) => {
  const inputSizes = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-3',
    large: 'py-3 px-4 text-lg',
  };
  
  const baseClasses = 'rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors w-full';
  const stateClasses = error
    ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
    : disabled
      ? 'bg-gray-100 border-gray-300 text-gray-500 cursor-not-allowed'
      : 'border-gray-300 focus:border-blue-500';
  
  const widthClass = fullWidth ? 'w-full' : '';
  const inputClasses = `${baseClasses} ${stateClasses} ${inputSizes[size]} ${widthClass} ${className}`;

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={`${inputClasses} ${icon ? 'pl-10' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          autoComplete={autoComplete}
          min={min}
          max={max}
          maxLength={maxLength}
          pattern={pattern}
          readOnly={readOnly}
        />
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.propTypes = {
  type: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  icon: PropTypes.node,
  helperText: PropTypes.string,
  autoComplete: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
};

Input.displayName = 'Input';

export default Input;