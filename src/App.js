import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import { Layout, Spin } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import NavBar from './Nav/Navbar';
import Router from './Router';
import ApiClient from './helpers/Api';

const { Content, Footer } = Layout;

const App = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    ApiClient.get(`/verify-session`)
      .then(function (response) {
        setLoading(false);
      })
      .catch(function (error) {
        history.push('/login');
      })
      .finally(function () {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {(!loading && (
        <Layout className="site-layout">
          <NavBar />
          <Content style={{ padding: '24px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <Router />
            </div>
          </Content>
          <Footer
            style={{
              textAlign: 'center',
              position: 'fixed',
              width: '100%',
              bottom: '0',
              left: '0',
            }}
          >
            <a href="https://github.com/BartWillems/rustfuif-frontend">
              <GithubOutlined /> Source Code
            </a>
          </Footer>
        </Layout>
      )) || (
        <div
          style={{
            margin: '20px 0',
            textAlign: 'center',
            marginBottom: '20px',
            padding: '30px 50px',
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default App;
