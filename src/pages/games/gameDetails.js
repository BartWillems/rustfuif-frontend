import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { message, Table, Tag, PageHeader, Card, List, Tabs } from 'antd';
import {
  EditOutlined,
  SettingOutlined,
  EuroCircleTwoTone,
  EuroOutlined,
  UserOutlined,
  AreaChartOutlined,
} from '@ant-design/icons';
import ApiClient from '../../helpers/Api';
import { Stats } from './gameSales';

const { TabPane } = Tabs;
const { Meta } = Card;

const Game = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);
  const [offsets, setSaleOffsets] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const history = useHistory();

  useEffect(() => {
    ApiClient.get(`/games/${gameId}/stats/offsets`)
      .then(function (response) {
        setSaleOffsets(response.data);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`unable to fetch the price offsets: ${msg}`);
      });
  }, [gameId]);

  async function getBeverages() {
    await ApiClient.get(`/games/${gameId}/beverages`)
      .then(function (response) {
        let beverages = response.data;
        for (let i = 0; i < 8; i++) {
          if (!beverages[i]) {
            beverages[i] = false;
          }
        }
        setBeverages(beverages);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`unable to fetch the beverages: ${msg}`);
      });
  }

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function (response) {
        setGame(response.data);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`Unable to load game: ${msg}`);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [gameId]);

  useEffect(() => {
    getBeverages();
  }, [setSaleOffsets]);

  useEffect(() => {
    let conn = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL}/${gameId}`);
    conn.onmessage = update => {
      const { offsets } = JSON.parse(update.data);
      console.log(offsets);
      setSaleOffsets(offsets);
    };

    // TODO: recconect on failure?
    conn.onclose = msg => {
      console.log(msg);
      message.error('Connection with the server is lost, please reload your page.');
    };

    return () => {
      conn.close();
    };
  }, [gameId]);

  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push('/games')}
        title={game.name}
      />
      <Tabs
        defaultActiveKey={window.location.hash || '#prices'}
        type="card"
        onChange={tabKey => {
          window.location.hash = tabKey;
        }}
        style={{ padding: '10px' }}
      >
        <TabPane
          tab={
            <span>
              <EuroOutlined />
              Prices
            </span>
          }
          key="#prices"
        >
          <Prices gameId={gameId} offsets={offsets} beverages={beverages} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Participants
            </span>
          }
          key="#participants"
        >
          <Participants gameId={gameId} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AreaChartOutlined />
              Stats
            </span>
          }
          key="#stats"
        >
          <Stats gameId={gameId} shouldUpdate={offsets} beverages={beverages} />
        </TabPane>
      </Tabs>
    </>
  );
};

const ParticipantStates = {
  ACCEPTED: 'green',
  PENDING: 'orange',
  DECLINED: 'red',
};

const ParticipantColumns = [
  {
    title: 'Name',
    dataIndex: 'username',
    key: 'name',
  },
  {
    title: 'Status',
    dataIndex: 'invitation_state',
    key: 'state',
    render: state => <Tag color={ParticipantStates[state]}> {state.toLowerCase()} </Tag>,
  },
];

const Participants = ({ gameId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get(`/games/${gameId}/users`)
      .then(function (response) {
        setParticipants(response.data);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`unable to load participants: ${msg}`);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [gameId]);

  return (
    <Table
      className="user-list"
      columns={ParticipantColumns}
      dataSource={participants}
      loading={loading}
      rowKey={user => user.user_id}
      pagination={false}
    />
  );
};

Participants.propTypes = {
  gameId: PropTypes.any.isRequired,
};

const Prices = ({ gameId, offsets, beverages }) => {
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
    })
      .then(function (response) {
        console.log('succesful sale');
      })
      .catch(function (response) {
        console.log(response);
        message.error('unable to create sale');
      });
  }

  return (
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
                alt="beverage cover photo"
                style={{ height: '200px', width: '100%', objectFit: 'cover' }}
                src={
                  beverage.image_url ||
                  'https://raw.githubusercontent.com/BartWillems/rustfuif/55b1c4aa34749bde02f56c06b9c6406fe2ad59d2/logo.png'
                }
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              // <EditOutlined key="edit" />,
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
    />
  );
};

export default Game;
