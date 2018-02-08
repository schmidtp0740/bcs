import React, {
  PureComponent
} from 'react';
import { List, message, Spin, Icon, Avatar, notification } from 'antd';
import reqwest from 'reqwest';

import InfiniteScroll from 'react-infinite-scroller';

import {getAllRxData, getRxData, getStatus} from '../services/API/blockAPI';

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class BlockFeed extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  }
  
  getData = (callback) => {
    let that = this;
    getAllRxData().then(response => {
      console.log(response['RX'].toString());
      
      if (response['RX'] !== that.state.data) {
        that.setState({ data: response['RX'].reverse() });
      }

      getStatus().then(response => {
        if (response.Status === "False") {
          notification.open({
            message: 'False Insert Detected',
            description: 'There was an attempt to manipulate the blockchain. \nAttempted By: ' + response.Blockchain + '\nPrescription ID: '+response.RXID,
            icon: <Icon type="warning" style={{ color: '#e8f1f5' }} />,
            style: {
              backgroundColor: '#307351',
              color: '#283E56'
            },
          });
        }
      }).catch(error => {
        return error;
      });
      //that.getData();
    }).catch(error => {
      return error;
    });
  }

  componentWillMount() {
    this.getData((res) => {
      this.setState({
        data: res.results,
      });
    });
  }
  handleInfiniteOnLoad = () => {
    let data = this.state.data;
    this.setState({
      loading: true,
    });
    if (data.length > 100) {
      message.warning('Infinite List loaded all');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
    
  }
  render() {
    return (
      <div className="demo-infinite-container">
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={this.state.hasMore}
          useWindow={false}
          threshold={0}
        >
          {this.state.loading && this.state.hasMore && <Spin className="demo-loading" />}  
          <List
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.ID}>
                <List.Item.Meta
                  avatar={<Avatar shape="square" size="large" style={{ backgroundColor: {item.Status === 'prescribed' ? '#D1B829' : '#307351'}}}icon={item.Status === 'prescribed' ? 'fork' : 'medicine-box'} />}
                  title={item.RXID}
                  description={'Timestamp: ' + item.TimeStamp}
                />
                <div>{'Status: ' + item.Status}</div>
              </List.Item>
            )}
          >
            
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

export default BlockFeed;