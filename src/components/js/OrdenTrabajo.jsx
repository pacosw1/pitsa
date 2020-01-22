import React, { Component } from "react";
import "../css/OT.css";
import ErrorPage from "./Error";
import { ordenSchema } from "./Fields";
import { LoadingScreen } from "./LoadingScreen";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");

class OrdenTrabajo extends Component {
  state = {
    saving: false,
    errorField: {},
    errorMessage: "",
    error: false,
    Cliente: {
      Vendedor: {},
      Pais: "",
      NumProv: ""
    },
    Data: {
      Clientes: []
    },
    fields: {
      Enviar: { Direccion: "", Cliente: "" },
      Parts: [],
      CondPago: 100,
      Planta: 0,
      Moneda: "MXN",
      Status: 0,
      Fecha: new Date().toLocaleDateString(),
      Cliente: ""
    },
    clientes: [],

    selects: {
      CondPago: [],
      Status: [],
      Planta: []
    },
    options: {
      CondPago: [
        { value: "100% P/F", _id: 100 },
        { value: "7 dias", _id: 7 },
        { value: "10 dias", _id: 10 },
        { value: "14 dias", _id: 14 },
        { value: "15 dias", _id: 15 },
        { value: "30 dias", _id: 30 },
        { value: "45 dias", _id: 45 },
        { value: "60 dias", _id: 60 },
        { value: "90 dias", _id: 90 }
      ],

      Status: [
        { _id: 0, value: "Cancelada" },
        { _id: 1, value: "Vigente" },
        { _id: 2, value: "Terminada" }
      ],
      Planta: [
        { _id: 0, value: "Nuestra Planta" },
        { _id: 1, value: "Su Planta" }
      ],
      Moneda: [
        { _id: "MXN", value: "MXN" },
        { _id: "USD", value: "USD" }
      ]
    }
  };

  updateField = field => {
    let { fields } = this.state;
    let { name, value } = field;
    if (field.Enviar) {
      fields.Enviar[name] = value;
    } else {
      fields[name] = value;
    }
    this.setState({
      fields: fields
    });
  };

  updateTotal = parts => {
    let { fields } = this.state;
    console.log("updated total");
    var copy = fields;

    var sum = 0.0;
    parts.forEach(({ cant, pu }) => {
      sum += cant * pu;
    });

    sum = sum * (1 + fields.IVA / 100);
    sum = sum.toFixed(2);
    copy.Importe = sum;
    sum = utils.formatMoney(sum);
    // copy.ImporteDisplay = sum;
    this.setState({ fields: copy });
  };

  findSelected = (id, field) => {
    let copy = this.state.fields;

    var res = copy[field].find(item => item._id == id);
    copy.field = res;

    this.setState({ fields: copy });
    alert("working");
  };

  async componentWillMount() {
    let { fields, parts, Data } = this.state;
    let { match, edit } = this.props;
    var selects = {};
    var result;

    var client, condPago;

    //request API select data
    var clientData = await utils.getSelectData("clientes");

    //load API select data
    if (clientData) {
      selects["Clientes"] = utils.loadSelectData(clientData, "Empresa");
      Data["Clientes"] = clientData;
      fields.Cliente = clientData[0]._id;
    } else this.setState({ error: true });

    //////////// load static data selects
    selects["CondPago"] = utils.loadSelectData(
      this.state.options.CondPago,
      "value"
    );

    selects["Moneda"] = utils.loadSelectData(
      this.state.options.Moneda,
      "value"
    );
    selects["Planta"] = utils.loadSelectData(
      this.state.options.Planta,
      "value"
    );

    selects["Status"] = utils.loadSelectData(
      this.state.options.Status,
      "value"
    );
    /////////////

    ///////edit load data
    if (edit) {
      let id = match.params.id;

      result = await utils.getRecord("ordenes", id);
      if (result) {
        var currClient = result.Cliente;
        result.Cliente = result.Cliente._id;
        result.Entrega = result.Entrega.slice(0, 10);
        result.Fecha = result.Fecha.slice(0, 10);

        this.setState({ fields: result, Cliente: currClient });
      } else this.setState({ error: true });
    }
    ///////

    this.setState({ selects, Data, loaded: true });
  }

  //fucntions

