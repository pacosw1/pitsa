let axios = require("axios");

axios.defaults.baseURL = "http://localhost:5000/";
///67.207.87.121
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

exports.createItem = async (route, fields) => {
  var result;
  try {
    result = await axios.post(route, fields);
    return result;
  } catch (err) {
    console.log(err);
  }
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
