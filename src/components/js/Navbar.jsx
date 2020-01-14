import React, { Component } from "react";
import "../css/Navbar.css";
import { NavLink } from "react-router-dom";

class Navbar extends Component {
  state = {};
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
          <NavLink to="/login">
            {/* <button class="btn btn-purple">Iniciar Sesion</button> */}
          </NavLink>
        </div>
      </div>
    );
  }
}

export default Navbar;
