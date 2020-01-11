import React, { Component } from "react";
import "../css/OT.css";
import ErrorPage from "./Error";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");

class Cliente extends Component {
  state = {
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
    let { fields } = this.state;
    let { match, edit } = this.props;
    var result;

    //format data

    fields.Vendedor = this.state.Data.Vendedores.find(
      client => client._id == fields.Vendedor
    );

    if (edit) {
      let id = match.params.id;

      result = await utils.onSubmit("clientes", id, fields, true);
    } else result = await utils.onSubmit("clientes", "id", fields, false);
    console.log(result);
    if (!result) this.setState({ error: true });
    else await (window.location = "/catalogo/clientes");
  };

  render() {
    //options for cond de pago.

    let { Vendedores } = this.state.selects;

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

                  {utils.renderInput("fields", "Empresa", this)}
                  {utils.renderInput("fields", "Calle", this)}
                  {utils.renderInput("fields", "Colonia", this)}
                  {utils.renderInput("fields", "Planta", this)}
                  {utils.renderInput("fields", "NumProvedor", this)}
                  {utils.renderInput("fields", "Ciudad", this)}
                  {utils.renderInput("fields", "Estado", this)}
                  {utils.renderInput("fields", "CP", this)}
                  {utils.renderInput("fields", "Telefono", this)}
                  {utils.renderInput("fields", "RFC", this)}
                  {utils.renderInput("fields", "Pais", this)}
                  {utils.renderSelect("Vendedor", Vendedores, "fields", this)}

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

export default Cliente;

//components
