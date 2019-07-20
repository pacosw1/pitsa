let axios = require("axios");

axios.defaults.baseURL = "http://localhost:5000/";

exports.getData = route =>
  axios
    .get(route)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });

exports.getItem = (route, id) =>
  axios
    .get(`${route}/${id}`)
    .then(result => {
      return result.data;
    })
    .catch(err => {
      return err;
    });
