import React from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button, message, PageHeader } from 'antd';
import ApiClient from '../helpers/Api';

const Register = () => {
  const history = useHistory();

  const onFinish = values => {
    ApiClient.post('/register', values)
      .then(function () {
        history.push('/login');
      })
      .catch(function (error) {
        if (error?.response?.status === 409) {
          message.error('username already exists');
        } else {
          message.error(error?.response?.data || 'unexpected error occured');
        }

        console.dir(error);
      });
  };

  return (
    <>
      <PageHeader onBack={() => history.push('/login')} title="Login" />
      <Form
        className="register-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Register
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default Register;
