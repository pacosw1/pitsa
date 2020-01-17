import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/js/Sidebar";
import Navbar from "./components/js/Navbar";
import Content from "./components/js/Content";
import Login from "./components/js/Login";
let axios = require("./components/config/axios");

class App extends React.Component {
  state = {
    sidebarToggle: true,
    ClienteFields: {},
    cotSession: false,
    login: false
  };

  async componentWillMount() {
    var loggedIn = await axios.getUser();
    if (loggedIn) {
      console.log(loggedIn);
      this.setState({ login: true });
    }
  }

  updateField = (field, value) => {
    let fields = this.state.ClienteFields;

    fields[field] = value;
    this.setState({
      ClienteFields: fields
    });
  };

  toggleCot = () => {
    this.setState({ cotSession: !this.state.cotSession });
  };

  saveFields = fields => {
    this.setState({ cotFields: fields, cotSession: true });
  };

  getCotSession = () => {
    return this.state.cotFields;
  };

  toggleMenu = () => {
    let { sidebarToggle } = this.state;
    console.log(sidebarToggle);
    this.setState({
      sidebarToggle: !sidebarToggle
    });
  };

  render() {
    return (
      <div className="Wrapper">
        {this.state.login ? (
          <React.Fragment>
            <Navbar onMenu={this.toggleMenu} />
            <div className="App">
              <Sidebar
                toggle={this.state.sidebarToggle}
                onMenu={this.toggleMenu}
              />
              <Content
                toggleCot={this.toggleCot}
                saveFields={this.saveFields}
                cotSession={this.state.cotSession}
                getCotSession={this.getCotSession}
              />
            </div>
          </React.Fragment>
        ) : (
          <Login {...this.props} />
        )}
      </div>
    );
  }
}

export default App;
