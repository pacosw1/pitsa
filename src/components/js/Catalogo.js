import React, { Component } from "react";
import "../css/Table.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
let axios = require("../config/axios");
class Catalogo extends Component {
  state = {
    data: []
  };

  selectRecord = id => {
    return (window.location = `/catalogo/${this.props.header.toLowerCase()}/get/${id}`);
  };
  async componentDidMount() {
    let { header } = this.props;
    let result = (await axios.getData(header.toLowerCase())) || [];
    this.setState({ data: result });
  }
  render() {
    let { data } = this.state;
    let { fields, header } = this.props;
    let fieldsList = fields.map(field => {
      return <th scope="col">{field}</th>;
    });
    let dataList = data.map(record => {
      let td = fields.map(field => {
        return <td>{record[field]}</td>;
      });
      return (
        <tr
          className="table-item"
          onClick={() => this.selectRecord(record._id)}
        >
          {td}
        </tr>
      );
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
          <tbody>{dataList}</tbody>
        </table>
      </div>
    );
  }
}

export default Catalogo;
