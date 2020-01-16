import React, { Component } from "react";
import "../css/Login.css";

var utils = require("../utlis/utils");

class Login extends Component {
  state = {
    fields: {},
    fieldError: {}
  };
  render() {
    let { fieldError } = this.state;
    return (
      <div className="login">
        <div className="login-container">
          <div className="login-header">
            <h1>PITSA</h1>
          </div>

          {utils.renderInput(
            "fields",
            "username",
            this,
            fieldError["username"] ? true : false,
            "logInput"
          )}
          {utils.renderInput(
            "fields",
            "password",
            this,
            fieldError["password"] ? true : false,
            "logInput"
          )}
          <button className="btn btn-primary ">Iniciar Sesion</button>
        </div>
      </div>
    );
  }
}

export default Login;
