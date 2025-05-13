import React from "react";

type AvatarProps = {
    src?: string;
    alt?: string;
    size?: number;
    className?: string;
};

const DEFAULT_AVATAR =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' font-size='24' text-anchor='middle' fill='%23999' dy='.3em'>?</text></svg>";

export const Avatar: React.FC<AvatarProps> = ({ src, alt = "User avatar", size = 40, className }) => {
    const avatarSrc = src || DEFAULT_AVATAR;
    return (
        <img
            src={avatarSrc}
            alt={alt}
            width={size}
            height={size}
            className={className}
            style={{
                borderRadius: "50%",
                objectFit: "cover",
                width: size,
                height: size,
                background: "#eee",
                display: "inline-block",
            }}
        />
    );
};