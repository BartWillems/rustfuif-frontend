import React, { useState } from 'react';
import { message, Card, List, Modal } from 'antd';
import { Form, Input, Button, Select } from 'antd';
import { SettingOutlined, EuroCircleTwoTone } from '@ant-design/icons';
import ApiClient from '../../helpers/Api';

const { Meta } = Card;

const Prices = ({ gameId, offsets, beverages }) => {
  const [editBeverage, setEditBeverage] = useState(null);

  function calculatePrice(beverage) {
    let offset = offsets[beverage.slot_no];
    let price = beverage.starting_price + offset * 5;
    if (price > beverage.max_price) {
      price = beverage.max_price;
    }

    if (price < beverage.min_price) {
      price = beverage.min_price;
    }

    return (price / 100).toFixed(2);
  }

  // exists currently only for debugging purposes
  // the interface should be better
  async function createSale(beverage) {
    if (!beverage) {
      return;
    }

    await ApiClient.post(`/games/${gameId}/sales`, {
      [beverage.slot_no]: 1,
    }).catch(function (response) {
      console.log(response);
      message.error('unable to create sale');
    });
  }

  return (
    <>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
          xxl: 8,
        }}
        dataSource={beverages}
        loading={!beverages}
        renderItem={beverage => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt="beverage cover"
                  style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  src={
                    beverage.image_url ||
                    'https://raw.githubusercontent.com/BartWillems/rustfuif/55b1c4aa34749bde02f56c06b9c6406fe2ad59d2/logo.png'
                  }
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => setEditBeverage(beverage || {})} />,
                <EuroCircleTwoTone key="sale" onClick={() => createSale(beverage)} />,
              ]}
            >
              <Meta
                style={{ textAlign: 'center', height: '60px' }}
                title={(beverage && beverage.name) || 'Item not yet configured'}
                description={beverage && `€${calculatePrice(beverage)}`}
              />
            </Card>
          </List.Item>
        )}
      ></List>
      <Modal
        title="Configure Beverage"
        visible={!!editBeverage}
        okText="submit"
        onOk={() => setEditBeverage(null)}
        onCancel={() => setEditBeverage(null)}
        destroyOnClose={true}
      >
        {console.log(editBeverage)}
        <Form ref={null} name="control-ref" onFinish={null}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input defaultValue={editBeverage?.name || null} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Prices;
