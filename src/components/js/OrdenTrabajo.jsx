import React, { Component } from "react";
import "../css/OT.css";
import ErrorPage from "./Error";
let axios = require("../config/axios");
let utils = require("../utlis/utils");
let _ = require("lodash");

class OrdenTrabajo extends Component {
  state = {
    Cliente: {
      Vendedor: {},
      Pais: "",
      NumProv: ""
    },
    error: false,
    Data: {
      Clientes: []
    },
    fields: {
      Enviar: { Direccion: "", Cliente: "" },
      Parts: [],
      Status: 0,
      Fecha: new Date().toLocaleDateString(),
      Cliente: { Vendedor: "name" }
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

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  updateTotal = parts => {
    let { fields } = this.state;

    var copy = fields;

    var sum = 0.0;
    parts.forEach(({ cant, pu }) => {
      sum += cant * pu;
    });

    sum = sum * (1 + fields.IVA / 100);
    sum = sum.toFixed(2);
    copy.Importe = sum;
    sum = this.numberWithCommas(sum);
    copy.ImporteDisplay = sum;
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
    } else this.setState({ error: true });

    //////////// load static data selects
    selects["CondPago"] = utils.loadSelectData(
      this.state.options.CondPago,
      "value"
    );

    selects["Moneda"] = utils.loadSelectData(this.state.options.Moneda);
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
        this.setState({ fields: result, Cliente: currClient });
      } else this.setState({ error: true });
    }
    ///////

    this.setState({ selects, Data });
  }

  //fucntions

  onSubmit = async () => {
    let { fields, parts } = this.state;
    let { match, edit } = this.props;
    let id = match.params.id;
    var result;

    fields.Cliente = this.state.Data.Clientes.find(
      client => client._id == fields.Cliente
    );
    if (edit) result = await utils.onSubmit("ordenes", id, fields, true);
    else result = await utils.onSubmit("ordenes", fields, id, false);

    if (!result) this.setState({ error: true });
    else await (window.location = "/catalogo/" + "ordenes");
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
    return (
      <div className="OT">
        {this.state.error ? (
          <ErrorPage />
        ) : (
          <React.Fragment>
            <div className="split-left">
              <div className="datos">
                <h4>Datos</h4>

                {utils.renderInput("fields", "Fecha", this)}

                {utils.renderSelect("Status", Status, "fields", this)}

                {utils.renderInput("fields", "Folio", this)}
                {utils.renderInput("fields", "Pedido", this)}
                {utils.renderInput("fields", "NumCot", this)}
                {utils.renderInput("fields", "Encargado", this)}
                {utils.renderInput("fields", "TipoMaterial", this)}
                {utils.renderInput("fields", "Entrega", this)}
                {utils.renderSelect("CondPago", CondPago, "fields", this)}
                {utils.renderSelect("Planta", Planta, "fields", this)}

                <br />
                <h4>Vendido</h4>
                <h5>Cliente</h5>

                {utils.renderSelect("Cliente", Clientes, "fields", this, [
                  this.findSelected
                ])}
                <br />
                {/* <span>Vendedor</span> */}

                {/* <input
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
              </div>
            </div>
            <div className="split">
              <div className="enviar">
                <h4>Enviar</h4>

                <input
                  defaultValue={this.state.fields.Enviar["Cliente"] || ""}
                  placeholder="Cliente"
                  onChange={e =>
                    this.updateField({ name: "cliente", value: e.target.value })
                  }
                />
                <input
                  placeholder="Direccion"
                  defaultValue={this.state.fields.Enviar["Direccion"] || ""}
                  onChange={e =>
                    this.updateField({
                      name: "Direccion",
                      value: e.target.value
                    })
                  }
                />
                <br />
                <button
                  style={{ width: "10rem" }}
                  onClick={() => this.addPart()}
                >
                  Nueva Parte
                </button>

                <table className="table scroll">
                  <thead>
                    <tr style={{ alignItems: "baseline" }}>
                      <th>Parte</th>
                      <th>Cantidad</th>
                      <th>Concepto</th>
                      <th>Precio Unitario</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>{renderParts}</tbody>
                </table>
                <div>
                  <input
                    placeholder="Importe"
                    disabled
                    defaultValue={this.state.fields.Importe}
                    className="currencyBorder disabled"
                  />
                  {utils.renderSelect("Moneda", Moneda, "fields", this)}

                  <span> + IVA </span>
                  <input
                    placeholder="ex. 16"
                    defaultValue={this.state.fields.IVA}
                    onChange={e => [
                      utils.updateSelect("fields", "IVA", e.target.value, this),
                      this.updateTotal(this.state.fields.Parts)
                    ]}
                  />
                  <span> %</span>
                </div>
              </div>
              <button
                onClick={() => this.onSubmit()}
                style={{ width: "35rem" }}
              >
                Guardar
              </button>
            </div>
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
