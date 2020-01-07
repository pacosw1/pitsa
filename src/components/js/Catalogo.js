import React, { Component } from "react";
import "../css/Table.css";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
import ErrorPage from "./Error";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
class Catalogo extends Component {
  state = {
    data: [],
    loaded: false
  };

  selectRecord = id => {
    return (window.location = `/catalogo/${this.props.header.toLowerCase()}/get/${id}`);
  };
  async componentWillMount() {
    let { header } = this.props;
    let result = (await axios.getData(header.toLowerCase())) || [];

    if (result.status !== 200) this.setState({ error: true });
    else {
      this.setState({ data: result.data, loaded: true });
    }

    console.log(result);
    // this.setState({ data: result });
  }

  onDelete = async id => {
    let { header } = this.props;
    let result = await axios.deleteItem(header, id);
    return (window.location = "/catalogo/" + header.toLowerCase());
  };

  render() {
    let { data } = this.state;
    let { fields, header } = this.props;
    let fieldsList = fields.map(field => {
      return (
        <th key={field.placeholder} scope="col">
          {field.placeholder}
        </th>
      );
    });
    let dataList = data.map(record => {
      var status = [
        "Cancelada por Cliente",
        "En Proceso",
        "Perdida",
        "Aprobada"
      ];
      let td = fields.map(field => {
        console.log(field);
        if (
          field.name == "Cliente" ||
          (field.name == "Planta" && header == "Cotizaciones")
        ) {
          return (
            <td
              key={field.name.Empresa}
              onClick={() => this.selectRecord(record._id)}
            >
              {field.name == "Planta"
                ? record["Cliente"]["Planta"]
                : record["Cliente"]["Empresa"]}
            </td>
          );
        } else if (field.name == "Status") {
          return (
            <td
              key={field.name.Empresa}
              onClick={() => this.selectRecord(record._id)}
            >
              {status[record[field.name]]}
            </td>
          );
        } else {
          return (
            <td key={field.name} onClick={() => this.selectRecord(record._id)}>
              {record[field.name]}
            </td>
          );
        }
      });
      return (
        <tr key={record._id} className="table-item">
          {td}
          <td>
            <button
              className="delete-button"
              onClick={() => this.onDelete(record._id)}
            >
              x
            </button>
          </td>
        </tr>
      );
    });
    return (
      <div>
        {this.state.error ? (
          <ErrorPage />
        ) : (
          <div>
            <div className="t">
              <h2>{header}</h2>
              <NavLink
                className="no-link"
                to={`/catalogo/${header.toLowerCase()}/new`}
              >
                <button>Nuevo</button>
              </NavLink>
              <div id="tables">
                {!this.state.loaded ? (
                  <LoadingScreen />
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        {fieldsList}
                        <th />
                      </tr>
                    </thead>

                    <tbody>{dataList}</tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Catalogo;
