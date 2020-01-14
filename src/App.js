import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./components/js/Sidebar";
import Dashboard from "./components/js/Content";

function App() {
  return (
    <div className="App">
      {/* <Sidebar /> */}
      <Dashboard />
    </div>
  );
}

export default App;
