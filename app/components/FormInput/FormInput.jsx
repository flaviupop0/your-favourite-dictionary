import React from "react";

const FormInput = ({ type, placeholder, value, onChange, onKeyPress }) => {
  return (
    <input
      onKeyDown={onKeyPress}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full p-3 mb-4 bg-gray-700 rounded outline-none text-white placeholder-gray-500"
    />
  );
};

export default FormInput;
