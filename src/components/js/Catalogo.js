import React, { Component } from "react";
import "../css/Table.css";

import "bootstrap/dist/css/bootstrap.css";
import { Redirect, NavLink } from "react-router-dom";
import ErrorPage from "./Error";
import { LoadingScreen } from "./LoadingScreen";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
class Catalogo extends Component {
  state = {
    data: [],
    loaded: false
  };

  selectRecord = id => {
    this.props.history.push(
      `/catalogo/${this.props.header.toLowerCase()}/get/${id}`
    );
  };
  async componentWillMount() {
    let { header } = this.props;
    let result = (await axios.getData(header.toLowerCase())) || [];

    if (result.status !== 200) this.setState({ error: true });
    else {
      this.setState({ data: result.data, loaded: true });
    }

    // this.setState({ data: result });
  }

  onDelete = async id => {
    let { header } = this.props;
    let result = await axios.deleteItem(header, id);
    console.log(result);
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
      var cotStatus = ["Pendiente", "Vigente", "Cancelada"];
      var status = [
        "Cancelada por Cliente",
        "Vigente",
        "En Proceso",
        "Terminada"
      ];
      let td = fields.map(field => {
        if (
          field.name == "Cliente" ||
          (field.name == "Planta" && header == "Cotizaciones")
        ) {
          return (
            <td key={field.name} onClick={() => this.selectRecord(record._id)}>
              {field.name == "Planta"
                ? record["Cliente"]["planta"]
                : record["Cliente"].Empresa}
            </td>
          );
        } else if (field.name == "Folio" && header == "Cotizaciones") {
          return (
            <td
              key={field.name}
              onClick={() => this.selectRecord(record._id)}
            ></td>
          );
        } else if (field.name == "Fecha" || field.name == "Entrega") {
          let date = utils.formatDate(record["Fecha"]);
          return (
            <td key={field.name} onClick={() => this.selectRecord(record._id)}>
              {date}
            </td>
          );
        } else if (field.name == "Vendedor") {
          return (
            <td key={field} onClick={() => this.selectRecord(record._id)}>
              {record["Vendedor"]["Nombre"]}
            </td>
          );
        } else if (field.name == "Status") {
          if (header == "Cotizaciones") {
            return (
              <td
                key={field.name.Empresa}
                onClick={() => this.selectRecord(record._id)}
              >
                {record[field.name] <= 3
                  ? cotStatus[record[field.name]]
                  : "OT" + record[field.name]}
              </td>
            );
          } else {
            return (
              <td
                key={field.name.Empresa}
                onClick={() => this.selectRecord(record._id)}
              >
                {status[record[field.name]]}
              </td>
            );
          }
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
      <div className="t">
        {this.state.error ? (
          <ErrorPage />
        ) : (
          <div>
            <div className="x">
              <h2>{header}</h2>
              <div className="head-actions">
                <div>
                  <NavLink
                    className="no-link"
                    to={`/catalogo/${header.toLowerCase()}/new`}
                  >
                    <button className="btn btn-primary">Nuevo</button>
                  </NavLink>
                </div>
                <div>
                  {/* <select style={{ height: "2rem" }}>
                    <option>Por Empresa</option>
                  </select> */}
                  {/* <input
                    placeholder="Search"
                    style={{ width: "10rem", height: "2rem" }}
                  ></input>
                  <button className="search-button">Buscar</button> */}
                </div>
              </div>
              <div id="tables">
                {!this.state.loaded ? (
                  <LoadingScreen />
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        {fieldsList}
                        <th>Eliminar</th>
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
