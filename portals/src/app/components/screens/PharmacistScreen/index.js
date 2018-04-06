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
  Dropdown,
  Col,
  Menu,
  Item,
} from 'antd';
import {headStyles, cardStyles, contentStyles, medusa, layoutStyles} from '../../../style/MainStyles.js';
import { connect } from 'react-redux'
import './local.css'
import renderIf from 'render-if'
import styled, { keyframes }  from 'styled-components';

import {Link, Redirect} from "react-router-dom";
import { getPATIENTINFO, getALLPATIENTS, getRXINFO, fillRX, getINSURANCE, updateRXINFO } from '../../../redux';
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

const MenuAlternatives = ({drug, alternatives, rxinfo, index, updaterxinfo, updateStateForRxInfo, updateStateForPrescription}) =>{
  console.log('inside menu and drug: ', drug);
  var matchIndex = null;
  var altIndex = null;
  var altCounter = 0;
  alternatives.forEach(altArr=>{
    var matchCounter = 0;
    altArr.forEach(alt=>{
      if(drug===alt){
        console.log('found drug match!');
        matchIndex = matchCounter;
        altIndex = altCounter;
      }
      matchCounter++;
    })
    altCounter++;
  })
  if(matchIndex!=null){
    var localArr = [];
    var subAltArr = alternatives[altIndex]
    var subCounter = 0;
    subAltArr.forEach(alt=>{
      if(subCounter!=matchIndex){
        localArr.push(alt)
      }
      subCounter++;
    })
    return(
      <div>
          {
            Array.from({ length: localArr.length }, (_, i) =>
                        <div style={{backgroundColor:"black", color:"white", fontSize:"1.8vh", paddingLeft:"5%", paddingRight:"5%", cursor:"pointer"}} onClick={()=>{
                          var sendIndex = i;
                          var payload = rxinfo;
                          payload.rx[index].prescription = localArr[i];
                          updateStateForRxInfo(payload);
                          updateStateForPrescription(payload.rx[index].prescription)
                        }}>
                          <p>
                              {localArr[i]}
                          </p>
                        </div>
                      )
          }
      </div>
    )
  }else{
    return(
      <div style={{backgroundColor:"black", color:"white", fontSize:"1.5vh", paddingLeft:"5%", paddingRight:"5%"}}>
        <p>
            No drug alternatives found
        </p>
      </div>
    )
  }
}

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
      localinsurance: [],
      prescription: null,
      genericArray: [],
      prescription: null,
      fillId: null,
      hitFill: false,
      alternativeList: [["Acebutolol", "Atenolol", "Bisoprolol", "Carvedilol"], ["Fluticasone", "Budesonide", "Mometasone", "Fluticasone"]]
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
        if(this.state.hitFill===true){
          this.props.getrxinfo({id: fillId})
          this.setState({
            hitFill: false,
            fillId: null
          })
        }
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

  updateStateForRxInfo(state){
    this.setState({
      rxinfo: state
    })
  }

  updateStateForPrescription(state){
    this.setState({
      prescription: state
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
    console.log("INSIDE HANDLEFILLSCRIPT");
    console.log('value of this.state.prescription: ', this.state.prescription);
    var payload = {id: id, rxid: rxid, prescription: this.state.prescription}
    this.props.putrx(payload)
    this.setState({
      fillId: id,
      hitFill: true,
    })
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
                {renderIf(pill.status==="prescribed"&&!this.state.pillPrescribedArray.includes(i))(
                  <Dropdown overlay={<MenuAlternatives drug={pill.prescription} alternatives={this.state.alternativeList} rxinfo={this.state.rxinfo} updaterxinfo={this.props.updaterxinfo.bind(this)} index={i}
                  updateStateForRxInfo={this.updateStateForRxInfo.bind(this)}
                  updateStateForPrescription={(value)=>this.updateStateForPrescription(value)}
                  />}>
                    <p>
                      {pill.prescription}
                    </p>
                  </Dropdown>
                )}
                {renderIf(pill.status!="prescribed"||this.state.pillPrescribedArray.includes(i))(
                  <div>
                    <p>
                      {pill.prescription}
                    </p>
                  </div>
                )}
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
      getinsurance: (e)=>{dispatch(getINSURANCE(e))},
      updaterxinfo: (e)=>{dispatch(updateRXINFO(e))}
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
