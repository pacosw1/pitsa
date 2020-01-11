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

export const renderInput = (stateObject, field, x, functions = []) => {
  if (functions.length >= 1) {
    functions.forEach(f => f(x.state.fields.field));
  }
  return (
    <input
      className="input"
      onChange={e => updateField(stateObject, field, e.target.value, x)}
      placeholder={field}
      defaultValue={x.state[stateObject][field]}
    />
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

export const renderSelect = (field, options, stateObject, x) => {
  return (
    <select
      className="select"
      value={x.state[stateObject][field]}
      onChange={e => updateSelect(stateObject, field, e.target.value, x)}
    >
      {options}
    </select>
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