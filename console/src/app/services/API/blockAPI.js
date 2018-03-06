import axios from 'axios';

const url = 'http://129.146.106.151:8080/';

export async function getRxData(id) {
  var nurl = url + "rx/" + id;

  return axios
    .get(nurl)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return "Something went wrong.";
    });
}

export async function getAllRxData() {
  var nurl = url + "rx/";
  return axios
    .get(nurl)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return "Something went wrong.";
    });
}

export async function getStatus() {
  var nurl = url + "bcs/";
  return axios
    .get(nurl)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return "Something went wrong.";
    });
}

export async function getPatientData(fname, lname) {
  var nurl = url + "pd/"+fname+"/"+lname;

  return axios
    .get(nurl)
    .then(function (response) {
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
      return "Something went wrong.";
    });
}