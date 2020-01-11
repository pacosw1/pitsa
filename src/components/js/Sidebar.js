import React, { Component } from "react";
import "../css/Sidebar.css";
import { NavLink } from "react-router-dom";

class Sidebar extends Component {
  state = {
    tabs: [
      {
        id: 0,
        title: "Catalogos",
        items: [
          // "Proovedores",
          "Clientes",
          "Cotizaciones",
          "Vendedores",
          "Ordenes"
          // "Parametros",
          // "Unidades"
        ],
        open: true
      },
      // {
      //   id: 1,
      //   title: "Procesos",
      //   items: ["Test"],
      //   open: false
      // },
      // {
      //   id: 2,
      //   title: "Admin",
      //   items: ["Ordenes de Compra", "Remisiones"],
      //   open: false
      // },
      {
        id: 3,
        title: "Reportes",
        items: ["Por Vendedor", "Por Cliente", "Por Producto"],
        open: false
      }
    ]
  };

  onToggle = id => {
    let { tabs } = this.state;
    let x = tabs.find(item => item.id == id);
    x.open = !x.open;
    this.setState({ tabs: tabs });
  };
  render() {
    let { tabs } = this.state;

    let list = tabs.map(tab => {
      let { title, items, open, id } = tab;
      return (
        <Tab
          key={id}
          id={id}
          title={title}
          items={items}
          open={open}
          onToggle={this.onToggle}
        />
      );
    });

    return (
      <div className="sidebar">
        <div id="top">
          <h3>PITSA</h3>
          {list}
        </div>
        <div id="bottom">{/* <Tab title="Cerrar Session" /> */}</div>
      </div>
    );
  }
}

const Tab = props => {
  let { id, onToggle } = props;
  let list = props.items.map(item => {
    return <TabItem key={item} title={item} />;
  });
  return (
    <div id="tab">
      <h4 id="tab-text" onClick={() => onToggle(id)}>
        {props.title}
      </h4>
      {props.open ? list : null}
    </div>
  );
};

const TabItem = props => {
  return (
    <div style={{ margin: "0rem .5rem", color: "grey" }}>
      <NavLink
        className="no-link"
        to={`/catalogo/${props.title.toLowerCase()}`}
      >
        <h4 id="tab-item">{props.title}</h4>
      </NavLink>
    </div>
  );
};

export default Sidebar;
