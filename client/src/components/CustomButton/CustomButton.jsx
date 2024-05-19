import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const CustomButton = ({
  name,
  to,
  icon,
  backgroundColor,
  color,
  hoverBackgroundColor,
  hoverColor,
  hoverBorderColor,
  onClick,
}) => {
  let navigate = useNavigate(); // Hook for programmatic navigation

   // Handle button click: navigate if `to` is provided, else execute `onClick`
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    }
  };

  const [isHovered, setIsHovered] = React.useState(false);

  const buttonStyle = {
    padding: "10px 20px",
    backgroundColor: isHovered
      ? hoverBackgroundColor || backgroundColor
      : backgroundColor || "transparent",
    color: isHovered ? hoverColor || color : color || "var(--pure-white)",
    border: `2px solid ${
      isHovered
        ? hoverBorderColor || hoverColor || color
        : hoverBorderColor || "var(--darker-purple)"
    }`,
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
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
      {icon && <FontAwesomeIcon icon={icon} />}
      {name}
    </button>
  );
};

export default CustomButton;
