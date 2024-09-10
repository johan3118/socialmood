import React from "react";

interface IconContainerProps {
  bgColor: string;
  size: number;
  iconColor?: string; // Add an optional prop for icon color (can be a hex color)
}

const IconContainer: React.FC<IconContainerProps> = ({
  bgColor,
  size,
  iconColor = "#FFFFFF", // Default the icon color to white (hex format)
}) => {
  return (
    <div
      className={`flex items-center justify-center ${bgColor} rounded-full`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      <svg
        width={(size * 20) / 30}
        height={(size * 20) / 30}
        viewBox="0 0 15 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12.1363 5.04544L6.22725 10.9545L3.27271 7.99999"
          stroke={iconColor} // Use the passed icon color, defaulting to white
          strokeWidth="1.47727"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default IconContainer;
