import React, { Component } from "react";
import { LoadingScreen } from "./loadingScreen";
import ErrorPage from "./Error";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");
let { cotizSchema } = require("./Fields");

class Cotizacion extends Component {
  state = {
    Data: {
      Clientes: []
    },
    errorField: {},
    errorMessage: "",
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
    fields: {
      Status: 0
    }
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
        result.Fecha = result.Fecha.slice(0, 10);

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
    var result,
      res,
      errorField = {};

    //format data

    try {
      res = await cotizSchema.validateAsync({ ...fields });

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
    } catch (err) {
      let { message, path } = err.details[0];
      errorField[path[0]] = message;
      this.setState({
        validateFailed: true,
        errorField,
        errorMessage: message
      });
    }
  };

  render() {
    //options for cond de pago.

    let { Clientes, Status } = this.state.selects;
    let { errorField } = this.state;
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
                    {this.props.edit ? "Editar Cotizacion" : "Nueva Cotizacion"}
                  </h4>
                  <p style={{ color: "red" }}>{this.state.errorMessage}</p>

                  {utils.renderInput(
                    "fields",
                    "Folio",
                    this,
                    errorField["Folio"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Fecha",
                    this,
                    errorField["Fecha"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Concepto",
                    this,
                    errorField["Concepto"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Total",
                    this,
                    errorField["Total"] ? true : false
                  )}

                  {utils.renderSelect(
                    "Cliente",
                    Clientes,
                    "fields",
                    this,
                    errorField["Cliente"] ? true : false
                  )}
                  {utils.renderSelect(
                    "Status",
                    Status,
                    "fields",
                    this,
                    errorField["Status"] ? true : false
                  )}
                  <button onClick={() => this.onSubmit()} className="subBtn">
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
