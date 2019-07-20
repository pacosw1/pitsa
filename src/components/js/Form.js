import React, { Component } from "react";
import "../css/Form.css";

class Form extends Component {
  state = {
    fields: {}
  };

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
