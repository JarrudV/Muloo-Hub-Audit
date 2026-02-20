import React from 'react';

interface LogoProps {
    serviceName?: string;
    className?: string;
}

export default function Logo({ serviceName, className = '' }: LogoProps) {
    return (
        <span className={`muloo-logo ${className}`.trim()}>
            <span className="text-gradient">muloo</span>
            {serviceName && (
                <span className="service-name">&nbsp;{serviceName}</span>
            )}
        </span>
    );
}
