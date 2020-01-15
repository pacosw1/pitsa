import React, { Component } from "react";
import "../css/OT.css";
import ErrorPage from "./Error";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let { clientesSchema } = require("./Fields");
let _ = require("lodash");
let Joi = require("@hapi/joi");

class Cliente extends Component {
  state = {
    saving: false,
    errorField: {},
    errorMessage: "",
    Data: {
      Vendedores: []
    },
    selects: { Vendedores: [] },
    error: false,
    fields: {}
  };

  async componentWillMount() {
    let { fields, Data } = this.state;
    let { match, edit } = this.props;
    var selects = {};
    var result;

    //request API select data
    var clientData = await utils.getSelectData("vendedores");

    //load API select data
    if (clientData) {
      selects["Vendedores"] = utils.loadSelectData(clientData, "Nombre");
      Data["Vendedores"] = clientData;
      fields.Vendedor = clientData[0]._id;
    } else this.setState({ error: true });

    if (edit) {
      let id = match.params.id;

      result = await utils.getRecord("clientes", id);
      if (result) {
        var currClient = result.Vendedor;
        result.Vendedor = result.Vendedor._id;

        this.setState({ fields: result, Vendedor: currClient, loaded: true });
      } else this.setState({ error: true });
    }
    ///////

    this.setState({ selects, Data, loaded: true });
    ///////
  }

  //fucntions

  onSubmit = async () => {
    this.setState({ saving: true });

    let { fields } = this.state;
    let { edit, match } = this.props;
    var result,
      errorField = {};

    try {
      await clientesSchema.validateAsync({ ...fields });
      //

      fields.Vendedor = this.state.Data.Vendedores.find(
        client => client._id == fields.Vendedor
      );

      if (edit) {
        let id = match.params.id;

        result = await utils.onSubmit("clientes", id, fields, true);
      } else result = await utils.onSubmit("clientes", "id", fields, false);
      console.log(result);
      if (!result) this.setState({ error: true });
      else {
        if (this.props.cotActive)
          this.props.history.push("/catalogo/cotizaciones/new");
        else this.props.history.push(`/catalogo/clientes`);
      }
    } catch (err) {
      this.setState({ saving: false });

      let { message, path } = err.details[0];
      errorField[path[0]] = message;
      this.setState({
        validateFailed: true,
        errorField,
        errorMessage: message
      });
    }

    //format data
  };

  render() {
    //options for cond de pago.

    let { Vendedores } = this.state.selects;
    let { errorField } = this.state;
    return (
      <div className="OT">
        {!this.state.loaded || this.state.saving ? (
          <LoadingScreen />
        ) : (
          <React.Fragment>
            {this.state.error ? (
              <ErrorPage />
            ) : (
              <React.Fragment>
                <div className="split-header">
                  <div>
                    <h4>
                      {this.props.edit ? "Editar Cliente" : "Nuevo Cliente"}
                    </h4>
                    <p style={{ color: "red", marginLeft: "2rem" }}>
                      {this.state.errorMessage}
                    </p>
                  </div>

                  <div className="btns">
                    <button
                      onClick={() => this.props.history.goBack()}
                      className=" btn btn-danger subBtn"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => this.onSubmit()}
                      className="btn subBtn btn-primary "
                    >
                      Guardar
                    </button>
                  </div>
                </div>

                <div className="split-left">
                  {utils.renderInput(
                    "fields",
                    "Empresa",
                    this,
                    errorField["Empresa"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Calle",
                    this,
                    errorField["Calle"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Colonia",
                    this,
                    errorField["Colonia"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Planta",
                    this,
                    errorField["Planta"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "NumProvedor",
                    this,
                    errorField["NumProvedor"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Ciudad",
                    this,
                    errorField["Ciudad"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Estado",
                    this,
                    errorField["Estado"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "CP",
                    this,
                    errorField["CP"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Telefono",
                    this,
                    errorField["Telefono"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "RFC",
                    this,
                    errorField["RFC"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Pais",
                    this,
                    errorField["Pais"] ? true : false
                  )}
                  {utils.renderSelect(
                    "Vendedor",
                    Vendedores,
                    "fields",
                    this,
                    errorField["Vendedor"] ? true : false
                  )}
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Cliente;

//components
