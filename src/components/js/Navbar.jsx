import React, { Component } from "react";
import "../css/Navbar.css";
import { NavLink } from "react-router-dom";
let axios = require("../config/axios");

class Navbar extends Component {
  state = {
    username: ""
  };

  componentDidMount() {
    let user = axios.getUser();
    if (user.username) {
      this.setState({ username: user.username });
    }
  }
  render() {
    let { onMenu } = this.props;
    return (
      <div id="navbar">
        <div id="left">
          <button className="btn btn-purple-outline" onClick={() => onMenu()}>
            PITSA
          </button>
        </div>
        <div id="right">
          <NavLink to="/account">
            <button className="btn btn-purple">{this.state.username}</button>
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Navbar;
