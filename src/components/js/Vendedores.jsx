import React, { Component } from "react";
import "../css/OT.css";
import ErrorPage from "./Error";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");

class Vendedor extends Component {
  state = {
    error: false,
    loaded: false,
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
    var result;

    if (edit) {
      let id = match.params.id;

      result = await utils.onSubmit("vendedores", id, fields, true);
    } else result = await utils.onSubmit("vendedores", "id", fields, false);
    console.log(result);
    if (!result) this.setState({ error: true });
    else await (window.location = "/catalogo/vendedores");
  };

  render() {
    //options for cond de pago.

    let { Parts } = this.state.fields;

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
                  <h4>Nuevo Vendedor</h4>

                  {utils.renderInput("fields", "Nombre", this)}
                  {utils.renderInput("fields", "Zona", this)}
                  {utils.renderInput("fields", "Telefono", this)}

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

export default Vendedor;

//components
