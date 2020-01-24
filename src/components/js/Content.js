import React, { Component } from "react";
import { Route } from "react-router-dom";
import Clientes from "./Catalogo";
import Catalogo from "./Catalogo";
import {
  clientes,
  ordenes,
  vendedores,
  parametros,
  unidades,
  proovedores,
  cotizaciones,
  remisiones
} from "./Fields";
import Form from "./Form";
import OrdenTrabajo from "./OrdenTrabajo";
import Vendedor from "./Vendedores";
import Cliente from "./Clientes";
import Cotizacion from "./Cotizacion";
import Reporte from "./Reporte";
import Login from "./Login";
import Remision from "./Remisiones";
require("../css/Content.css");

class Content extends Component {
  state = {};
  render() {
    return (
      <div className="dash">
        <Route
          exact
          path="/catalogo/clientes"
          render={props => (
            <Catalogo header="Clientes" fields={clientes} {...props} />
          )}
        />
        <Route
          exact
          path="/reportes/ordenes"
          render={props => <Reporte {...props} />}
        />
        <Route
          exact
          path="/catalogo/clientes/new"
          render={props => (
            <Cliente {...props} cotActive={this.props.cotSession} />
          )}
        />
        <Route
          exact
          path="/catalogo/clientes/get/:id"
          render={props => <Cliente edit={true} {...props} />}
        />

        <Route
          exact
          path="/catalogo/vendedores"
          render={props => (
            <Catalogo header="Vendedores" fields={vendedores} {...props} />
          )}
        />

        <Route
          exact
          path="/catalogo/ordenes"
          render={props => (
            <Catalogo header="Ordenes" fields={ordenes} {...props} />
          )}
        />

        <Route
          exact
          path="/catalogo/ordenes/new"
          render={props => <OrdenTrabajo {...props} />}
        />
        <Route
          exact
          path="/catalogo/ordenes/get/:id"
          render={props => <OrdenTrabajo edit={true} {...props} />}
        />

        <Route
          exact
          path="/catalogo/remisiones"
          render={props => (
            <Catalogo header="Remisiones" fields={remisiones} {...props} />
          )}
        />
        <Route
          exact
          path="/catalogo/remisiones/new"
          render={props => <Remision {...props} />}
        />
        <Route
          exact
          path="/catalogo/remisiones/get/:id"
          render={props => <Remision edit={true} {...props} />}
        />

        <Route
          exact
          path="/catalogo/cotizaciones"
          render={props => (
            <Catalogo header="Cotizaciones" fields={cotizaciones} {...props} />
          )}
        />
        <Route
          exact
          path="/catalogo/cotizaciones/new"
          render={props => (
            <Cotizacion
              {...props}
              saveFields={this.props.saveFields}
              toggleCot={this.props.toggleCot}
              cotSession={this.props.cotSession}
              getCotSession={this.props.getCotSession}
            />
          )}
        />
        <Route
          path="/catalogo/cotizaciones/get/:id"
          render={props => (
            <Cotizacion
              edit={true}
              saveFields={this.props.saveFields}
              {...props}
            />
          )}
        />

        <Route
          exact
          path="/catalogo/vendedores/new"
          render={props => <Vendedor {...props} />}
        />
        <Route
          path="/catalogo/vendedores/get/:id"
          render={props => <Vendedor edit={true} {...props} />}
        />

        <Route
          exact
          path="/catalogo/proovedores"
          render={props => (
            <Catalogo header="Proovedores" fields={proovedores} {...props} />
          )}
        />
        <Route
          exact
          path="/catalogo/proovedores/new"
          render={props => (
            <Form
              header="Proovedores"
              fields={proovedores}
              onChange={console.log("onchange")}
              onSumbit={console.log("onsubmit")}
              {...props}
            />
          )}
        />
        <Route
          path="/catalogo/proovedores/get/:id"
          render={props => (
            <Form
              header="Proovedores"
              fields={proovedores}
              edit={true}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/catalogo/parametros"
          render={props => (
            <Catalogo header="Parametros" fields={parametros} {...props} />
          )}
        />
        <Route
          exact
          path="/catalogo/parametros/new"
          render={props => (
            <Form
              header="Parametros"
              fields={parametros}
              onChange={console.log("onchange")}
              onSumbit={console.log("onsubmit")}
              {...props}
            />
          )}
        />
        <Route
          path="/catalogo/parametros/get/:id"
          render={props => (
            <Form
              header="Parametros"
              fields={parametros}
              edit={true}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/catalogo/unidades"
          render={props => (
            <Catalogo header="Unidades" fields={unidades} {...props} />
          )}
        />
        <Route
          exact
          path="/catalogo/unidades/new"
          render={props => (
            <Form
              header="Unidades"
              fields={unidades}
              onChange={console.log("onchange")}
              onSumbit={console.log("onsubmit")}
              {...props}
            />
          )}
        />
        <Route
          path="/catalogo/unidades/get/:id"
          render={props => (
            <Form header="Unidades" fields={unidades} edit={true} {...props} />
          )}
        />
        <Route path="/login" exact render={props => <Login {...props} />} />
      </div>
    );
  }
}

export default Content;
