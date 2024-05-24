import React from "react";

const Button = ({ onClick, disabled, className, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`text-white font-bold py-2 px-4 rounded-full ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
