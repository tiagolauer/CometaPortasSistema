import React from "react"

const Logo: React.FC = () => (
  <div className="flex items-center gap-2">
    <svg
      width="40"
      height="40"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary-600"
    >
      <rect x="4" y="4" width="40" height="40" rx="12" fill="#2563eb"/>
      <path
        d="M16 32L24 16L32 32"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="28" r="2" fill="#fff"/>
    </svg>
    <span className="text-xl font-bold text-primary-700 select-none">COMETA</span>
  </div>
)

export default Logo