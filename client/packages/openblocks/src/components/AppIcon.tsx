import React, { useState } from "react";

interface AppIconProps {
    appIconUrl?: string;
    size?: number;
    style?: React.CSSProperties;
    alt?: string;
    children?: React.ReactNode; // fallback icon
}

export const AppIcon: React.FC<AppIconProps> = ({
    appIconUrl,
    size = 24,
    style,
    alt = "app icon",
    children,
}) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const showFallback = !appIconUrl || error;

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: size,
                height: size,
                borderRadius: 4,
                marginRight: 10,
                objectFit: "cover",
                flexShrink: 0,
                background: "transparent",
                position: "relative",
                overflow: "hidden",
                ...style,
            }}
        >
            {appIconUrl && !error && loaded && (
                <img
                    src={appIconUrl}
                    alt={alt}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: 4,
                        objectFit: "cover",
                        flexShrink: 0,
                        display: "block",
                    }}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                />
            )}
            {appIconUrl && !error && !loaded && (
                <img
                    src={appIconUrl}
                    alt={alt}
                    style={{ display: "none" }}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                />
            )}
            {showFallback &&
                children &&
                React.isValidElement(children)
                ? React.cloneElement(children as React.ReactElement, {
                    style: {
                        width: size,
                        height: size,
                        ...((children as any).props?.style || {}),
                    },
                })
                : showFallback && children}
        </div>
    );
};

export default AppIcon; 