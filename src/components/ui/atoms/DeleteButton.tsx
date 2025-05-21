import React from 'react';

type DeleteButtonProps = {
    onClick: () => void;
    className?: string;
};

export function DeleteButton({ onClick, className = '' }: DeleteButtonProps) {
    return (
        <button
            type="button"
            className={`absolute bg-black/80 p-1 right-2 top-2 rounded-full text-white z-10 hover:bg-black transition ${className}`}
            onClick={onClick}
            aria-label="Delete"
        >
            {/* Inline SVG X icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M5 5l8 8M13 5l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </button>
    );
}
