import React from 'react';
import './Input.css';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  label,
  error,
  required = false,
}) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input ${error ? 'input-error' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;
