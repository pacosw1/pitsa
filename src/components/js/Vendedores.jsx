import React, { Component } from "react";
import "../css/OT.css";
import ErrorPage from "./Error";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");
let { vendedorSchema } = require("./Fields");

class Vendedor extends Component {
  state = {
    error: false,
    loaded: false,
    errorField: {},
    errorMessage: "",
    fields: {}
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async componentWillMount() {
    let { fields, parts, Data } = this.state;
    let { match, edit } = this.props;
    var result;

    //request API select data

    ///////edit load data
    if (edit) {
      let id = match.params.id;

      result = await utils.getRecord("vendedores", id);
      if (result) {
        this.setState({ fields: result, loaded: true });
      } else this.setState({ error: true });
    } else {
      this.setState({ loaded: true });
    }

    ///////
  }

  //fucntions

  onSubmit = async () => {
    let { fields } = this.state;
    let { match, edit } = this.props;
    var result,
      res,
      errorField = {};

    try {
      res = await vendedorSchema.validateAsync({ ...fields });
      if (edit) {
        let id = match.params.id;

        result = await utils.onSubmit("vendedores", id, fields, true);
      } else result = await utils.onSubmit("vendedores", "id", fields, false);
      console.log(result);
      if (!result) this.setState({ error: true });
      else await (window.location = "/catalogo/vendedores");
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

    let { Parts } = this.state.fields;
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
                  <div className="split-header">
                    <h4>
                      {this.props.edit ? "Editar Vendedor" : "Nuevo Vendedor"}
                    </h4>
                    <p style={{ color: "red" }}>{this.state.errorMessage}</p>
                  </div>
                  {utils.renderInput(
                    "fields",
                    "Nombre",
                    this,
                    errorField["Nombre"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Zona",
                    this,
                    errorField["Zona"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Telefono",
                    this,
                    errorField["Telefono"] ? true : false
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

export default Vendedor;

//components