  onSubmit = async () => {
    this.setState({ saving: true });
    let { fields } = this.state;
    let { match, edit } = this.props;
    var result,
      errorField = {};

    try {
      await ordenSchema.validateAsync({ ...fields });

      fields.Cliente = this.state.Data.Clientes.find(
        client => client._id == fields.Cliente
      );
      if (edit) {
        let id = match.params.id;

        result = await utils.onSubmit("ordenes", id, fields, true);
      } else result = await utils.onSubmit("ordenes", "", fields, false);

      if (!result) this.setState({ error: true });
      else this.props.history.push(`/catalogo/ordenes`);
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

  deletePart = id => {
    let { fields } = this.state;
    let copy = fields;

    copy.Parts = copy.Parts.filter(part => part.id !== id);

    this.setState({ fields: copy }, () => this.updateTotal(copy.Parts));
  };

  updatePart = (id, name, value) => {
    let { Parts } = this.state.fields;
    let copy = Parts;

    let part = copy.find(part => part.id == id);
    part[name] = value;
    this.updateTotal(copy);
    this.setState({ Parts: copy });
  };

  addPart = () => {
    let { Parts, partCount } = this.state.fields;
    let copy = Parts;
    copy.push({
      id: new Date().getMilliseconds(),
      parte: "",
      cant: 0,
      concepto: "",
      pu: 0
    });
    partCount += 1;
    this.setState({ Parts: copy });
  };

  render() {
    //options for cond de pago.

    let { Parts } = this.state.fields;

    let renderParts = Parts.map(part => {
      console.log(part);
      let { parte, cant, concepto, pu, id } = part;
      return (
        <Part
          deletePart={this.deletePart}
          updatePart={this.updatePart}
          id={id}
          key={id}
          parte={parte}
          cant={cant}
          concepto={concepto}
          pu={pu}
        />
      );
    });

    var { Status, CondPago, Clientes, Planta, Moneda } = this.state.selects;
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
                      {this.props.edit
                        ? "Editar Orden de Trabajo"
                        : "Nueva Orden de Trabajo"}
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
                    errorField["Fecha"] ? true : false
                  )}
                  {utils.renderSelect(
                    "Status",
                    Status,
                    "fields",
                    this,
                    errorField["Status"] ? true : false
                  )}

                  {utils.renderInput(
                    "fields",
                    "Pedido",
                    this,
                    errorField["Pedido"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "CotID",
                    this,
                    errorField["CotID"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Encargado",
                    this,
                    errorField["Encargado"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Concepto",
                    this,
                    errorField["Concepto"] ? true : false
                  )}
                  {utils.renderInput(
                    "fields",
                    "Entrega",
                    this,
                    errorField["Entrega"] ? true : false
                  )}
                  {utils.renderSelect(
                    "CondPago",
                    CondPago,
                    "fields",
                    this,
                    errorField["CondPago"] ? true : false
                  )}

                  {utils.renderSelect(
                    "Planta",
                    Planta,
                    "fields",
                    this,
                    errorField["Planta"] ? true : false
                  )}

                  {utils.renderSelect(
                    "Cliente",
                    Clientes,
                    "fields",
                    this,
                    errorField["Cliente"] ? true : false
                  )}
                  {/* <span>Vendedor</span>
                  <input
                    disabled
                    defaultValue={this.state.Cliente.Vendedor.Nombre}
                    className="disabled"
                    placeholder="Vendedor"
                  />
                  <span># de Provedor</span>
                  <input
                    disabled
                    className="disabled"
                    placeholder="# de Provedor"
                    defaultValue={this.state.Cliente.NumProvedor}
                  />
                  <span>Pais</span>
                  <input
                    placeholder="Pais"
                    className="disabled"
                    disabled
                    defaultValue={this.state.Cliente.Pais}
                  /> */}
                  <div>
                    <h1
                      style={{
                        fontSize: "15px",
                        marginBottom: "0px",
                        paddingTop: ".2rem"
                      }}
                    >
                      Cliente{" "}
                    </h1>
                    <input
                      defaultValue={this.state.fields.Enviar["Cliente"] || ""}
                      placeholder="Cliente"
                      className={errorField["cliente"] ? "errorInput" : "input"}
                      onChange={e =>
                        this.updateField({
                          Enviar: true,
                          name: "Cliente",
                          value: e.target.value
                        })
                      }
                    />
                  </div>
                  <div>
                    <h1
                      style={{
                        fontSize: "15px",
                        marginBottom: "0px",
                        paddingTop: ".2rem"
                      }}
                    >
                      Direccion
                    </h1>
                    <input
                      placeholder="Direccion"
                      className={
                        errorField["Direccion"] ? "errorInput" : "input"
                      }
                      defaultValue={this.state.fields.Enviar["Direccion"] || ""}
                      onChange={e =>
                        this.updateField({
                          Enviar: true,
                          name: "Direccion",
                          value: e.target.value
                        })
                      }
                    />
                  </div>
                </div>
                <div className="split-header">
                  <div>
                    <button
                      className="btn btn-primary subBtn"
                      onClick={() => this.addPart()}
                    >
                      Nueva Parte
                    </button>
                  </div>
                  <div>
                    <div className="ot-total">
                      {utils.renderInput(
                        "fields",
                        "Importe",
                        this,
                        false,
                        "currencyBorder disabled"
                      )}
                      {utils.renderSelect(
                        "Moneda",
                        Moneda,
                        "fields",
                        this,
                        errorField["Moneda"] ? true : false,
                        "currencySelect"
                      )}
                      {utils.renderInput("fields", "IVA", this, false, "IVA")}
                    </div>
                  </div>
                </div>
                <div className="split-left tableX">
                  <table className=" table">
                    <thead>
                      <tr scope="col">
                        <th scope="col">Parte</th>
                        <th scope="col">Cantidad</th>
                        <th scope="col">Concepto</th>
                        <th scope="col">Precio Unitario</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>

                    <tbody className="scroll-body">{renderParts}</tbody>
                  </table>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default OrdenTrabajo;

//components

const Part = props => {
  let { id, updatePart, deletePart } = props;
  return (
    <tr>
      <td>
        <input
          defaultValue={props.parte}
          style={{ width: "10rem" }}
          onChange={e => updatePart(id, "parte", e.target.value)}
        />
      </td>
      <td>
        <input
          defaultValue={props.cant}
          style={{ width: "3rem" }}
          onChange={e => updatePart(id, "cant", e.target.value)}
        />
      </td>
      <td>
        <textarea
          style={{ width: "20rem" }}
          multiple
          defaultValue={props.concepto}
          onChange={e => updatePart(id, "concepto", e.target.value)}
        />
      </td>
      <td>
        <input
          defaultValue={props.pu}
          style={{ width: "5rem" }}
          onChange={e => updatePart(id, "pu", e.target.value)}
        />
      </td>
      <td>
        <button className="delete-button" onClick={() => deletePart(id)}>
          X
        </button>
      </td>
    </tr>
  );
};
