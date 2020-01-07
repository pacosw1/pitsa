import React, { Component } from "react";
import "../css/Form.css";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
let fieldData = require("./Fields");
let _ = require("lodash");

class Form extends Component {
  state = {
    fields: {
      Fecha: new Date().toLocaleDateString(),
      status: 0
    },
    selectData: {
      // vendedor: { curr: "paco", data: ["paco", "juan"] },
      status: fieldData.status
    },
    loaded: false,
    error: false
  };

  async componentWillMount() {
    let { selectData, fields } = this.state;

    var result;
    let { match, edit, header } = this.props;

    let selects = fieldData[header.toLowerCase()].filter(
      x => x.type == "select"
    );

    selects.forEach(async ({ route, name, placeholder, isStatic }) => {
      console.log(route);
      if (!isStatic) {
        try {
          var result = await axios.getData(route);
          if (result.status == 200) {
            selectData[route] = result.data;
            fields[name] = result.data[0];
            this.setState({ selectData });
          }
        } catch (err) {
          console.log(err);
        }
      }
    });

    if (edit) {
      let id = match.params.id;
      result = (await axios.getItem(header.toLowerCase(), id)) || [];

      if (result.status !== 200) this.setState({ error: true });
      else {
        this.setState({ fields: result.data, loaded: true });
      }
    } else {
      this.setState({ loaded: true, error: false });
    }
  }

  async onSubmit() {
    let { fields } = this.state;
    let header = this.props.header.toLowerCase();

    if (this.props.edit) {
      let id = this.props.match.params.id;

      console.log("fields");
      console.log(fields);
      await axios.editItem(header, fields, id);
    } else {
      await axios.createItem(header, fields);
    }
    return (window.location = "/catalogo/" + header);
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
                value={option}
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
                value={option[optField[route]]}
              >
                {option[optField[route]]}
              </option>
            );
          }
        });

        return (
          <div className="input-div" key={name}>
            <span>{placeholder}</span>
            <select
              value={this.state.selectData[route].curr}
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
      </div>
    );
  }
}

export default Form;
