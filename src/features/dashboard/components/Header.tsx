import React from 'react';

type HeaderProps = {
    title: string;
    rightContent?: React.ReactNode;
};

export function Header({ title, rightContent }: HeaderProps) {
    return (
        <header className="dashboard-header flex items-center justify-between py-4 px-6 bg-gray-50 border-b">
            <h1 className="text-xl font-semibold">{title}</h1>
            {rightContent && <div>{rightContent}</div>}
        </header>
    );
}

export default Header;
