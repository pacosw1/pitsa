let axios = require("axios");
let _ = require("lodash");
let jwtDecode = require("jwt-decode");
axios.defaults.baseURL = "http://67.207.87.121/";
axios.defaults.headers.common["token"] = localStorage.token;

///67.207.87.121
exports.getData = async route => {
  var result;
  try {
    result = await axios.get(route);
    return result;
  } catch (err) {}
};

exports.login = async account => {
  var res, data;
  try {
    res = await axios.post("auth", {
      account
    });

    data = _.get(res, "data");

    if (data) return data;
    else return false;
  } catch (err) {
    console.log(err);
    return false;
  }
};

exports.getUser = () => {
  if (localStorage.token) {
    return jwtDecode(localStorage.token);
  } else return false;
};

exports.getItem = async (route, id) => {
  var result;
  try {
    result = await axios.get(`${route}/${id}`);
    return result;
  } catch (err) {}
};

exports.editItem = async (route, fields, id) => {
  var result;
  try {
    result = await axios.put(`${route}/${id}`, fields);
    return result;
  } catch (err) {}
};

exports.createItem = async (route, fields) => {
  var result;
  try {
    result = await axios.post(route, fields);
    return result;
  } catch (err) {}
};

exports.deleteItem = (route, id) =>
  axios
    .delete(`${route}/${id}`)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });
