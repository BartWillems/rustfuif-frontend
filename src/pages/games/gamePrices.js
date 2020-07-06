import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  PageHeader,
  Statistic,
} from 'antd';
import {
  SettingOutlined,
  EuroCircleTwoTone,
  ArrowDownOutlined,
  ArrowUpOutlined,
  MinusOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import ApiClient from '../../helpers/Api';

const { Meta } = Card;

const Prices = ({ gameId, offsets, beverages, getBeverages }) => {
  const [editBeverage, setEditBeverage] = useState(false);
  const [saleBeverages, setBeverages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changeCalculator, setChangeCalculator] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const newBeverages = beverages.map(function (beverage) {
      beverage.sale = 0;
      return beverage;
    });

    setBeverages(newBeverages);
  }, [beverages]);

  // after a purchase, empty the basket
  function reset() {
    const newBeverages = saleBeverages.map(function (beverage) {
      beverage.sale = 0;
      return beverage;
    });
    setBeverages(newBeverages);
  }

  function increment(saleBeverage) {
    const newBeverages = beverages.map(function (beverage) {
      if (!('slot_no' in beverage)) {
        return beverage;
      }
      if (beverage.slot_no === saleBeverage.slot_no) {
        beverage.sale += 1;
      }

      return beverage;
    });

    setBeverages(newBeverages);
  }

  function decrement(saleBeverage) {
    const newBeverages = beverages.map(function (beverage) {
      if (!('slot_no' in beverage)) {
        return beverage;
      }
      if (beverage.slot_no === saleBeverage.slot_no && beverage.sale > 0) {
        beverage.sale -= 1;
      }

      return beverage;
    });

    setBeverages(newBeverages);
  }

  // return the next possible beverage slot_no
  function nextSlot() {
    let next = 0;

    for (let i = 0; i < beverages.length; i++) {
      if (!('slot_no' in beverages[i])) {
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
  async function createSale() {
    setLoading(true);

    const sale = {};
    saleBeverages.forEach(function (beverage) {
      if (beverage.sale > 0 && 'slot_no' in beverage) {
        sale[beverage.slot_no] = beverage.sale;
      }
    });

    message.loading({ content: 'Loading...', key: 'salesMessage' });

    await ApiClient.post(`/games/${gameId}/sales`, sale)
      .then(function (response) {
        message.success({ content: 'succesfully purchased beverages!', key: 'salesMessage' });
        reset();
      })
      .catch(function (response) {
        console.log(response);
        message.error({ content: 'unable purchase beverages', key: 'salesMessage' });
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function hasProfit(beverage) {
    return offsets[beverage.slot_no] >= 0;
  }

  function getSuffix(beverage) {
    if (hasProfit(beverage)) {
      return <ArrowUpOutlined />;
    }
    return <ArrowDownOutlined />;
  }

  function getSalesColor(beverage) {
    if (hasProfit(beverage)) {
      return '#3f8600';
    }

    return '#cf1322';
  }

  function hasSale() {
    return (
      saleBeverages.filter(function (beverage) {
        return beverage.sale > 0;
      }).length === 0
    );
  }

  function calculateTotalPrice() {
    let totalPrice = 0;
    saleBeverages.forEach(function (beverage) {
      if (beverage.sale > 0) {
        let price = calculatePrice(beverage);
        totalPrice += price * beverage.sale;
      }
    });
    setTotalPrice(totalPrice.toFixed(2));
  }

  useEffect(calculateTotalPrice, [saleBeverages]);

  return (
    <>
      <PageHeader
        extra={[
          <Button key="change" disabled={hasSale()} onClick={() => setChangeCalculator(true)}>
            calculate change
          </Button>,
          <Button
            type="primary"
            key="purchase"
            onClick={() => createSale()}
            loading={loading}
            disabled={hasSale()}
          >
            Purchase
          </Button>,
        ]}
        title="Beverages"
        subTitle={totalPrice > 0 && `€${totalPrice}`}
        // TODO: add total price in meta info
      />
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
        dataSource={saleBeverages}
        loading={saleBeverages.length === 0}
        renderItem={beverage => (
          <List.Item>
            <Card
              hoverable
              cover={
                <img
                  alt="beverage cover"
                  style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                  src={beverage.image_url || '/images/stonks.png'}
                />
              }
              actions={[
                <SettingOutlined key="setting" onClick={() => setEditBeverage(beverage || {})} />,
                (beverage.sale > 0 && (
                  <span>
                    <MinusOutlined onClick={() => decrement(beverage)} />
                    &nbsp;{beverage.sale}&nbsp;
                    <PlusOutlined onClick={() => increment(beverage)} />
                  </span>
                )) || <EuroCircleTwoTone key="sale" onClick={() => increment(beverage)} />,
              ]}
            >
              {('slot_no' in beverage && (
                <div className="beverage">
                  <Statistic
                    title={beverage.name}
                    value={calculatePrice(beverage)}
                    valueStyle={{ color: getSalesColor(beverage) }}
                    suffix={getSuffix(beverage)}
                    prefix="€"
                  />
                </div>
              )) || (
                <Meta
                  title="Item not yet configured"
                  style={{ textAlign: 'center', height: '71px' }}
                />
              )}
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
      <ChangeCalculator
        visible={changeCalculator}
        setVisible={setChangeCalculator}
        beverages={saleBeverages}
        calculatePrice={calculatePrice}
      />
    </>
  );
};

async function create(gameId, beverage) {
  return ApiClient.post(`/games/${gameId}/beverages`, beverage);
}

async function update(gameId, beverage) {
  return ApiClient.put(`/games/${gameId}/beverages`, beverage);
}

const EditBeverage = ({ gameId, beverage, setVisible, nextSlot, getBeverages }) => {
  async function setBeverageConfig(config) {
    let action = update;

    if ('slot_no' in beverage) {
      config.slot_no = beverage.slot_no;
    } else {
      config.slot_no = nextSlot();
      action = create;
    }

    // remove the empty image url as that would be an invalid url
    if (!config.image_url?.length) {
      delete config.image_url;
    }

    config.starting_price = Math.round(config.starting_price * 100);
    config.min_price = Math.round(config.min_price * 100);
    config.max_price = Math.round(config.max_price * 100);

    return await action(gameId, config)
      .then(function () {
        getBeverages();
        setVisible(false);
      })
      .catch(function (error) {
        if (error?.response?.status === 409) {
          message.error('The beverages are out of sync, please reload your page.');
        } else {
          message.error(`Error: ${error.response?.data || 'unknown error occured'}`);
        }
        console.log(error.response);
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
          <InputNumber step={0.1} precision={2} formatter={value => `€ ${value}`} min={0} />
        </Form.Item>

        <Form.Item name="max_price" label="Max. Price" rules={[{ required: true }]}>
          <InputNumber step={0.1} precision={2} formatter={value => `€ ${value}`} min={0} />
        </Form.Item>

        <Form.Item name="starting_price" label="Initial Price" rules={[{ required: true }]}>
          <InputNumber step={0.1} precision={2} formatter={value => `€ ${value}`} min={0} />
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

const ChangeCalculator = ({ visible, setVisible, beverages, calculatePrice }) => {
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);

  useEffect(() => {
    let totalPrice = 0;
    beverages.forEach(function (beverage) {
      if (beverage.sale > 0) {
        let price = calculatePrice(beverage);
        totalPrice += price * beverage.sale;
      }
    });
    setTotal(totalPrice.toFixed(2));
  }, [beverages, calculatePrice]);

  return (
    <Drawer
      title="Change"
      placement="right"
      closable={false}
      onClose={() => setVisible(false)}
      visible={visible}
      width={512}
    >
      <strong>Total: €{total}</strong>
      <Form ref={null} name="control-ref">
        <Form.Item name="min_price" label="Customer money" rules={[{ required: true }]}>
          <InputNumber
            step={0.1}
            precision={2}
            formatter={value => `€ ${value}`}
            width="100%"
            min={0}
            onChange={customerMoney => setChange((customerMoney - total).toFixed(2))}
          />
        </Form.Item>
      </Form>
      <strong>Change: €{change}</strong>
    </Drawer>
  );
};

export default Prices;
