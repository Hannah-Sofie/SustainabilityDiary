import React from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div>
      <div className="notFoundContainer">
        <div className="notFoundText">404: Page Not Found</div>
        <Link to="/" className="homeLink">
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
