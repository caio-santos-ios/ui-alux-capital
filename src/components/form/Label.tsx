import { title } from "process";
import React, { FC, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface LabelProps {
  htmlFor?: string;
  className?: string;
  title: string;
  required?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, className, title, required = true }) => {
  return (
    <label htmlFor={htmlFor} className={twMerge(
        "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        className
      )}>
      {title}
      {
        required &&
        <span className="text-error-500"> *</span>
      }
    </label>
  );
};

export default Label;
