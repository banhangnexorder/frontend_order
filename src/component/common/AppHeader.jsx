import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import "../../css/common/AppHeader.css";

export default function AppHeader({
  title = "",
  leftIcon = null,
  rightIcon = null,
  onLeftClick,
  onRightClick,
  leftLink = null, // nếu có thì wrap bằng Link
  bg = "var(--coffee-dark)",
  color = "#fff",
}) {
  const LeftButton = () => {
    if (leftLink)
      return (
        <Link to={leftLink} className="header-btn left-btn">
          {leftIcon || <FiArrowLeft size={22} />}
        </Link>
      );
    if (onLeftClick)
      return (
        <button className="header-btn left-btn" onClick={onLeftClick}>
          {leftIcon || <FiArrowLeft size={22} />}
        </button>
      );
    return null;
  };

  const RightButton = () =>
    rightIcon ? (
      <button className="header-btn right-btn" onClick={onRightClick}>
        {rightIcon}
      </button>
    ) : null;

  return (
    <header className="app-header" style={{ background: bg, color }}>
      <div className="header-inner">
        <LeftButton />
        <h3 className="header-title">{title}</h3>
        <RightButton />
      </div>
    </header>
  );
}
