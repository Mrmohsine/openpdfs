"use client"

import React from "react";

interface SpinnerProps {
    size?: number;
    animationDuration?: number;
    color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
    size = 20,
    animationDuration = 0.5,
    color = "#3498db"
}) => {
    const spinnerStyles = {
        height: `${size}px`,
        width: `${size}px`,
        animation: `spin ${animationDuration}s linear infinite`,
        borderRadius: "50%", 
        border: `${size * 8 / 50}px solid #f3f3f3`, 
        borderTop: `${size * 8 / 50}px solid ${color}`,
    }

    return (
        <div className="spinner-container">
            <div className="spinner" style={spinnerStyles}></div>
        </div>
    );
}

export default Spinner;