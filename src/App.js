import React from 'react';
import './App.css';
import { Layout, Breadcrumb } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import NavBar from './Nav/Navbar';
import Router from './Router';

const { Content, Footer } = Layout;

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Layout style={{ minHeight: '100vh' }}>
            <NavBar />
            <Layout className="site-layout">
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Games</Breadcrumb.Item>
                  <Breadcrumb.Item>JK Zomaar Drinkoff</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                  <Router />
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>Rustfuif</Footer>
            </Layout>
          </Layout>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
