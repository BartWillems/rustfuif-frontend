import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  message,
  Alert,
  Table,
  Tag,
  PageHeader,
  Tabs,
  Button,
  Divider,
  Modal,
  Select,
  Spin,
  Form,
} from 'antd';
import {
  EuroOutlined,
  UserOutlined,
  AreaChartOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import ApiClient from '../../helpers/Api';
import { getUser } from '../../helpers/Session';
import Stats from './gameStats';
import Prices from './gamePrices';
import TransactionTimeline from './gameTimeline';
import { getStatus } from './gameList';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

const WebsocketURI =
  process.env.REACT_APP_WS_URL ||
  ((window.location.protocol === 'https:' && 'wss://') || 'ws://') + window.location.host + '/ws';

const Game = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [offsets, setSaleOffsets] = useState([]);
  const [beverages, setBeverages] = useState([]);
  const [info, setInfo] = useState('');
  const [isConnected, setConnected] = useState(true);
  const history = useHistory();

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function (response) {
        setGame(response.data);
        const status = getStatus(moment.now(), response.data);
        setInfo(status);
      })
      .catch(function (error) {
        message.error(
          'unable to load game: ' + error.response?.statusText || 'unexpected error occured'
        );
        history.push('/');
      });
  }, [gameId, history]);

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

  function getBeverages() {
    ApiClient.get(`/games/${gameId}/beverages`)
      .then(function (response) {
        let beverages = response.data;
        for (let i = 0; i < 8; i++) {
          if (!beverages[i]) {
            beverages[i] = {};
          }
        }
        setBeverages(beverages);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`unable to fetch the beverages: ${msg}`);
      });
  }

  useEffect(getBeverages, [game]);

  useEffect(() => {
    if (Object.keys(game).length === 0) return;

    const errorKey = 'ws-reconnect';

    let conn = new WebSocket(`${WebsocketURI}/${gameId}`);

    conn.onopen = () => {
      setConnected(true);
    };

    conn.onmessage = update => {
      const { offsets } = JSON.parse(update.data);
      setSaleOffsets(offsets);
    };

    conn.onerror = error => {
      console.log(error);
      message.error({
        content: 'Connection lost, please check your connection',
        errorKey,
      });
      setConnected(false);
    };

    conn.onclose = msg => {
      if (!msg.wasClean) {
        message.error({
          content: 'Connection lost, please check your connection',
          errorKey,
        });
        setConnected(false);
      }
      console.log('websocket is closed');
      console.log(msg);
    };

    return () => {
      if (conn && conn.close) {
        conn.close(1000);
      }
    };
  }, [gameId, game]);

  if (Object.keys(game).length === 0) {
    return <Spin />;
  }

  return (
    <>
      <PageHeader onBack={() => history.push('/')} title={game.name} subTitle={info} />
      {!isConnected && (
        <Alert
          message="Error"
          type="error"
          description="Connection to the server lost, please reload  your page."
          showIcon
        />
      )}

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
          <Participants game={game} />
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
        <TabPane
          tab={
            <span>
              <FundProjectionScreenOutlined />
              Timeline
            </span>
          }
          key="#timeline"
        >
          <TransactionTimeline gameId={gameId} shouldUpdate={offsets} beverages={beverages} />
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

const Participants = ({ game }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteUser, showInviteUser] = useState(false);

  function loadParticipants() {
    ApiClient.get(`/games/${game.id}/users`)
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
  }

  useEffect(loadParticipants, [game]);

  return (
    <>
      <Table
        className="user-list"
        columns={ParticipantColumns}
        dataSource={participants}
        loading={loading}
        rowKey={user => user.user_id}
        pagination={false}
      />

      {getUser()?.id === game.owner_id && (
        <Divider>
          <Button type="primary" onClick={() => showInviteUser(true)}>
            Invite user
          </Button>
        </Divider>
      )}

      <InviteUser
        isOpen={inviteUser}
        setVisible={showInviteUser}
        reload={loadParticipants}
        gameId={game.id}
      />
    </>
  );
};

Participants.propTypes = {
  game: PropTypes.any.isRequired,
};

const InviteUser = ({ isOpen, setVisible, gameId, reload }) => {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [users, setUsers] = useState([]);

  function searchUsers() {
    if (!isOpen) {
      return;
    }
    setLoading(true);
    ApiClient.get(`/games/${gameId}/available-users`)
      .then(function (response) {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  useEffect(searchUsers, [gameId, isOpen]);

  function invite(values) {
    setInviting(true);
    ApiClient.post(`/games/${gameId}/invitations`, values)
      .then(function (response) {
        console.log(response);
        setVisible(false);
        reload();
      })
      .catch(function (error) {
        if (error.response?.status === 409) {
          message.error('user is already invited');
        } else {
          message.error('unable to invite user');
        }
      })
      .finally(function () {
        setInviting(false);
      });
  }

  return (
    <Modal title="Invite User" visible={isOpen} onCancel={() => setVisible(false)} footer={null}>
      <Form onFinish={invite}>
        <Form.Item label="Username" name="user_id" rules={[{ required: true }]}>
          <Select
            showSearch
            placeholder="Select user"
            loading={loading}
            defaultActiveFirstOption={false}
            disabled={!loading && users.length === 0}
            notFoundContent={loading ? <Spin size="small" /> : []}
            style={{ width: '100%' }}
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {users.map(user => (
              <Option key={user.id} value={user.id}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={inviting}>
            invite
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Game;
