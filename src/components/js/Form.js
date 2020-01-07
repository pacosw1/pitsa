import React, { Component } from "react";
import "../css/Form.css";
import { LoadingScreen } from "./loadingScreen";
let axios = require("../config/axios");
let fieldData = require("./Fields");
let _ = require("lodash");

class Form extends Component {
  state = {
    fields: {},
    selectData: {
      vendedor: { curr: "paco", data: ["paco", "juan"] },
      status: { curr: 0, data: [0, 1] }
    },
    loaded: false,
    error: false
  };

  async componentWillMount() {
    let { selectData } = this.state;

    var result;
    let { match, edit, header } = this.props;
    if (edit) {
      let id = match.params.id;
      result = (await axios.getItem(header.toLowerCase(), id)) || [];

      if (result.status !== 200) this.setState({ error: true });
      else {
        this.setState({ fields: result.data, loaded: true });
        console.log(fieldData);
        let selects = fieldData[header.toLowerCase()].filter(
          field => field.type == "select"
        );
        console.log(selects);

        selects.forEach(async ({ name, route }) => {
          let data = await axios.getData(route);
          selectData[name] = data.data;
          this.setState({ selectData });
        });
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
      fields = _.pick(fields, [...this.props.fields]);
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
    console.log(name);
    let { selectData } = this.state;
    selectData[name.toLowerCase()].curr = value;
    this.setState({
      selectData
    });
  };

  render() {
    let { fields, onChange, header } = this.props;

    let inputs = fields.filter(field => field.type == "input");
    let selects = fieldData[header.toLowerCase()].filter(
      x => x.type == "select"
    );
    console.log(selects);

    let renderInputs = selects.map(({ name, placeholder }) => {
      var options = this.state.selectData[name.toLowerCase()];
      console.log(options);
      let renderOptions = options.data.map(opt => {
        return (
          <option key={opt} placeholder={opt} name={"paco"} value={opt}>
            {opt}
          </option>
        );
      });

      return (
        <div className="input-div" key={name}>
          <span>{placeholder}</span>
          <select
            value={this.state.selectData[name.toLowerCase()].curr}
            onChange={e =>
              this.updateSelect({ value: e.target.value, name: name })
            }
          >
            {renderOptions}
          </select>
        </div>
      );
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
