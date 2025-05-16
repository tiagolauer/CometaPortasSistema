import React, { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface InputFieldProps {
  id: string
  name: string
  label: string
  type: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  required?: boolean
  autoComplete?: string
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type: initialType,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  autoComplete = "off"
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isPassword = initialType === "password"
  const type = isPassword && showPassword ? "text" : initialType

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className={`block text-sm font-medium transition-all duration-200 ${
          isFocused || value ? "text-primary-600" : "text-gray-600"
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative mt-1">
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`block w-full px-4 py-3 rounded-lg border bg-white bg-opacity-90 backdrop-blur-sm transition-all duration-200 outline-none ${
            error
              ? "border-red-300 focus:ring-2 focus:ring-red-100"
              : `border-gray-300 ${
                  isFocused
                    ? "focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    : "hover:border-gray-400"
                }`
          }`}
        />

        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default InputField
