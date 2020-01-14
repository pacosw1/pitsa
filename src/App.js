import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/js/Sidebar";
import Dashboard from "./components/js/Content";
import Navbar from "./components/js/Navbar";

class App extends React.Component {
  state = { sidebarToggle: true };

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
        <Navbar onMenu={this.toggleMenu} />
        <div className="App">
          <Sidebar toggle={this.state.sidebarToggle} onMenu={this.toggleMenu} />
          <Dashboard />
        </div>
      </div>
    );
  }
}

export default App;
