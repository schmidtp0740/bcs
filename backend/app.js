
const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const bcsQueryURL = 'http://';
const bcsInvokeURL= 'http://';
var RXint = 3;
var persons = [
    {
        ID: "001",
        FirstName: "John",
        LastName: "Doe",
        DOB: "01/01/1987",
        Address: "999 Denver Rd, Portland, OR 98765",
        Ethnicity: "Asian",
        Phone: "111-111-1111"
    },
    {
        ID: "002",
        FirstName: "Mary",
        LastName: "Jane",
        DOB: "05/05/1997",
        Address: "111 Denver Rd, Portland, OR 98765",
        Ethnicity: "Caucasion",
        Phone: "123-123-1234"
    }
];
var rx = [
    {
        RXID: "RX001",
        ID: "001",
        FirstName: "John",
        LastName: "Doe",
        DOB: "01/01/1981",
        Prescription: "mitodel",
        Refills: 5,
        Doctor: "Dr. Sloan",
        License: "PA EX 0000",
        Status: "prescribed",
        TimeStamp: "dec1"
      },
      {
        RXID: "RX002",
        ID: "002",
        FirstName: "Mary",
        LastName: "Jane",
        DOB: "01/01/1981",
        Prescription: "advil",
        Refills: 2,
        Doctor: "Dr. Sloan",
        License: "PA EX 0000",
        Status: "Prescribed",
        TimeStamp: "deb1"
      },
      {
        RXID: "RX003",
        ID: "001",
        FirstName: "John",
        LastName: "Doe",
        DOB: "01/01/1981",
        Prescription: "advil",
        Refills: 5,
        Doctor: "Dr. Sloan",
        License: "PA EX 0000",
        Status: "prescribed",
        TimeStamp: "dec1"
      }
];

// Patient Collection
app.get('/pd', function(req, res){
    res.send({ Persons: persons});
});

app.get('/pd/:FirstName/:LastName', function(req, res) {
    var first = req.params.FirstName;
    var last = req.params.LastName;

    //do query in DB for first and last name match

    //send response back

    var response;
    persons.forEach(function(person){
        if(person.FirstName.toLowerCase() == first.toLowerCase() && person.LastName.toLowerCase() == last.toLowerCase()){
            response = person;
        }
    });
    res.send(response);
});

// RX Collection
// get/post/patch rx information
app.get('/rx/:ID', function(req, res){
    var responseRX = [];
    rx.forEach(function(r){
        if(r.ID == req.params.ID){
            responseRX.push(r);
        }
    });
    res.send({RX: responseRX});
});

app.post('/rx/:ID', function(req, res){
    if((req.params.patientID && req.body.FirstName && req.body.LastName && req.body.DOB && req.body.Prescription && req.body.Refills && req.body.Doctor && req.body.Status && req.body.Timestamp && req.body.License)){
        res.send({Response: "not ok"});
    }


    const patientID = req.params.ID;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const DOB = req.body.DOB;
    const Prescription = req.body.Prescription;
    const Refills = req.body.Refills;
    const Doctor = req.body.Doctor;
    const License = req.body.License;
    const Status = req.body.Status;
    const Timestamp = req.body.Timestamp;
    rx.push({
        RXID: "RX" + pad(++RXint, 3).toString(),
        ID: patientID,
        FirstName: FirstName,
        LastName: LastName,
        DOB: DOB,
        Prescription: Prescription,
        Refills: Refills,
        Doctor: Doctor,
        License: License,
        Status: Status,
        TimeStamp: Timestamp
      });
    // Go to next Doc in Folder
    // axios.post(bcsInvokeURL, {
    //     "channel": "doctororderer",
    //     "chaincode": "file-trace",
    //     "chaincodeVer": "v1",
    //     "method": "newDocument",
    //     "args": [RXID, patientID, Firstname, LastName, TimeStamp, Doctor, Prescription, Refills, Status]
    //    }).then((response) => {
    //         res.send(response);
    //     }).catch( (err) => {
    //         console.log(err);
    //     });
    res.send({response: "ok"});
});

app.patch('/rx/:ID', function(req, res){
    const patientID = req.params.ID;
    const RXID = req.body.RXID; 
    const Status = req.body.Status;
    const TimeStamp = req.body.TimeStamp;
    rx = rx.map((r)=>{
        if(r.RXID == RXID){
            r.Status = Status;
            r.TimeStamp = TimeStamp;
        }
        return r;
    });
    console.log("RX", JSON.stringify(rx));
    res.send({response: "ok"});
});


// Check Blockchain Validity
app.get('/bcs', function(req, res){

});

app.listen(port, function(){
    console.log("Listening on port: ", port);
});

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }