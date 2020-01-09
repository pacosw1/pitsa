import React, { Component } from "react";
import "../css/OT.css";
let axios = require("../config/axios");

class OrdenTrabajo extends Component {
  state = {
    error: false,
    parts: [],
    fields: {
      IVA: 16,
      Enviar: { Direccion: "", Cliente: "" },

      Status: 0,
      Fecha: new Date().toLocaleDateString(),
      Cliente: { Vendedor: "name" }
    },
    clientes: [],
    options: [
      "100% P/F",
      "7 dias",
      "10 dias",
      "14 dias",
      "15 dias",
      "30 dias",
      "45 dias",
      "60 dias",
      "90 dias"
    ]
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

  async componentWillMount() {
    let { fields, parts } = this.state;
    let { match, edit, header } = this.props;

    var result;
    var copy = fields;

    try {
      result = await axios.getData("clientes");

      if (result.status == 200) {
        copy["Cliente"] = result.data[0];
        copy.Enviar = { Direccion: "", Cliente: "" };
        this.setState({ clientes: result.data, fields: copy });
      } else console.log(result.status);
    } catch (err) {
      console.log(err);
    }

    copy = parts;
    parts.push({
      id: new Date().getMilliseconds(),
      parte: "",
      cant: 0,
      concepto: "",
      pu: 0
    });

    if (edit) {
      let id = match.params.id;
      result = (await axios.getItem("ordenes", id)) || [];

      if (result.status !== 200) this.setState({ error: true });
      else {
        this.setState({
          fields: result.data,
          loaded: true,
          parts: result.data.Parts
        });
      }
    } else {
      this.setState({ loaded: true, error: false, parts: copy });
    }
  }

  //fucntions

  onSubmit = async () => {
    let { fields, parts } = this.state;

    if (!this.props.edit) {
      fields.Enviar = {
        Cliente: fields.cliente,
        Direccion: fields.Direccion
      };
    }
    fields.Parts = parts;

    if (this.props.edit) {
      let id = this.props.match.params.id;

      console.log("fields");
      console.log(fields);
      await axios.editItem("ordenes", fields, id);
    } else {
      try {
        var result = axios.createItem("ordenes", fields);

        if (result.status == 200) {
          alert("success");
        }
      } catch (err) {
        alert(err.message);
      }
    }
  };

  deletePart = id => {
    let { parts } = this.state;
    let copy = parts;

    copy = copy.filter(part => part.id != id);
    this.updateTotal(copy);

    this.setState({ parts: copy });
  };

  updatePart = (id, name, value) => {
    let { parts } = this.state;
    let copy = parts;

    let part = copy.find(part => part.id == id);
    part[name] = value;
    this.updateTotal(copy);
    this.setState({ parts: copy });
  };
  addPart = () => {
    let { parts, partCount } = this.state;
    let copy = parts;
    copy.push({
      id: new Date().getMilliseconds(),
      parte: "",
      cant: 0,
      concepto: "",
      pu: 0
    });
    partCount += 1;
    this.setState({ parts: copy, partCount });
  };

  updateField = field => {
    let { fields, parts } = this.state;

    let { name, value } = field;

    fields[name] = value;
    this.updateTotal(parts);

    this.setState({
      fields: fields
    });
  };

  updateSelect = ({ value, name }) => {
    let { fields, clientes } = this.state;
    var res;
    if (name == "cliente") {
      res = clientes.find(x => x._id == value);
      fields[name] = res;
    } else fields[name] = value;

    this.setState({
      fields
    });
  };

  render() {
    //options for cond de pago.

    let { parts } = this.state;
    let renderParts = parts.map(part => {
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
    var options = this.state.options.map(opt => {
      return (
        <option key={opt} value={opt}>
          {opt}
        </option>
      );
    });

    //options for seller
    var clients = this.state.clientes.map(client => {
      console.log(client);
      return (
        <option key={client._id} value={client._id}>
          {client.Empresa}
        </option>
      );
    });
    return (
      <div className="OT">
        <div className="split-left">
          <div className="datos">
            <h4>Datos</h4>
            <input
              placeholder="Fecha"
              value={this.state.fields.Fecha}
              onChange={e =>
                this.updateField({ name: "Fecha", value: e.target.value })
              }
            />
            <select
              defaultValue={this.state.fields["Status"] || ""}
              onChange={e =>
                this.updateSelect({ value: e.target.value, name: "Status" })
              }
            >
              <option>Estatus</option>
              <option value={0}>Vigente</option>
              <option value={1}>Terminada</option>
              <option value={2}>Cancelada</option>
            </select>
            <input
              placeholder="Folio"
              defaultValue={this.state.fields["Folio"] || ""}
              onChange={e =>
                this.updateField({ name: "Folio", value: e.target.value })
              }
            />
            <input
              placeholder="Pedido"
              defaultValue={this.state.fields["Pedido"] || ""}
              onChange={e =>
                this.updateField({ name: "Pedido", value: e.target.value })
              }
            />
            <input
              placeholder="# de Cotizacion"
              defaultValue={this.state.fields["NumCot"] || ""}
              onChange={e =>
                this.updateField({ name: "NumCot", value: e.target.value })
              }
            />
            <select
              defaultValue={this.state.fields["CondPago"] || ""}
              onChange={e =>
                this.updateSelect({ value: e.target.value, name: "CondPago" })
              }
            >
              <option>Condicion de pago</option>
              {options}
            </select>
            <input
              placeholder="Encargado"
              defaultValue={this.state.fields["Encargado"] || ""}
              onChange={e =>
                this.updateField({ name: "Encargado", value: e.target.value })
              }
            />
            <input
              defaultValue={this.state.fields["TipoMaterial"] || ""}
              placeholder="Tipo Material"
              onChange={e =>
                this.updateField({
                  name: "TipoMaterial",
                  value: e.target.value
                })
              }
            />
            <input
              defaultValue={this.state.fields["Entrega"] || ""}
              placeholder="Entregar Antes De"
              onChange={e =>
                this.updateField({ name: "Entrega", value: e.target.value })
              }
            />
            <select
              defaultValue={this.state.fields["Planta"] || ""}
              onChange={e =>
                this.updateSelect({ value: e.target.value, name: "Planta" })
              }
            >
              <option>Entregar En</option>
              <option>Su Planta</option>
              <option>Nuestra Planta</option>
            </select>
            <br />
            <h4>Vendido</h4>
            <h5>Cliente</h5>
            <select
              defaultValue={this.state.fields["Cliente"]._id || ""}
              value={this.state.fields.Cliente}
              onChange={e => {
                this.updateSelect({ value: e.target.value, name: "Cliente" });
              }}
            >
              {clients}
            </select>
            <br />
            <span>Vendedor</span>

            <input
              disabled
              defaultValue={"" || this.state.fields.Cliente.Vendedor.name}
              className="disabled"
              placeholder="Vendedor"
            />
            <span># de Provedor</span>

            <input
              disabled
              className="disabled"
              placeholder="# de Provedor"
              defaultValue={"" || this.state.fields.Cliente.NumProvedor}
            />
            <span>Pais</span>

            <input
              placeholder="Pais"
              className="disabled"
              disabled
              defaultValue={"" || this.state.fields.Cliente.Pais}
            />
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
                this.updateField({ name: "Direccion", value: e.target.value })
              }
            />
            <br />
            <button style={{ width: "10rem" }} onClick={() => this.addPart()}>
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
              <select
                className="currencySelect"
                onChange={e =>
                  this.updateSelect({ value: e.target.value, name: "Moneda" })
                }
              >
                <option>MXN</option>
                <option>USD</option>
              </select>
              <span> + IVA </span>
              <input
                style={{ width: "4rem" }}
                placeholder="ex: 16"
                defaultValue={this.state.fields["IVA"]}
                onChange={e =>
                  this.updateField({ name: "IVA", value: e.target.value })
                }
              />
              <span> %</span>
            </div>
          </div>
          <button onClick={() => this.onSubmit()} style={{ width: "35rem" }}>
            Guardar
          </button>
        </div>
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
