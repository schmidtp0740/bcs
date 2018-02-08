// @flow weak

import React, {
  Component
}                             from 'react';
import PropTypes              from 'prop-types';
import {
  Layout,
  Menu,
  Icon
}                             from 'antd';
import navigationModel        from '../../config/navigation.json';
import MainRoutes             from '../../routes/MainRoutes';

const { Header, Content, Footer, Sider } = Layout;
const MenuItem = Menu.Item; // workaround to fix production bundle error: "Menu not found"

class App extends Component {
  static propTypes = {
    // react-router 4:
    match:    PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history:  PropTypes.object.isRequired,

    // views:
    currentView: PropTypes.string

  };

  state = {
    navModel: navigationModel,
    selectedSidemenu: ['/']
  };

  render() {
    const {
      navModel,
      selectedSidemenu
    } = this.state;

    return (
      <Layout className="layout">
        
        <Layout>
          <Header />
          <Content>
              <MainRoutes />
          </Content>
        </Layout>
      </Layout>
    );
  }

  handlesOnCollpase = (
    collapsed: boolean,
    type: string
  ): void => {
    /* eslint-disable no-console */
    console.log(collapsed, type);
    /* eslint-enable no-console */
  }

  handlesOnMenuClick = (
    event: SyntheticEvent<>
  ): void => {
    if (event) {
      const { history } = this.props;
      const { key } = event;

      history.push(key);
    }
  }
}

export default App;
