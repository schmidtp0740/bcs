import axios from 'axios';

// const url = 'http://129.146.85.80:8000/';
// http://private-0a8629-ironbankbcsapidoc.apiary-mock.com/pd/FirstName/LastName

// const server = process.env.SERVER
//
// const url = server + '/rx'

import envDATA from "../../../../env.json"

const url = envDATA.SERVER + '/rx'

//WHY ARE WE DOING THIS???

//if you store the authorization key in localStorage of the browser it allows outside sites to see the authorization for the site.
//for non-production sites this does not matter
//HOWEVER
//if we allow malicious actors access to servers they can use runtime to spin up blockchain mining or other monetarily risky enterprises.
//THIS IS BAD
//So instead we should store the authorization either locally or send to reducers and access there.

//HERE ARE THE AXIOS CALLS

export const submitRX = (data) => {
  return (dispatch) => {
    console.log('value of payload: ', data);
    var sendurl = url + "/" + data.id
    console.log('value of sendurl: ', sendurl);
    console.log('INSIDE SUBMITRX');
    console.log("*****************");
    console.log("*****************");
    console.log("*****************");
    console.log('value of data.id, ', data.id);
    console.log("*****************");
    console.log("*****************");
    console.log("*****************");
    console.log('value of payload: ', data);
    console.log('value of payload: ', data['FirstName']);
    console.log(typeof(data));
    console.log(typeof(data.FirstName));
    axios.post(sendurl, {
      id: data.id,
      firstName: data.firstName,
      lastName: data.lastName,
      dob: data.dob,
      prescription: data.prescription,
      refills: data.refills,
      doctor: data.doctor,
      license: data.license,
      status: "prescribed",
      timestamp: data.timestamp,
      user: "Dr. Sloan",
      insurance: {
        company: data.insurance.company,
        policyId: data.insurance.policyId,
        expirationDate: data.insurance.expirationDate
      }
    })
    .then((response)=>{
      console.log('inside response from login auth and response : ', response);
      dispatch(AXIOSRETURNRXSUBMIT(response))
    })
    .catch(error => {
      console.log('inside error from login auth and response : ', error);
      dispatch(AXIOSERRORRRXSUBMIT(error))
    })
  }
}

//HERE ARE THE ACTIONS ->>> REDUCERS

export const AXIOSRETURNRXSUBMIT = (payload) => {
  console.log('inside AXIOSRETURN and payload ', payload);
  return{
    type: 'SUBMIT_RX',
    data: payload.data
  }
}

export const AXIOSERRORRRXSUBMIT = (payload) => {
  console.log('inside AXIOSERROR and payload ', payload);
  return{
    type: 'SUBMITRX_ERROR',
    data: payload
  }
}
