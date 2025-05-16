import React from "react"
import { CheckIcon } from "lucide-react"

interface CheckboxProps {
  id: string
  name?: string
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox: React.FC<CheckboxProps> = ({ id, name, label, checked, onChange }) => {
  return (
    <div className="flex items-center">
      <div className="relative flex items-center mr-3" style={{ width: 20, height: 20 }}>
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="opacity-0 absolute h-5 w-5 cursor-pointer left-0 top-0 z-10"
          aria-checked={checked}
          style={{ margin: 0 }}
        />
        <div 
          className={`
            border h-5 w-5 rounded flex flex-shrink-0 items-center justify-center
            transition-colors duration-200 ease-in-out
            ${checked 
              ? 'bg-primary-600 border-primary-600' 
              : 'border-gray-300 bg-white'
            }
            pointer-events-none
          `}
        >
          {checked && <CheckIcon size={14} className="text-white" />}
        </div>
      </div>
      <label htmlFor={id} className="text-sm text-gray-600 cursor-pointer">
        {label}
      </label>
    </div>
  );
};

export default Checkbox
