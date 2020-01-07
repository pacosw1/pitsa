let axios = require("axios");

axios.defaults.baseURL = "http://67.207.87.121:5000/";

exports.getData = async route => {
  var result;
  try {
    result = await axios.get(route);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.getItem = async (route, id) => {
  var result;
  try {
    result = await axios.get(`${route}/${id}`);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.editItem = async (route, fields, id) => {
  var result;
  try {
    result = await axios.put(`${route}/${id}`, fields);
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.createItem = (route, fields) =>
  axios
    .post(route, fields)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });

exports.deleteItem = (route, id) =>
  axios
    .delete(`${route}/${id}`)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });
