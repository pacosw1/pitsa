import React, { Component } from "react";
import "../css/Orden.css";

var axios = require("../config/axios");
var utils = require("../utlis/utils");
class Reporte extends Component {
  state = {
    orders: [],
    fieldError: {},
    fields: {}
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

    let { fieldError } = this.state;
    return (
      <div className="orden">
        <div className="">
          <div className="wrap">
            <div>
              <h3>Generar Reporte</h3>
            </div>

            {utils.renderSelect(
              "sort",
              [
                <option value="Fecha">Por Fecha</option>,
                <option value="Folio">Por Folio</option>
              ],
              "fields",
              this
            )}
          </div>
          <div className="orden-wrapper">
            {utils.renderInput(
              "fields",
              "Inicio",
              this,
              fieldError["Inicio"] ? true : false,
              "logInput"
            )}

            <br />
            {utils.renderInput(
              "fields",
              "Fin",
              this,
              fieldError["Fin"] ? true : false,
              "logInput"
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            <button className="btn btn-primary">Generar</button>
          </div>

          <div className="resultados">
            <h2 style={{ marginLeft: "3rem" }}>Resultados</h2>
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
    Moneda,
    NumCot,
    Encargado,
    TipoMaterial,
    CondPago,
    Planta,
    Cliente,
    Importe,
    IVA,
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
      <div className="header">
        <h1>Orden De Trabajo</h1>
        <h1># {Folio}</h1>
      </div>

      <div className="split">
        <div className="Enviar-info half">
          <div className="box">
            <h5>Embarcado Por</h5>
            <p className="box-p">{Enviar.Cliente}</p>
            <p>{Enviar.Direccion}</p>
          </div>
          <br className="br" />
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
            <h5>Fecha</h5>
            <p className="box-p">{utils.formatDate(Fecha)}</p>
          </div>
          <div className="box">
            <h5>Entregar Antes De: </h5>
            <p className="box-p">{utils.formatDate(Entrega)}</p>
          </div>
          <div className="box">
            <h5>Pedido No.</h5>
            <p className="box-p">{Pedido}</p>
          </div>
          <div className="box">
            <h5>Vendedor</h5>
            <p className="box-p">{Vendedor.Nombre}</p>
          </div>
          <div className="box">
            <h5>Encargado</h5>
            <p className="box-p">{Encargado}</p>
          </div>

          {/* <p className="box">Embarcado Por</p> */}
        </div>
        <div className="half">
          <div className="box">
            <h5>Condiciones</h5>
            <p className="box-p">{utils.getCond(CondPago)}</p>
          </div>

          <div className="box">
            <h5>LAB</h5>
            <p className="box-p">
              {Planta == 1 ? "Su Planta" : "Nuestra Planta"}
            </p>
          </div>
          <div className="box">
            <h5>Material</h5>
            <p className="box-p">{TipoMaterial}</p>
          </div>
          <div className="box">
            <h5># Cotizacion</h5>
            <p className="box-p">{NumCot}</p>
          </div>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <div className="box">
            <h5>Subtotal</h5>
            <p className="box-p">
              {Moneda} $
              {utils.formatMoney((Importe / (1 + IVA / 100)).toFixed(2))}
            </p>
          </div>
          <div className="box">
            <h5>IVA</h5>
            <p className="box-p">
              {Moneda}{" "}
              {utils.formatMoney(
                ((Importe / (1 + IVA / 100)) * (IVA / 100)).toFixed(2)
              )}{" "}
              ({IVA}
              %)
            </p>
          </div>
        </div>
        <div className="box">
          <h3>Total</h3>
          <h1 className="box-p">
            {Moneda} ${utils.formatMoney(Importe)}
          </h1>
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
      <td>${utils.formatMoney((props.pu * props.cant).toFixed(2))}</td>
    </tr>
  );
};
