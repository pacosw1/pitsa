import React, { Component } from "react";
import "../css/Form.css";
let axios = require("../config/axios");

class Form extends Component {
  state = {
    fields: {}
  };

  async componentDidMount() {
    let { match, edit, header } = this.props;
    if (edit) {
      let id = match.params.id;
      let result = await axios.getItem(header.toLowerCase(), id);
      this.setState({ fields: result });
    }
  }

  updateField = field => {
    let { fields } = this.state;
    console.log(field.name);
    let { name, value } = field;
    fields[name] = value;
    this.setState({
      fields: fields
    });
  };
  render() {
    let { fields, onChange, onSubmit, header } = this.props;

    let form = fields.map(field => {
      return (
        <input
          name={field}
          defaultValue={this.state.fields[field] || ""}
          placeholder={field}
          onChange={e => this.updateField(e.target)}
        />
      );
    });
    return (
      <div id="form">
        <h4 style={{ margin: "0rem 1rem" }}>{header}</h4>
        <div id="fields"> {form}</div>
        <button onClick={onSubmit}>Guardar</button>
      </div>
    );
  }
}

export default Form;
