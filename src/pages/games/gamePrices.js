import React, { useState } from 'react';
import { message, Card, List, Modal, Form, Input, InputNumber, Button } from 'antd';
import { SettingOutlined, EuroCircleTwoTone } from '@ant-design/icons';
import ApiClient from '../../helpers/Api';

const { Meta } = Card;

const Prices = ({ gameId, offsets, beverages, getBeverages }) => {
  const [editBeverage, setEditBeverage] = useState(false);

  // return the next possible beverage slot_no
  function nextSlot() {
    let next = 0;

    for (let i = 0; i < beverages.length; i++) {
      if (!beverages[i]) {
        return next;
      }

      next += 1;
    }
    return next;
  }

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
      <EditBeverage
        gameId={gameId}
        beverage={editBeverage}
        setVisible={setEditBeverage}
        nextSlot={nextSlot}
        getBeverages={getBeverages}
      />
    </>
  );
};

const EditBeverage = ({ gameId, beverage, setVisible, nextSlot, getBeverages }) => {
  async function setBeverageConfig(beverage) {
    beverage.slot_no = nextSlot();
    beverage.starting_price = beverage.starting_price * 100;
    beverage.min_price = beverage.min_price * 100;
    beverage.max_price = beverage.max_price * 100;

    return ApiClient.post(`/games/${gameId}/beverages`, beverage)
      .then(function (response) {
        console.log(response);
        getBeverages();
        setVisible(false);
      })
      .catch(function (error) {
        message.error(`Error: ${error.response?.data || 'unknown error occured'}`);
      });
  }

  return (
    <Modal
      title="Configure Beverage"
      visible={!!beverage}
      okText="submit"
      onCancel={() => setVisible(false)}
      destroyOnClose={true}
      footer={null}
    >
      <Form
        ref={null}
        name="control-ref"
        onFinish={setBeverageConfig}
        initialValues={{
          name: beverage?.name,
          image_url: beverage?.image_url,
          min_price: beverage?.min_price / 100 || '',
          max_price: beverage?.max_price / 100 || '',
          starting_price: beverage?.starting_price / 100 || '',
        }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="image_url" label="Image URL" rules={[{ required: false }]}>
          <Input />
        </Form.Item>

        <Form.Item name="min_price" label="Min. Price" rules={[{ required: true }]}>
          <InputNumber step={0.1} precision={2} />
        </Form.Item>

        <Form.Item name="max_price" label="Max. Price" rules={[{ required: true }]}>
          <InputNumber step={0.1} precision={2} />
        </Form.Item>

        <Form.Item name="starting_price" label="Initial Price" rules={[{ required: true }]}>
          <InputNumber step={0.1} precision={2} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Prices;
