import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  message,
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
import { EuroOutlined, UserOutlined, AreaChartOutlined } from '@ant-design/icons';
import ApiClient from '../../helpers/Api';
import Stats from './gameStats';
import Prices from './gamePrices';
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
  const [inviteUser, showInviteUser] = useState(false);

  function loadParticipants() {
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
  }

  useEffect(loadParticipants, [gameId]);

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
      <Divider>
        <Button type="primary" onClick={() => showInviteUser(true)}>
          Invite user
        </Button>
      </Divider>
      <InviteUser
        isOpen={inviteUser}
        setVisible={showInviteUser}
        reload={loadParticipants}
        gameId={gameId}
      />
    </>
  );
};

Participants.propTypes = {
  gameId: PropTypes.any.isRequired,
};

const InviteUser = ({ isOpen, setVisible, gameId, reload }) => {
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [users, setUsers] = useState([]);

  function searchUsers() {
    setLoading(true);
    ApiClient.get(`/users`)
      .then(function (response) {
        setUsers(response.data);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        setLoading(false);
      });
  }

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
            onFocus={searchUsers}
            defaultActiveFirstOption={false}
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
