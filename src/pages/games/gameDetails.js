import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { message, Table, Tag, PageHeader, Tabs } from 'antd';
import { EuroOutlined, UserOutlined, AreaChartOutlined } from '@ant-design/icons';
import ApiClient from '../../helpers/Api';
import Stats from './gameStats';
import Prices from './gamePrices';
import { getStatus } from './gameList';
import moment from 'moment';

const { TabPane } = Tabs;

const WebsocketURI =
  process.env.REACT_APP_WS_URL ||
  ((window.location.protocol === 'https:' && 'wss://') || 'ws://') + window.location.host + '/ws';

const Game = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [offsets, setSaleOffsets] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [info, setInfo] = useState('');
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

  useEffect(() => {
    if (game === {}) {
      return;
    }
    const status = getStatus(moment.now(), game);
    setInfo(status);
  }, [game]);

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
      });
  }, [gameId]);

  useEffect(() => {
    getBeverages();
  }, [setSaleOffsets]);

  useEffect(() => {
    let conn = new WebSocket(`${WebsocketURI}/${gameId}`);
    conn.onmessage = update => {
      const { offsets } = JSON.parse(update.data);
      setSaleOffsets(offsets);
    };

    // TODO: recconect on failure?
    conn.onclose = msg => {
      console.log('websocket is closed');
      console.log(msg);
    };

    return () => {
      conn.close();
    };
  }, [gameId]);

  return (
    <>
      <PageHeader onBack={() => history.push('/games')} title={game.name} subTitle={info} />
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
          <Prices
            gameId={gameId}
            offsets={offsets}
            beverages={beverages}
            getBeverages={getBeverages}
          />
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

export default Game;
