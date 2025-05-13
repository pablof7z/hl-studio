import React from "react";

type SidebarProps = {
    children: React.ReactNode;
    className?: string;
};

export const Sidebar: React.FC<SidebarProps> = ({ children, className = "" }) => (
    <aside className={`sidebar w-64 bg-gray-100 h-full p-4 ${className}`}>
        {children}
    </aside>
);

export default Sidebar;