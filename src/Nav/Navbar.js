import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu, Badge } from 'antd';
import {
  PieChartOutlined,
  PlayCircleOutlined,
  UserOutlined,
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import AuthenticationContext from '../global';
import ApiClient from '../helpers/Api';
import { removeSession } from '../helpers/Session';

const { Sider } = Layout;
const { SubMenu } = Menu;

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const history = useHistory();
  const [isLoggedIn, setLoggedIn] = React.useContext(AuthenticationContext);

  function logout() {
    ApiClient.post('/logout')
      .then(function () {
        console.log('Succesfully logged out!');
      })
      .catch(function (error) {
        console.log(`unable to logout...: ${error}`);
      })
      .finally(function () {
        removeSession();
        setLoggedIn(false);
        history.push('/');
      });
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className="logo">
        <h1 style={{ textAlign: 'center' }}>Rustfuif</h1>
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

        {isLoggedIn ? (
          <SubMenu
            key="/user-menu"
            title={
              <span>
                <UserOutlined />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="6">
              <InboxOutlined />
              <span>Invites</span>
              <Badge dot={true} status="processing" offset={[10, 0]} />
            </Menu.Item>
            <Menu.Item key="/games">
              <Link to="/games">
                <PlayCircleOutlined />
                <span>Games</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/logout" onClick={() => logout()}>
              <LogoutOutlined />
              <span>Logout</span>
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
};

export default Navbar;
