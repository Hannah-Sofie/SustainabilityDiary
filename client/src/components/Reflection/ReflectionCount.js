import React from "react";
import "./ReflectionCount.css";

const ReflectionCount = ({ count }) => {
  return (
    <div className="row-reflections">
      <p>
        You have <span>{count}</span> reflections in total
      </p>
    </div>
  );
};

export default ReflectionCount;
