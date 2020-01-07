import React, { Component } from "react";
import "../css/ErrorPage.css";
class ErrorPage extends Component {
  state = {};
  render() {
    return (
      <div className="error">
        <h1>No hay conexion al servidor</h1>
      </div>
    );
  }
}

export default ErrorPage;
