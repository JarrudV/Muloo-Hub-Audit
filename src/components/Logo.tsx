import React from 'react';

interface LogoProps {
    serviceName?: string;
    serviceColor?: string;
    className?: string;
}

export default function Logo({ serviceName, serviceColor, className = '' }: LogoProps) {
    const isSubService = Boolean(serviceName);
    const color = serviceColor || "var(--accent-primary)";

    return (
        <span className={`muloo-logo ${className}`.trim()} style={isSubService ? { color } : undefined}>
            <span className={isSubService ? "" : "text-gradient"}>muloo</span>
            {serviceName && (
                <span className="service-name" style={{ color }}>&nbsp;{serviceName}</span>
            )}
        </span>
    );
}
