// components/ui/Label.tsx
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, htmlFor, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-white/80 ${className || ""}`}
    >
      {children}
    </label>
  );
};

export { Label };