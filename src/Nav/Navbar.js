import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu, Badge } from 'antd';
import {
  PlayCircleOutlined,
  UserOutlined,
  HomeOutlined,
  InboxOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import AuthenticationContext from '../global';
import ApiClient from '../helpers/Api';
import { removeSession } from '../helpers/Session';
import { routes } from '../Router';

const { Sider } = Layout;

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

  function getSelectedKey() {
    const path = window.location.pathname;

    let res = '/';

    if (path === '/') {
      return res;
    }

    routes.forEach(route => {
      if (path.startsWith(route.path) && route.path !== '/') {
        res = route.path;
      }
    });

    return res;
  }

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className="logo">
        <h1 style={{ textAlign: 'center' }}>Rustfuif</h1>
      </div>
      <Menu theme="dark" defaultSelectedKeys={[getSelectedKey()]} mode="inline">
        <Menu.Item key="/">
          <Link to="/">
            <HomeOutlined />
            <span>Home</span>
          </Link>
        </Menu.Item>

        {isLoggedIn ? (
          <Menu.ItemGroup>
            <Menu.Item key="/games">
              <Link to="/games">
                <PlayCircleOutlined />
                <span>Games</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/invites">
              <InboxOutlined />
              <span>Invites</span>
              <Badge dot={true} status="processing" offset={[10, 0]} />
            </Menu.Item>
            <Menu.Item key="/logout" onClick={() => logout()}>
              <LogoutOutlined />
              <span>Logout</span>
            </Menu.Item>
          </Menu.ItemGroup>
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
