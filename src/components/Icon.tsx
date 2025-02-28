import React from "react";
import "../styles/icon.css";

interface IconProps {
  name: string;
  image: string;
  isSelected?: boolean;
  onClick?: () => void; // ✅ Added onClick as an optional prop
}

const Icon: React.FC<IconProps> = ({ name, image, isSelected = false, onClick }) => {
  return (
    <div className={`icon ${isSelected ? "selected" : ""}`} onClick={onClick}> {/* ✅ Apply onClick */}
      <img src={image} alt={name} />
      <span>{name}</span>
    </div>
  );
};

export default Icon;
