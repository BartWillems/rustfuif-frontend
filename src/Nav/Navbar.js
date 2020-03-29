import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu, Badge } from 'antd';
import {
  PieChartOutlined,
  PlayCircleOutlined,
  UserOutlined,
  HomeOutlined,
  InboxOutlined,
} from '@ant-design/icons';

import isLoggedIn from '../Session/Session';

const { Sider } = Layout;
const { SubMenu } = Menu;

class Navbar extends React.Component {
  state = {
    collapsed: false,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    isLoggedIn();
  }

  render() {
    return (
      <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
        <div className="logo">
          <h1>Rustfuif</h1>
        </div>
        <Menu theme="dark" defaultSelectedKeys={[document.location.pathname]} mode="inline">
          <Menu.Item key="/">
            <Link to="/">
              <HomeOutlined />
              <span>Home</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/graphs">
            <PieChartOutlined />
            <span>Graphs</span>
          </Menu.Item>

          {isLoggedIn() ? (
            <SubMenu
              key="/user-menu"
              title={
                <span>
                  <UserOutlined />
                  <span>User</span>
                </span>
              }
              disabled={!isLoggedIn()}
            >
              <Menu.Item key="6">
                <InboxOutlined />
                <span>Invites</span>
                <Badge dot={true} status="processing" offset={[10, 0]} />
              </Menu.Item>
              <Menu.Item key="8">
                <Link to="/games">
                  <PlayCircleOutlined />
                  <span>Games</span>
                </Link>
              </Menu.Item>
            </SubMenu>
          ) : (
            <Menu.Item>
              <Link to="/login">
                <span>
                  <UserOutlined />
                  <span>Login</span>
                </span>
              </Link>
            </Menu.Item>
          )}
        </Menu>
      </Sider>
    );
  }
}

export default Navbar;
