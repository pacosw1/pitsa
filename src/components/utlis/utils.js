import React from "react";
let _ = require("lodash");
let axios = require("../config/axios");
export var getData = async route => {
  var result;
  try {
    result = await axios.get(route);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export var getSelectData = async route => {
  var result, data;
  try {
    result = await axios.getData(route);
    data = _.get(result, "data");
  } catch (err) {
    return false;
  } finally {
    if (data) return data;
    else return false;
  }
};

export const loadSelectData = (data, field) => {
  var result;

  result = data.map(item => {
    return (
      <option value={item._id} key={item._id + 1}>
        {item[field]}
      </option>
    );
  });

  return result;
};

export var test = (x, y) => {
  console.log(x.state[y]);
};
export var searchData = (dataObject, resultObject, field, value) => {
  var data = this.state[dataObject];
  var resultData;

  resultData = data.find(item => item[field] == value);
  this.setState({ [resultObject]: resultData });
};

export const renderInput = (
  stateObject,
  field,
  x,
  error = false,
  style = ""
) => {
  if (field == "Importe" || field == "IVA") {
    return (
      <div>
        <h1
          style={{ fontSize: "15px", marginBottom: "0px", paddingTop: ".2rem" }}
        >
          {field}
        </h1>
        <input
          className={`${style}  ${error ? "errorInput" : "input"}`}
          onChange={e => [
            updateField(stateObject, field, e.target.value, x),
            x.updateTotal(x.state[stateObject]["Parts"])
          ]}
          disabled
          placeholder={field}
          value={x.state[stateObject][field]}
        />
      </div>
    );
  } else
    return (
      <div>
        <h1
          style={{ fontSize: "15px", marginBottom: "0px", paddingTop: ".2rem" }}
        >
          {field}
        </h1>
        <input
          className={`${style}  ${error ? "errorInput" : "input"}`}
          onChange={e => [updateField(stateObject, field, e.target.value, x)]}
          placeholder={field}
          defaultValue={x.state[stateObject][field]}
        />
      </div>
    );
};

export const onSubmit = async (route, id, fields, edit) => {
  var result, data, error;

  if (edit) {
    try {
      result = await axios.editItem(route, fields, id);
    } catch (err) {
      error = err;
    }
    data = _.get(result, "data");
    if (data) return data;
    else return false;
  } else {
    try {
      result = await axios.createItem(route, fields);
    } catch (err) {
      error = err;
    }
    data = _.get(result, "data");
    if (data) return data;
    else return false;
  }
};

export const updateField = (stateObject, field, value, x) => {
  let fields = x.state[stateObject];

  fields[field] = value;
  x.setState({
    [stateObject]: fields
  });
};

export const updateSelect = (stateObject, field, value, x) => {
  let fields = x.state[stateObject];

  fields[field] = value;

  x.setState({
    [stateObject]: fields
  });
};

export const renderSelect = (
  field,
  options,
  stateObject,
  x,
  error = false,
  style = ""
) => {
  return (
    <div>
      <h1
        style={{ fontSize: "15px", marginBottom: "0px", paddingTop: ".2rem" }}
      >
        {field}
      </h1>
      <select
        className={`${style}`}
        value={x.state[stateObject][field]}
        onChange={e => updateSelect(stateObject, field, e.target.value, x)}
      >
        {options}
      </select>
    </div>
  );
};

export const getRecord = async (route, id) => {
  var result, data;
  try {
    result = await axios.getItem(route, id);
  } catch (err) {
    return false;
  }
  data = _.get(result, "data");
  if (data) return data;
  else return false;
};
