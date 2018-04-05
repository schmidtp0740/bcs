import React, {Component} from 'react';
import logo from '../../../style/images/logo.png';
import {
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Card,
  Layout,
  Select,
  Row,
  Col,
  Menu
} from 'antd';
import {headStyles, cardStyles, contentStyles, medusa, layoutStyles} from '../../../style/MainStyles.js';
import { connect } from 'react-redux'
import './local.css'
import renderIf from 'render-if'
import styled, { keyframes }  from 'styled-components';

import {Link, Redirect} from "react-router-dom";
import { getPATIENTINFO, getALLPATIENTS, getRXINFO, fillRX, getINSURANCE } from '../../../redux';
const {Header, Content} = Layout;
const FormItem = Form.Item;

import { fadeInRight } from 'react-animations';
import { fadeInLeftBig } from 'react-animations';

const FadeInRightAnimation = keyframes`${fadeInRight}`;
const FadeInLeftBigAnimation = keyframes`${fadeInLeftBig}`;

const FadeInRightDiv = styled.div`
  animation: 1s ${FadeInRightAnimation};
`;

const FadeInLeftBigDiv = styled.div`
  animation: 1.5s ${FadeInLeftBigAnimation};
`;

const Option = Select.Option;

const Flex1 = styled.div`
  flex: 1
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  text-align:center;
`

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  text-align:center;
`

class Pharmacist extends Component {
  constructor() {
    super();
    this.state = {
      allpatients: [],
      // requestpatientinfo: false,
      // requestallpatients: false,
      // requestpatientrx: false,
      // receivedpatientrx: false
      receivedpatientinfo: false,
      receivedallpatients: false,
      patientinfoTitle: null,
      patientinfoID: null,
      patientinfoDOB: null,
      patientinfoAddress: null,
      patientinfoEthnicity: null,
      patientinfoPhone: null,
      selectedFirstName: null,
      selectedLastName: null,
      displaygetpatientwarning: false,
      rxinfo: [],
      pillPrescribedArray: [],
      localinsurance: []
    }
  }

  componentDidMount(){
    console.log('inside componentDidMount of Doctor');
    this.setState({
      requestallpatients: true
    }, ()=>{
      //
      this.props.getallpatients();
    })
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.patientinfo!=this.props.patientinfo){
      this.setState({
        patientinfoTitle: "Patient Name: " + nextProps.patientinfo.lastName + ", " + nextProps.patientinfo.firstName,
        patientinfoID: nextProps.patientinfo.id,
        patientinfoDOB: nextProps.patientinfo.dob,
        patientinfoAddress: nextProps.patientinfo.address,
        patientinfoEthnicity: nextProps.patientinfo.ethinicity, //misspelled doy!
        patientinfoPhone: nextProps.patientinfo.phone,
      }, ()=>{
        this.setState({
          receivedpatientinfo: true,
        })
      })
      console.log('value of patientinfo after receiving props: ', nextProps.patientinfo);
      if(nextProps.patientinfo.id!=null){
        this.props.getrxinfo({id: nextProps.patientinfo.id})
      }
    }
    if(nextProps.allpatients!=this.props.allpatients){
      this.setState({
        receivedallpatients: true
      }, () => {
        this.setState({
          allpatients: nextProps.allpatients.persons
        })
      })
      console.log('value of allpatients after receiving props: ', nextProps.allpatients.persons);
    }
    if(nextProps.rxinfo!=this.props.rxinfo){
      console.log("&&&&&&&&&");
      console.log('inside rxinfo');
      console.log('value of nextProps rxinfo: ', nextProps.rxinfo);
      console.log("&&&&&&&&&");
      this.setState({
        receivedpatientrx: true,
        rxinfo: nextProps.rxinfo
      }, ()=>{
        this.forceUpdate();
        console.log("in componentWillReceiveProps and requestpatientrx: ", nextProps.rxinfo);
      })
    }
    if(nextProps.insurance!=this.props.insurance){
      this.setState({
        localinsurance: nextProps.insurance
      }, ()=>{
        console.log('**************');
        console.log('after setting localInsurance and value: ', this.state.localinsurance);
        console.log('**************');
      })
    }
  }

  handleChange(value) {
    console.log(`selected ${value}`);
    var localNames = value.split(" ");
    this.setState({
      selectedFirstName: localNames[0],
      selectedLastName: localNames[1],
      displaygetpatientwarning: false
    })
  }

  handleGetPatient(){
    if (this.state.selectedLastName!=null && this.state.selectedFirstName!=null){
      this.setState({
        requestpatientinfo: true
      }, ()=>{
        this.props.getpatientinfo({firstname: this.state.selectedFirstName, lastname: this.state.selectedLastName})
        this.state.allpatients.forEach(patient=>{
          if(patient.firstName===this.state.selectedFirstName&&patient.lastName===this.state.selectedLastName){
            console.log('YATA found match for ID');
            console.log("patient.id: ", patient.id);
            this.props.getinsurance({id: patient.id});
          }
        })
      })
    }else{
      this.setState({
        displaygetpatientwarning: true
      })
    }
  }

  handleFillScript(id, rxid){
    // console.log('script i value: ', value);
    var payload = {id: id, rxid: rxid}
    this.props.putrx(payload)
    this.props.getrxinfo({id: id})
    // this.setState({
    //   requestpatientinfo: true
    // }, ()=>{
    //   this.props.getpatientinfo({firstname: this.state.selectedFirstName, lastname: this.state.selectedLastName})
    // })
  }

  handleBlur() {
    console.log('blur');
  }

  handleFocus() {
    console.log('focus');
  }

  render() {
    console.log('inside DoctorScreen');
    let patientnames;
    patientnames = this.state.allpatients.map(function(patient, i){
      let patientFullName = patient.firstName + " " + patient.lastName
      console.log('value of patientFullName: ', patientFullName);
      return(<Option value={patientFullName} key={i}>{patientFullName}</Option>);
    })
    let scriptlist;
    if (this.state.rxinfo.rx!=undefined){
      scriptlist = this.state.rxinfo.rx.map((pill, i)=>{
        return(
          <Card class='test' style={{fontWeight: "bold", fontSize:"1.5vh", marginBottom: "1vh", padding:"0vh", textAlign: "left", backgroundColor: "#E8F1F5"}}>
            <FlexRow>
              <Flex1>
                <p key={i}>
                  {pill.rxid}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.doctor}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.license}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.prescription}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.refills}
                </p>
              </Flex1>
              <Flex1>
                <div key={i}>
                  {renderIf(pill.status==="prescribed"&&!this.state.pillPrescribedArray.includes(i))(
                    <Button type="secondary" size="large" onClick={()=>{
                      this.handleFillScript(pill.id, pill.rxid);
                      var temparray = this.state.pillPrescribedArray;
                      temparray.push(i)
                      this.setState({
                        pillPrescribedArray: temparray
                      })
                    }}>
                      Click to Fill
                    </Button>
                  )}
                  {renderIf(pill.status!="prescribed"||this.state.pillPrescribedArray.includes(i))(
                    <div>
                      Already Filled
                    </div>
                  )}
                </div>
              </Flex1>
            </FlexRow>
          </Card>
        );
      })
    }

    console.log('value of patientnames: ', patientnames);
    return (
      <div>
      <Card class="pharmacist" title="Welcome, Penelope Blake!" style={{position: "absolute", left: "2vw", height: "20.5vh", top: "2.5vh", width: "50vw", backgroundColor: "#1989AC", color: "#E8F1F5", fontSize: "2vh"}}>
        <p>
          Select a patient and you will be able to see their info and fill prescriptions that they have been given.
        </p>
        <p>
          The blockchain will be modified to reflect the change in status.
        </p>

      </Card>



      {renderIf(this.state.receivedallpatients===true)(
        <div>
          <Card title="Search for a Patient" bordered={false} style={{width: "20vw", left: "55vw", top: "2.5vh", height:"100%", backgroundColor: "#1989AC"}}>
            <FlexColumn>
              <Flex1>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Select a person"
                  size="large"
                  optionFilterProp="children"
                  onChange={(e)=>this.handleChange(e)}
                  onFocus={()=>this.handleFocus()}
                  onBlur={()=>this.handleBlur()}
                  filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {patientnames}
                  </Select>
                </Flex1>
                <Flex1><br/></Flex1>
                <Flex1>
                  <Button type="secondary" size="large" onClick={()=>this.handleGetPatient()}>
                    Get Records
                  </Button>
                </Flex1>
                {renderIf(this.state.displaygetpatientwarning===true)(
                  <div>
                    <Flex1><br/></Flex1>
                    <Flex1 style={{color: "#FFDE25"}}>
                      You must select a patient first!
                    </Flex1>
                  </div>
                )}
            </FlexColumn>
          </Card>

        </div>
       )}

      {renderIf(this.state.receivedpatientinfo===true)(
        <FadeInRightDiv style={{position: "absolute", left: "77.5vw", right: "20vw", top: "2.5vh", width: "20vw", textAlign: "left"}}>
          <Card title={this.state.patientinfoTitle} bordered={false} style={{ backgroundColor: "#1989AC", color: "#283E56"}}>
            <FlexColumn>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                    ID
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoID}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    DOB
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoDOB}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    Address
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoAddress}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    Ethnicity
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoEthnicity}
                    </p>
                  </div>
                </Card>
              </Flex1>
              <Flex1><br/></Flex1>
              <Flex1>
                <Card style={{fontWeight: "bold", fontSize:"2vh", paddingTop: "0",  textAlign: "left", backgroundColor: "#E8F1F5"}}>
                  <p>
                    Phone
                  </p>
                  <div style={{fontSize:"1.5vh", textAlign: "right"}}>
                    <p>
                      {this.state.patientinfoPhone}
                    </p>
                  </div>
                </Card>
              </Flex1>
            </FlexColumn>
          </Card>
        </FadeInRightDiv>
      )}

      <div style={{position: "absolute", right: "2.5vw", bottom: "2.5vh"}}>
        <Card bordered={false} style={{ backgroundColor: "black", color: "white"}}>
            <div>
              <p>
                Insurance Company: {this.state.localinsurance.company}
              </p>
              <p>
                Policy ID: {this.state.localinsurance.policyId}
              </p>
              <p>
                Expiration Date: {this.state.localinsurance.expirationDate}
              </p>
            </div>
        </Card>
      </div>

      {renderIf(this.state.receivedpatientrx===true)(
        <FadeInLeftBigDiv style={{position: "absolute", left: "2.5vw", top: "26.5vh", width: "72.5vw", height: "50vh", textAlign: "left", overflow: "hidden", overflowY: "auto"}}>
          <Card title="PRESCRIPTIONS" bordered={false} style={{ backgroundColor: "#1989AC", color: "#283E56"}}>

            <Card style={{fontWeight: "bold", fontSize:"1.5vh", marginBottom: "1vh", padding:"0vh", textAlign: "left", backgroundColor: "#283E56"}}>
              <FlexRow>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    RXID
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    DOCTOR
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    LICENSE
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    SCRIPT
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    REFILLS
                  </h1>
                </Flex1>
                <Flex1>
                  <h1 style={{color:"#E8F1F5"}}>
                    STATUS
                  </h1>
                </Flex1>
              </FlexRow>
            </Card>

            {scriptlist}
          </Card>
        </FadeInLeftBigDiv>
      )}

      </div>
    );
  }
}

// export default Doctor

//
function mapDispatchToProps(dispatch) {
    return({
      //  checkloginoci: (e)=>{dispatch(checkLoginOCI(e))},
      getpatientinfo: (e)=>{dispatch(getPATIENTINFO(e))},
      getallpatients: ()=>{dispatch(getALLPATIENTS())},
      getrxinfo: (e)=>{dispatch(getRXINFO(e))},
      putrx: (e)=>{dispatch(fillRX(e))},
      getinsurance: (e)=>{dispatch(getINSURANCE(e))}
    })
}

function mapStateToProps(state) {
    return({
      // loginreturn: state.loginreturn,
      patientinfo: state.patientinfo,
      allpatients: state.allpatients,
      rxinfo: state.rxinfo,
      fillrx: state.fillrx,
      insurance: state.insurance
    })
}

export default (connect(
    mapStateToProps, mapDispatchToProps)(
    Pharmacist
))
