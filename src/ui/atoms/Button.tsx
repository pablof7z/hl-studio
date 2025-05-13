import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    className = "",
    ...props
}) => {
    const base =
        "px-4 py-2 rounded font-medium focus:outline-none transition";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    };
    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        />
    );
};

export default Button;