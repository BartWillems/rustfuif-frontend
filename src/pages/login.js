import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Form, Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ApiClient from '../helpers/Api';
import AuthenticationContext from '../global';

const Login = () => {
  const [, setIsLoggedIn] = React.useContext(AuthenticationContext);
  const history = useHistory();

  const onFinish = values => {
    ApiClient.post('/login', values)
      .then(function(response) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setIsLoggedIn(true);
        history.push('/games');
      })
      .catch(function(error) {
        message.error('invalid credentials');
        console.log(error);
      });
  };

  return (
    <Form
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your Username!',
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <br />
        <Link to="/forgot/password/lol">Forgot password? Sucks to be you!</Link>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" className="login-form-button">
          Log in
        </Button>
        <br />
        <br />
        <Link to="/register">Or register now!</Link>
      </Form.Item>
    </Form>
  );
};
export default Login;
