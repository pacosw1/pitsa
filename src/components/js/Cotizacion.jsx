import React, { Component } from "react";
import { LoadingScreen } from "./loadingScreen";
import ErrorPage from "./Error";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");

class Cotizacion extends Component {
  state = {
    Data: {
      Clientes: []
    },
    selects: { Clientes: [] },
    error: false,
    options: {
      Status: [
        { _id: 0, value: "Cancelada" },
        { _id: 1, value: "Vigente" },
        { _id: 2, value: "En Proceso" },
        { _id: 3, value: "Terminada" }
      ]
    },
    fields: {}
  };

  async componentWillMount() {
    let { fields, Data } = this.state;
    let { match, edit } = this.props;
    var selects = {};
    var result;

    //request API select data
    var clientData = await utils.getSelectData("Clientes");

    //load API select data
    if (clientData) {
      selects["Clientes"] = utils.loadSelectData(clientData, "Empresa");
      Data["Clientes"] = clientData;
      fields.Cliente = clientData[0]._id;
    } else {
      alert("error");
      this.setState({ error: true });
    }

    selects["Status"] = utils.loadSelectData(
      this.state.options.Status,
      "value"
    );

    if (edit) {
      let id = match.params.id;

      result = await utils.getRecord("cotizaciones", id);
      if (result) {
        var currClient = result.Cliente;
        result.Cliente = result.Cliente._id;

        this.setState({ fields: result, Cliente: currClient, loaded: true });
      } else {
        this.setState({ error: true });
        alert("error");
      }
    }
    ///////

    this.setState({ selects, Data, loaded: true });
    ///////
  }

  //fucntions

  onSubmit = async () => {
    let { fields } = this.state;
    let { match, edit } = this.props;
    var result;

    //format data

    fields.Cliente = this.state.Data.Clientes.find(
      client => client._id == fields.Cliente
    );

    if (edit) {
      let id = match.params.id;

      result = await utils.onSubmit("cotizaciones", id, fields, true);
    } else result = await utils.onSubmit("cotizaciones", "id", fields, false);
    console.log(result);
    if (!result) this.setState({ error: true });
    else await (window.location = "/catalogo/cotizaciones");
  };

  render() {
    //options for cond de pago.

    let { Clientes, Status } = this.state.selects;

    return (
      <div className="OT">
        {!this.state.loaded ? (
          <LoadingScreen />
        ) : (
          <React.Fragment>
            {this.state.error ? (
              <ErrorPage />
            ) : (
              <React.Fragment>
                <div className="split-left">
                  <h4>
                    {this.props.edit ? "Editar Cliente" : "Nuevo Cliente"}
                  </h4>

                  {utils.renderInput("fields", "Folio", this)}
                  {utils.renderInput("fields", "Fecha", this)}
                  {utils.renderInput("fields", "Concepto", this)}
                  {utils.renderInput("fields", "Total", this)}

                  {utils.renderSelect("Cliente", Clientes, "fields", this)}
                  {utils.renderSelect("Status", Status, "fields", this)}

                  <button
                    onClick={() => this.onSubmit()}
                    style={{ width: "35rem" }}
                  >
                    Guardar
                  </button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Cotizacion;

//components
