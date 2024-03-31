import React from "react";
import { useNavigate } from "react-router-dom";

const CustomButton = ({
  name,
  to,
  backgroundColor,
  color,
  hoverBackgroundColor,
  hoverColor,
  hoverBorderColor,
}) => {
  let navigate = useNavigate();

  const handleClick = () => {
    navigate(to);
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: isHovered
      ? hoverBackgroundColor || backgroundColor
      : backgroundColor || "transparent",
    color: isHovered ? hoverColor || color : color || "var(--orange)",
    border: `2px solid ${
      isHovered
        ? hoverBorderColor || hoverColor || color
        : color || "var(--orange)"
    }`,
    borderRadius: "120px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    transition: "background-color 0.3s, color 0.3s, border-color 0.3s",
  };

  return (
    <button
      className="custom-button"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={buttonStyle}
    >
      {name}
    </button>
  );
};

export default CustomButton;
