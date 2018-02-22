// @flow weak

import React, {
  PureComponent
}                     from 'react';
import PropTypes      from 'prop-types';
import AnimatedView from '../../components/animatedView/AnimatedView';
import InfiniteScroll from 'react-infinite-scroller';
import BlockFeed from '../../components/bcListView';

import {
  Button,
  Icon,
  Form,
  Layout,
  Row,
  Col,
  Select,
  List
} from 'antd';

const { Header, Content } = Layout;
const Option = Select.Option;
const FormItem = Form.Item;

const cardList = null;

class Home extends PureComponent {
  static propTypes= {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,
    
    // views:
    currentView:  PropTypes.string.isRequired,
    enterHome:    PropTypes.func.isRequired,
    leaveHome:    PropTypes.func.isRequired
  };

  componentDidMount() {
    const { enterHome } = this.props;
    enterHome();
  }

  componentWillUnmount() {
    const { leaveHome } = this.props;
    leaveHome();
  }

   handleChange(value) {
    console.log(`selected ${value}`);
  }
  
   handleBlur() {
    console.log('blur');
  }
  
   handleFocus() {
    console.log('focus');
  }

  updateList() {
    
  }

  render() {
    return (
      <Layout>
        <Header>
        <Row>
            <Col span={12} offset={6}>
          <h1 className="headerTitle">
            Blockchain Console
          </h1>
          </Col>  
          </Row>
        </Header>
        <Content >
          <Row>
            <Col span={12} offset={6}>
            <Select
                showSearch
                size={'large'}  
              style={{ width: '100%' }}
              placeholder="Select a medical professional"
              optionFilterProp="children"
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            >
              <Option value="d">Doctor</Option>
              <Option value="p">Pharmacist</Option>
            </Select>
            </Col>
            <Col span={12} offset={6}>
            <BlockFeed />  
            </Col>  
          </Row>
            
        </Content>
      </Layout>
    );
  }

  handlesOnGoAbout = (
    event: SyntheticEvent<>
  ): void => {
    if (event) {
      event.preventDefault();
      const { history } = this.props;

      history.push('/about');
    }
  }
}

export default Home;
