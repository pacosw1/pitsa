import React, { Component } from "react";
import "../css/LoadingScreen.css";
export const LoadingScreen = props => {
  return (
    <div id="loading">
      <div className="spinner">
        <div className="double-bounce1"></div>
        <div className="double-bounce2"></div>
      </div>
    </div>
  );
};
