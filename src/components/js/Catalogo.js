import React, { Component } from "react";
import "../css/Table.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
class Catalogo extends Component {
  state = {
    data: {}
  };
  render() {
    let { fields, header } = this.props;
    let fieldsList = fields.map(field => {
      return <th scope="col">{field}</th>;
    });
    return (
      <div className="t">
        <h2>{header}</h2>
        <NavLink
          className="no-link"
          to={`/catalogo/${header.toLowerCase()}/new`}
        >
          <button>Nuevo</button>
        </NavLink>
        <table className="table ">
          <thead>
            <tr>
              {fieldsList}
              <th />
            </tr>
          </thead>
          <tbody>
            <tr className="table-item" />
          </tbody>
        </table>
      </div>
    );
  }
}

export default Catalogo;
