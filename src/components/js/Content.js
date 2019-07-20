import React, { Component } from "react";
import { Route } from "react-router-dom";
import Clientes from "./Catalogo";
import { Catalogo } from "./Catalogo";
import {
  clientes,
  vendedores,
  parametros,
  unidades,
  proovedores
} from "./Fields";
import Form from "./Form";
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
          path="/catalogo/clientes/new"
          render={props => (
            <Form
              header="Nuevo Cliente"
              fields={clientes}
              onChange={console.log("onchange")}
              onSumbit={console.log("onsubmit")}
              {...props}
            />
          )}
        />
        <Route
          exact
          path="/catalogo/clientes/get/:id"
          render={props => (
            <Form
              header="Editar Cliente"
              fields={clientes}
              edit={true}
              {...props}
            />
          )}
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
          path="/catalogo/vendedores/new"
          render={props => (
            <Form
              header="Nuevo Vendedor"
              fields={vendedores}
              onChange={console.log("onchange")}
              onSumbit={console.log("onsubmit")}
              {...props}
            />
          )}
        />
        <Route
          path="/catalogo/vendedores/get/:id"
          render={props => (
            <Form
              header="Editar Vendedor"
              fields={vendedores}
              edit={true}
              {...props}
            />
          )}
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
              header="Nuevo Proovedor"
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
              header="Editar Proovedor"
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
              header="Nuevo Parametro"
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
              header="Editar Parametro"
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
              header="Nueva Unidad"
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
            <Form
              header="Editar Unidad"
              fields={unidades}
              edit={true}
              {...props}
            />
          )}
        />
      </div>
    );
  }
}

export default Content;
