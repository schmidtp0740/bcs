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
  Modal,
  Row,
  Col,
  Menu,
  Dropdown,
  Item,
  Table,
  Divider
} from 'antd';
import {headStyles, cardStyles, contentStyles, medusa, layoutStyles} from '../../../style/MainStyles.js';
import { connect } from 'react-redux'
import './local.css'
import renderIf from 'render-if'
import styled, { keyframes }  from 'styled-components';

import {Link, Redirect} from "react-router-dom";
import { getPATIENTINFO, getALLPATIENTS, getRXINFO, submitRX, getIOTINFO, updateRXINFO } from '../../../redux';


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

// class DrugHolder extends Component {
//   constructor() {
//     super();
//     this.state = {
//       drugHeld: this.props.drugHeld
//     }
//   }
//   render(){
//     return(
//       <div>
//         {this.state.drugHeld}
//       </div>
//     )
//   }
// }

const MenuAlternatives = ({drug, alternatives, rxinfo, index, updaterxinfo, updateStateForRxInfo}) =>{
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

class Insurance extends Component {
  constructor() {
    super();
    this.state = {
      receivedpatientrx: false,
      rxinfo: [],
      alternativeList: [["Acebutolol", "Atenolol", "Bisoprolol", "Carvedilol"], ["Fluticasone", "Budesonide", "Mometasone", "Fluticasone"]]
    }
  }

  componentDidMount(){
    this.props.getrxinfo()
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('componentWillUpdate has changed yo!!!!!');
    if(nextProps.rxinfo!=this.props.rxinfo){

      this.setState({
        receivedpatientrx: true,
        rxinfo: nextProps.rxinfo
      }, ()=>{
        console.log("in componentWillReceiveProps and requestpatientrx: ", nextProps.rxinfo);
        console.log('value of rxinfo: ', this.state.rxinfo);
      })
    }
  }

  updateStateForRxInfo(state){
    this.setState({
      rxinfo: state
    })
  }

//   0
// rxid	"RX1"
// id	"001"
// firstName	"John"
// lastName	"Doe"
// dob	"01/01/1987"
// prescription	"aaaa"
// refills	"bbbb"
// doctor	"Dr. Sloan"
// license	"PA EX 0000"
// status	"prescribed"
// user	"Dr. Sloan"
// insurance
// company	"Liberty Mutual"
// policyId	"po00000001"
// expirationDate	"12/01/2018"
// timestamp	1522958749612



  render() {
    let scriptlist;
    if (this.state.rxinfo.rx!=undefined){
      scriptlist = this.state.rxinfo.rx.map((pill, i)=>{
        return(
          <Card style={{fontWeight: "bold", fontSize:"1.5vh", marginBottom: "1vh", padding:"0vh", textAlign: "left", backgroundColor: "#E8F1F5"}}>
            <FlexRow>
              <Flex1>
                <p>
                  {pill.rxid}
                </p>
              </Flex1>
              <Flex1>
                <Dropdown overlay={<MenuAlternatives drug={pill.prescription} alternatives={this.state.alternativeList} rxinfo={this.state.rxinfo} updaterxinfo={this.props.updaterxinfo.bind(this)} index={i}
                updateStateForRxInfo={this.updateStateForRxInfo.bind(this)}
                />}>
                  <p>
                    {pill.prescription}
                  </p>
                </Dropdown>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.user}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.insurance.company}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.insurance.policyId}
                </p>
              </Flex1>
              <Flex1>
                <p key={i}>
                  {pill.insurance.expirationDate}
                </p>
              </Flex1>
            </FlexRow>
          </Card>
        );
      })
    }
    return(
      <div>
        <div>
          <div style={{fontSize:"5.3vh", marginLeft:"5%", color:"#1989AC"}}>
            <p>
              Insurance Page
            </p>
          </div>
          <div style={{fontSize:"2.3vh", marginLeft:"5%", color: "#283E56"}}>
            <p>
              All insurance queries are recorded on the blockchain and accessible here.
            </p>
          </div>
        </div>
        <br/>
        {renderIf(this.state.receivedpatientrx===true)(
          <div style={{width: "80%", marginRight: "10%", marginLeft:"10%"}}>
            <Card bordered={false} style={{ backgroundColor: "#1989AC", color: "#283E56"}}>
              <Card style={{fontWeight: "bold", fontSize:"1.3vh", marginBottom: "1vh", padding:"0vh", textAlign: "left", backgroundColor: "#283E56"}}>
                <FlexRow>
                  <Flex1>
                    <h1 style={{color:"#E8F1F5"}}>
                      RXID
                    </h1>
                  </Flex1>
                  <Flex1>
                    <h1 style={{color:"#E8F1F5"}}>
                      PRESCRIPTION
                    </h1>
                  </Flex1>
                  <Flex1>
                    <h1 style={{color:"#E8F1F5"}}>
                      USER
                    </h1>
                  </Flex1>
                  <Flex1>
                    <h1 style={{color:"#E8F1F5"}}>
                      INSURANCE COMPANY
                    </h1>
                  </Flex1>
                  <Flex1>
                    <h1 style={{color:"#E8F1F5"}}>
                      POLICY ID
                    </h1>
                  </Flex1>
                  <Flex1>
                    <h1 style={{color:"#E8F1F5"}}>
                      INSURANCE EXPIRATION
                    </h1>
                  </Flex1>
                </FlexRow>
              </Card>
            </Card>
            {renderIf(scriptlist!=undefined)(
              <Card bordered={false} style={{ backgroundColor: "#1989AC", color: "#283E56", height: "30vh", overflow: "hidden", overflowY: "auto", paddingBottom: '2vh'}}>
                {scriptlist}
              </Card>
            )}
          </div>
        )}
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return({
      getrxinfo: (e)=>{dispatch(getRXINFO(e))},
      updaterxinfo: (e)=>{dispatch(updateRXINFO(e))}
    })
}

function mapStateToProps(state) {
    return({
      rxinfo: state.rxinfo,
    })
}

export default (connect(
    mapStateToProps, mapDispatchToProps)(
    Insurance
))
