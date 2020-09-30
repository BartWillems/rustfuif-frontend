import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

import AuthenticationContext from '../global';
import ApiClient from '../helpers/Api';
import { removeSession } from '../helpers/Session';

const { Header } = Layout;

const routes = ['/', '/login'];

const Navbar = () => {
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

  function getCurrentPage() {
    const path = window.location.pathname;

    let res = '/';

    if (path === '/') {
      return res;
    }

    routes.forEach(route => {
      if (path.startsWith(route) && route !== '/') {
        res = route;
      }
    });

    return res;
  }

  return (
    <Header style={{ width: '100%' }}>
      <Link to="/">
        <div className="logo">
          <h1>Beursfuif</h1>
        </div>
      </Link>
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={[getCurrentPage()]}
        style={{ float: 'right' }}
      >
        {isLoggedIn ? (
          <Menu.Item key="/logout" onClick={() => logout()}>
            <LogoutOutlined />
            <span>Logout</span>
          </Menu.Item>
        ) : (
          <Menu.Item key="/login">
            <Link to="/login">
              <span>
                <UserOutlined />
                <span>Login</span>
              </span>
            </Link>
          </Menu.Item>
        )}
      </Menu>
    </Header>
  );
};

export default Navbar;
