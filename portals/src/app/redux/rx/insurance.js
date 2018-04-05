import axios from 'axios';


import envDATA from "../../../../env.json"

// const url = 'http://private-0a8629-ironbankbcsapidoc.apiary-mock.com/insurance/4040403'


// {
//   "insuranceCompany": "Liberty Mutual",
//   "policyId": "0001020020",
//   "expirationDate": "01/20/2017"
// }


export const getINSURANCE = (payload) => {
  return (dispatch) => {
    console.log('INSIDE INSURANCE value of payload.id: ', payload.id);
    const url = envDATA.SERVER + '/insurance/'+payload.id;
    var sendurl = url;
    axios.get(sendurl)
    .then((response)=>{
      console.log('inside response from getINSURANCE: ', response);
      dispatch(AXIOSRETURNINSURANCE(response))
    })
    .catch(error => {
      console.log('inside response from getERROR: ', error);
      dispatch(AXIOSERRORINSURANCE(error))
    })
  }
}

//HERE ARE THE ACTIONS ->>> REDUCERS

export const AXIOSRETURNINSURANCE = (payload) => {
  console.log('inside AXIOSRETURN and payload ', payload);
  return{
    type: 'INSURANCE_RETURN',
    data: payload.data
  }
}

export const AXIOSERRORINSURANCE = (payload) => {
  console.log('inside AXIOSERROR and payload ', payload);
  return{
    type: 'INSURANCE_ERROR',
    data: payload
  }
}
