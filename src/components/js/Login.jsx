import React, { Component } from "react";
import "../css/Login.css";

var a = require("axios");
var utils = require("../utlis/utils");
var axios = require("../config/axios");

class Login extends Component {
  state = {
    fields: {},
    errorMessage: "",
    fieldError: {}
  };

  onLogin = async () => {
    let account = this.state.fields;
    let res = await axios.login(account);

    if (res) {
      if (!res.status) this.setState({ errorMessage: res.message });
      else {
        //login successfull
        if (res.token) {
          localStorage.setItem("token", res.token);
          window.location = "/catalogos/clientes";
        }
      }
    }
  };
  render() {
    let { fieldError, errorMessage } = this.state;
    return (
      <div className="login">
        <div className="login-container">
          <div className="login-header">
            <h1>PITSA</h1>
            <p style={{ color: "red" }}>{errorMessage}</p>
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
          <button className="btn btn-primary " onClick={() => this.onLogin()}>
            Iniciar Sesion
          </button>
        </div>
      </div>
    );
  }
}

export default Login;
