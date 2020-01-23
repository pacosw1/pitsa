import React, { Component } from "react";
import { LoadingScreen } from "./LoadingScreen";
import ErrorPage from "./Error";
import { clientes } from "./Fields";
import SelectClient from "./SelectClient";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");
let { cotizSchema } = require("./Fields");

class Cotizacion extends Component {
  state = {
    Data: {
      Clientes: [],
      Vendedores: []
    },
    Cliente: {
      Empresa: ""
    },
    clientSelect: false,
    saving: false,
    errorField: {},
    errorMessage: "",
    selects: { Clientes: [], Vendedores: [] },
    error: false,
    options: {
      Status: [
        { _id: 0, value: "Pendiente" },
        { _id: 1, value: "Vigente" },
        { _id: 2, value: "Cancelada" }
        // { _id: 3, value: "Terminada" }
      ]
    },
    fields: {
      Status: 0,
      Fecha:
        new Date().getDate() +
        "/" +
        new Date().getMonth() +
        1 +
        "/" +
        new Date().getFullYear()
    }
  };

  selectRecord = client => {
    console.log(client);
    let { fields } = this.state;
    fields.Cliente = client;
    this.setState({ Cliente: client, fields, clientSelect: false });
  };

  async componentWillMount() {
    let { fields, Data } = this.state;
    let { match, edit, cotSession, getCotSession } = this.props;
    var selects = {};
    var result, date;

    //request API select data
    var sellerData = await utils.getSelectData("Vendedores");

    //load API select data
    if (sellerData) {
      selects["Vendedores"] = utils.loadSelectData(sellerData, "Nombre");
      Data["Vendedores"] = sellerData;
      fields.Vendedor = sellerData[0]._id;
    } else {
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
        result.Vendedor = result.Vendedor._id;
        date = new Date(result.Fecha);
        result.Fecha = `${date.getMonth() +
          1}/${date.getDate()}/${date.getFullYear()}`;

        this.setState({ fields: result, Cliente: currClient, loaded: true });
      } else {
        this.setState({ error: true });
      }
    } else if (cotSession) {
      let savedFields = getCotSession();
      this.setState({ fields: savedFields });
      this.props.toggleCot();
    }
    ///////

    this.setState({ selects, Data, loaded: true });
    ///////
  }

  //fucntions

  newClient = () => {
    this.props.history.push("/catalogo/clientes/new");
  };

  onSubmit = async () => {
    this.setState({ saving: true });
    let { fields } = this.state;
    let { match, edit } = this.props;
    var result,
      res,
      errorField = {};

    //format data

    try {
      res = await cotizSchema.validateAsync({ ...fields });

      fields.Cliente = this.state.Cliente;
      fields.Vendedor = this.state.Data.Vendedores.find(
        client => client._id == fields.Vendedor
      );

      if (edit) {
        let id = match.params.id;

        result = await utils.onSubmit("cotizaciones", id, fields, true);
      } else result = await utils.onSubmit("cotizaciones", "id", fields, false);
      console.log(result);
      if (!result) this.setState({ error: true });
      else this.props.history.push(`/catalogo/cotizaciones`);
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
  };

  render() {
    //options for cond de pago.

    let { Clientes, Status, Vendedores } = this.state.selects;
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
                {this.state.clientSelect ? (
                  <React.Fragment>
                    <SelectClient
                      selectRecord={this.selectRecord}
                      header="clientes"
                      fields={clientes}
                    />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div className="split-header">
                      <div>
                        <h4>
                          {this.props.edit
                            ? "Editar Cotizacion"
                            : "Nueva Cotizacion"}
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
                        "Fecha",
                        this,
                        errorField["Fecha"] ? true : false,
                        "",
                        "MM/DD/YYYY"
                      )}
                      {utils.renderInput(
                        "fields",
                        "Concepto",
                        this,
                        errorField["Concepto"] ? true : false
                      )}
                      {utils.renderSelect(
                        "Vendedor",
                        Vendedores,
                        "fields",
                        this,
                        errorField["Vendedor"] ? true : false
                      )}
                      {/* {utils.renderInput(
                    "fields",
                    "Total",
                    this,
                    errorField["Total"] ? true : false
                  )} */}
                      <br />
                      <button
                        className="btn btn-primary "
                        onClick={() => [
                          this.props.saveFields(this.state.fields),
                          this.newClient()
                        ]}
                        style={{ width: " 400px" }}
                      >
                        Nuevo Cliente
                      </button>
                      <br />
                      <span> o cliente existente</span>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <h1 style={{ fontSize: "20px", marginTop: ".5rem" }}>
                          Cliente
                        </h1>
                        <input disabled value={this.state.Cliente.Empresa} />
                        <button
                          className="btn btn-primary"
                          onClick={e => this.setState({ clientSelect: true })}
                          style={{ height: "2.5rem" }}
                        >
                          Selecionar
                        </button>
                      </div>
                      {utils.renderSelect(
                        "Status",
                        Status,
                        "fields",
                        this,
                        errorField["Status"] ? true : false
                      )}
                    </div>
                  </React.Fragment>
                )}
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
