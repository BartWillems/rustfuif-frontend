import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import './App.css';
import { Layout, Spin } from 'antd';

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
    <div className="App">
      {(!loading && (
        <Layout style={{ minHeight: '100vh' }}>
          <NavBar />
          <Layout className="site-layout">
            <Content style={{ margin: '16px 0 16px 16px' }}>
              <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                <Router />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Rustfuif</Footer>
          </Layout>
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
