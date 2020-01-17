import React, { Component } from "react";
import "../css/Form.css";
import { LoadingScreen } from "./LoadingScreen";
import ErrorPage from "./Error";
let axios = require("../config/axios");
let fieldData = require("./Fields");
let _ = require("lodash");

class Form extends Component {
  state = {
    fields: {
      Fecha: new Date().toLocaleDateString(),
      Status: 0
    },
    selectData: {
      status: fieldData.status
    },
    loaded: false,
    error: false
  };

  async componentWillMount() {
    let { selectData, fields } = this.state;
    let { match, edit, header } = this.props;
    var result;

    try {
      //find select to be filled by data
      let selects = fieldData[header.toLowerCase()].filter(
        x => x.type == "select"
      );
      //fill all selects with their respective data from server
      selects.forEach(async ({ route, name, placeholder, isStatic }) => {
        console.log(route);
        if (!isStatic) {
          var result = await axios.getData(route);
          var data = _.get(result, "data");
          if (data) {
            if (data.Vendedor && !edit) fields.Vendedor = data.Vendedor._id;
            selectData[route] = _.get(result, "data");
            fields[name] = data._id;
          }

          this.setState({ selectData, fields });
        }
      });
    } catch (err) {
      //catch error and save message to state
      console.log("error");
      console.log(err);
      this.setState({ error: true, errorData: err.message });
    }
    var data;
    //if form is has existing info
    if (edit) {
      let id = match.params.id;
      try {
        result = await axios.getItem(header.toLowerCase(), id); //get the info
      } catch (err) {
        console.log(err);
      }
      var seller;
      data = _.get(result, "data"); //selects can only have ids;
      console.log("data");
      console.log(data);
      if (data) if (data.Vendedor) seller = data.Vendedor._id;

      console.log(seller);
      if (seller) data.Vendedor = seller;
    } else data = true;

    if (data) {
      this.setState({ fields: data, loaded: true }); //set the info into fields in state
    } else {
      console.log(data);
      this.setState({ error: true });
    }
  }

  async onSubmit() {
    let { fields } = this.state;
    let header = this.props.header.toLowerCase();
    let id = this.props.match.params.id;

    try {
      //try to perfor save / edit request
      //handle save request for different tables
      if (header == "clientes") {
        //find seller specified in select
        var seller = this.state.selectData["vendedores"].find(
          seller => seller._id == this.state.fields.Vendedor
        );
        //set its object value in its field in state;
        fields["Vendedor"] = seller;
      } else if (header == "cotizaciones") {
        //async call
        let client = await axios.getItem("clientes", this.state.fields.Cliente);
        //update with asyc result;

        var data = _.get(client, "data");
        if (data) fields["Cliente"] = client.data;
      }
      //case where an existing record needs updating
      if (this.props.edit) await axios.editItem(header, fields, id);
      //edit item
      else await axios.createItem(header, fields); //or create it

      //if nothing fails, redirect to  current catalog;
      await (window.location = "/catalogo/" + header);
    } catch (err) {
      //if erro save it for display inside state;
      this.setState({ error: true, errorData: err });
    }
  }

  updateField = field => {
    let { fields } = this.state;

    let { name, value } = field;
    fields[name] = value;
    this.setState({
      fields: fields
    });
  };

  updateSelect = ({ value, name }) => {
    let { selectData, fields } = this.state;

    fields[name] = value;

    this.setState({
      selectData,
      fields
    });
  };

  render() {
    let { fields, onChange, header } = this.props;

    let inputs = fields.filter(field => field.type == "input");

    let selects = fieldData[header.toLowerCase()].filter(
      x => x.type == "select"
    );
    console.log(selects);

    let renderInputs = selects.map(({ name, placeholder, route }) => {
      var optField = {
        clientes: "Empresa",
        vendedores: "Nombre",
        status: "status"
      };
      var options = this.state.selectData[route];
      console.log(options);
      if (options) {
        let renderOptions = options.map(option => {
          if (route == "status") {
            return (
              <option
                key={option.value}
                placeholder={option.placeholder}
                name={route}
                value={option.value}
              >
                {option.placeholder}
              </option>
            );
          } else if (route == "clientes") {
            return (
              <option
                key={option[optField[route]]}
                placeholder={option[optField[route]]}
                name={route}
                value={option._id}
              >
                {option[optField[route]]}
              </option>
            );
          } else if (route == "vendedores") {
            return (
              <option
                key={option[optField[route]]}
                placeholder={option[optField[route]]}
                name={option[optField[route]]}
                value={option._id}
                seller={option[optField[route]]}
              >
                {option[optField[route]]}
              </option>
            );
          } else {
            return (
              <option
                key={option[optField[route]]}
                placeholder={option[optField[route]]}
                name={option[optField[route]]}
                value={option._id}
              >
                {option[optField[route]]}
              </option>
            );
          }
        });

        console.log(name);

        return (
          <div className="input-div" key={name}>
            <span>{placeholder}</span>
            <select
              defaultValue={this.state.fields[name]}
              onChange={e =>
                this.updateSelect({ value: e.target.value, name: name })
              }
            >
              {renderOptions}
            </select>
          </div>
        );
      }
    });
    let form = inputs.map(({ name, placeholder }) => {
      return (
        <div className="input-div" key={name}>
          <span>{placeholder}</span>
          <input
            name={name}
            defaultValue={this.state.fields[name] || ""}
            placeholder={placeholder}
            onChange={e => this.updateField(e.target)}
          />
        </div>
      );
    });
    return (
      <div id="form">
        {this.state.error ? (
          <ErrorPage />
        ) : (
          <React.Fragment>
            <h4 style={{ margin: "0rem 1rem" }}>{header}</h4>
            {!this.state.loaded ? (
              <LoadingScreen />
            ) : (
              <React.Fragment>
                <div id="fields">
                  {" "}
                  {form}
                  {renderInputs}
                </div>
                <div id="fields"> </div>
              </React.Fragment>
            )}
            <button onClick={() => this.onSubmit()}>Guardar</button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default Form;
