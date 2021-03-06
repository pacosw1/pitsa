import React, { Component } from "react";
import "../css/Table.css";

import "bootstrap/dist/css/bootstrap.css";
import { Redirect, NavLink } from "react-router-dom";
import ErrorPage from "./Error";

import { LoadingScreen } from "./LoadingScreen";
import { string } from "joi";
let f = require("./Fields");
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");
class Catalogo extends Component {
  state = {
    data: [],
    searchValue: "",
    filter: "ID",
    loaded: false,
    search: {
      value: "",
      filter: "",
      filters: []
    }
  };

  selectRecord = id => {
    this.props.history.push(
      `/catalogo/${this.props.header.toLowerCase()}/get/${id}`
    );
  };
  async componentDidMount() {
    let { header } = this.props;
    let { search } = this.state;
    let result = (await axios.getData(header.toLowerCase())) || [];
    var options, fields;
    //load search filters
    var searchCopy = search;
    fields = [...f[header.toLowerCase()]];

    searchCopy.filters = utils.loadFilters(fields);

    //render them
    let data = _.get(result, "data");
    if (!data) this.setState({ error: true });
    else {
      this.setState({
        data: data,

        loaded: true,
        search: searchCopy
      });
    }

    // this.setState({ data: result });
  }

  onSearch = async () => {
    this.setState({ loaded: false });
    let val = this.state.searchValue;
    // if (this.state.filter ==== "ID") val = parseInt(val);
    let result = await axios.createItem(
      `${this.props.header.toLowerCase()}/search`,
      {
        value: val,
        filter: this.state.filter
      }
    );
    var data = _.get(result, "data");
    if (data) this.setState({ data: result.data, loaded: true });
    else this.setState({ error: true });
  };

  onDelete = async id => {
    this.setState({ loaded: false });
    let { header } = this.props;
    let { data } = this.state;
    try {
      let result = await axios.deleteItem(header, id);

      if (result) {
        data = data.filter(item => item._id !== id);
        this.setState({ data, loaded: true });
      }
    } catch (err) {
      console.log(err.message);
      this.setState({ error: true });
    }
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
          field.name === "Cliente" ||
          (field.name === "Planta" && header === "Cotizaciones")
        ) {
          return (
            <td key={field.name} onClick={() => this.selectRecord(record._id)}>
              {field.name === "Planta"
                ? record["Cliente"]["planta"]
                : record["Cliente"].Empresa}
            </td>
          );
        } else if (field.name === "Folio" && header === "Cotizaciones") {
          return (
            <td
              key={field.name}
              onClick={() => this.selectRecord(record._id)}
            ></td>
          );
        } else if (field.name === "Fecha" || field.name === "Entrega") {
          let date =
            field.name === "Fecha"
              ? utils.formatDate(record["Fecha"])
              : utils.formatDate(record["Entrega"]);
          return (
            <td key={field.name} onClick={() => this.selectRecord(record._id)}>
              {date}
            </td>
          );
        } else if (field.name === "Vendedor") {
          return (
            <td key={field} onClick={() => this.selectRecord(record._id)}>
              {record["Vendedor"]["Nombre"]}
            </td>
          );
        } else if (field.name === "Status") {
          if (header === "Cotizaciones") {
            return (
              <td
                key={record._id}
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
                  {/* <p>mostrando {this.state.data.length}</p> */}
                </div>

                <div>
                  <select
                    onChange={e => this.setState({ filter: e.target.value })}
                    style={{ height: "2.5rem", width: "6.4rem" }}
                  >
                    {this.state.search.filters}
                  </select>
                  <input
                    placeholder="Search"
                    style={{ height: "2.5rem", paddingLeft: "1rem" }}
                    onChange={e =>
                      this.setState({ searchValue: e.target.value })
                    }
                  ></input>
                  <button
                    className="search-button"
                    onClick={() => this.onSearch()}
                  >
                    Buscar
                  </button>
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
