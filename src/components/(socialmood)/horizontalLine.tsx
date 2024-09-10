import React from "react";

const HorizontalLine: React.FC<{ width?: string; color?: string }> = ({
  width = "w-full",
  color = "border-gray-300",
}) => {
  return <div className={`border-t ${color} ${width}`} />;
};

export default HorizontalLine;
