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
  Row,
  Col,
  Menu
} from 'antd';
import {headStyles, cardStyles, contentStyles, medusa, layoutStyles} from '../../../style/MainStyles.js';
import { connect } from 'react-redux';
import "../../../style/fonts/fontface.css";
import './local.css';
import GreenCloud from '../../../style/images/GreenCloud.png';
import DoctorSplash from '../../../style/images/doctorsplashkeyboard.jpg';
import styled from 'styled-components';



import {Link, Redirect} from "react-router-dom";
import { checkLoginOCI } from '../../../redux';
const {Header, Content} = Layout;
const FormItem = Form.Item;

import renderIf from 'render-if'

const Flex1 = styled.div`
  flex: 1
`;

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  text-align:center;
`


class Entry extends Component {
  constructor() {
    super();
    this.state = {
      redirect: null
    }
  }

  buttonClicked(value){
    console.log('inside button clicked and value: ', value);

  }

  render() {
    return (
      <div>
        <div style={{position:"absolute", top: "35vh", left:"25vw"}}>
          <img src={DoctorSplash} alt="DoctorSplash" style={{maxWidth: "100%", maxHeight: "100%", zIndex: "1"}}/>
        </div>
        <div className="mainTitle" style={{fontSize:"50pt", position: "absolute", left: "0", right: "0", top: "0", bottom: "80vh"}}>
          <div style={{zIndex:"2", position: "absolute", right: "5vw", top: "0vh"}}>
            Oracle Cloud Wellness
          </div>
          <img src={GreenCloud} alt="GreenCloud" style={{maxWidth: "100%", maxHeight: "100%", zIndex: "1"}}/>
        </div>

        <Card style={{position: "absolute", width: "20vw", height: "45vh", top: "40vh", left: "15vh", fontSize:"2vh", backgroundColor: "#1989AC", overflow: "hidden", overflowY: "auto", color: "#E8F1F5"}}>
          <p>
            Prow scuttle parrel provost Sail ho shrouds spirits boom mizzenmast yardarm. Pinnace holystone mizzenmast quarter crows nest nipperkin grog yardarm hempen halter furl. Swab barque interloper chantey doubloon starboard grog black jack gangway rutters.
          </p>
          <br/>
          <p>
            Deadlights jack lad schooner scallywag dance the hempen jig carouser  broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker Shiver me timbers to go on account lookout wherry doubloon chase. Belay yo-ho-ho keelhaul squiffy black spot yardarm spyglass sheet transom heave to.
          </p>
          <br/>
          <p>
            Trysail Sail ho Corsair red ensign hulk smartly boom jib rum gangway. Case shot Shiver me timbers gangplank crack Jennys tea cup ballast Blimey lee snow crows nest rutters. Fluke jib scourge of the seven seas boatswain schooner gaff booty Jack Tar transom spirits.
          </p>

        </Card>

        <Card title="Are you a Doctor or Pharmacist" bordered={false} style={{width: "20vw", left: "70vw", top: "25vh", backgroundColor: "#1989AC"}}>
          <FlexColumn>
            <Flex1>
              <Button type="secondary" size="large" onClick={()=>this.setState({redirect: "doctor"})}>
                Doctor
              </Button>
            </Flex1>
            <Flex1>
              <br/>
            </Flex1>
            <Flex1>
              <Button type="secondary" size="large" onClick={()=>this.setState({redirect: "pharmacist"})}>
                Pharmacist
              </Button>
            </Flex1>
            <Flex1>
              <br/>
            </Flex1>
            <Flex1>
              <Button type="secondary" size="large" onClick={()=>this.setState({redirect: "iot"})}>
                IoT
              </Button>
              <br/>
            </Flex1>
          </FlexColumn>
        </Card>
        {renderIf(this.state.redirect==="doctor")(
          <Redirect to='/doctor' />
        )}
        {renderIf(this.state.redirect==="pharmacist")(
          <Redirect to='/pharmacist' />
        )}
        {renderIf(this.state.redirect==="iot")(
          <Redirect to='/iot' />
        )}
      </div>
    );
  }
}


function mapDispatchToProps(dispatch) {
    return({
      //  checkloginoci: (e)=>{dispatch(checkLoginOCI(e))},
    })
}

function mapStateToProps(state) {
    return({
      // loginreturn: state.loginreturn,
    })
}

export default (connect(
    mapStateToProps, mapDispatchToProps)(
    Entry
))
