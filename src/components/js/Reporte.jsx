import React, { Component } from "react";
import "../css/Orden.css";

var axios = require("../config/axios");
var utils = require("../utlis/utils");
class Reporte extends Component {
  state = {
    orders: []
  };

  async componentWillMount() {
    //request API select data
    try {
      var orders = await utils.getData("ordenes");
      console.log(orders);
      this.setState({ orders: orders.data });
    } catch (err) {
      this.setState({ error: err.message });
    }
    //load API select data
  }
  render() {
    let { orders } = this.state;
    let renderOrders = orders.map(order => {
      return <Orden Parts={order.Parts} order={order} />;
    });
    return (
      <div>
        <div className="orden">
          <div className="x">
            <h3>Generar Reporte</h3>
            <select>
              <option>Por Fecha</option>
              <option>Por Folio</option>
            </select>
            <div>
              <span>De</span>
              <input></input>
              <span>A</span>
              <input></input>
              <button className="btn btn-primary">Generar</button>
            </div>

            <h2>Resultados: </h2>
            {renderOrders}
          </div>
        </div>
      </div>
    );
  }
}

const Orden = props => {
  let { Parts } = props;
  let {
    Folio,
    Fecha,
    Entrega,
    NumProvedor,
    Pedido,
    NumCot,
    Encargado,
    TipoMaterial,
    CondPago,
    Planta,
    Cliente,
    Enviar
  } = props.order;

  let {
    Calle,
    Colonia,
    CP,
    Estado,
    Pais,
    Telefono,
    Vendedor,
    Empresa
  } = Cliente;

  let renderParts = Parts.map(part => {
    console.log(part);
    let { parte, cant, concepto, pu, id } = part;
    return (
      <Part
        id={id}
        key={id}
        parte={parte}
        cant={cant}
        concepto={concepto}
        pu={pu}
      />
    );
  });
  return (
    <div className="order">
      <h1>Orden De Trabajo</h1>
      <div className="split">
        <div className="Enviar-info half">
          <div className="box">
            <h5>Embarcado Por</h5>
            <p className="box-p">{Enviar.Cliente}</p>
            <p>{Enviar.Direccion}</p>
          </div>
          <div className="box">
            <h5>Vendido A</h5>
            <p>{Empresa}</p> <p className="box-p">{Calle}</p>
            <p>
              {Colonia}, {CP}
            </p>
            <p>
              {Estado}, {Pais}
            </p>
          </div>
        </div>
        <div className="Datos-info half">
          <div className="box">
            <h5>Numero de Trabajo</h5>
            <p className="box-p">{Folio}</p>
          </div>

          <div className="box">
            <h5>Fecha</h5>
            <p className="box-p">{Fecha}</p>
          </div>
          <div className="box">
            <h5>Pedido No.</h5>
            <p className="box-p">{Pedido}</p>
          </div>
          <div className="box">
            <h5>Condiciones</h5>
            <p className="box-p">{CondPago}</p>
          </div>
          <div className="box">
            <h5>Vendedor</h5>
            <p className="box-p">{Vendedor.Nombre}</p>
          </div>

          {/* <p className="box">Embarcado Por</p> */}
        </div>
      </div>
      <div className="partes">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Descripcion</th>
              <th>Precio Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{renderParts}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Reporte;

const Part = props => {
  return (
    <tr>
      <td width="20%">{props.parte}</td>
      <td style={{ maxWidth: "20px" }}>{props.cant}</td>
      <td style={{ maxWidth: "500px" }}>{props.concepto}</td>
      <td>{props.pu}</td>
      <td>{props.pu * props.cant}</td>
    </tr>
  );
};
