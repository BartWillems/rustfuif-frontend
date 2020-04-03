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

const { TabPane } = Tabs;

const Game = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function (response) {
        setGame(response.data);
      })
      .catch(function (error) {
        console.log(error);
        console.log(error.response);
        message.error(`Unable to load game: ${error.response}`);
      })
      .finally(function () {
        setLoading(false);
      });
  }, [gameId]);

  return (
    <>
      <PageHeader
        className="site-page-header"
        onBack={() => history.push('/games')}
        title={game.name}
      />
      <Tabs defaultActiveKey="prices" type="card">
        <TabPane
          tab={
            <span>
              <EuroOutlined />
              Prices
            </span>
          }
          key="prices"
        >
          <Prices gameId={gameId} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <UserOutlined />
              Participants
            </span>
          }
          key="participants"
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
          key="stats"
        >
          <h1>Todo</h1>
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
        console.log(error);
        message.error(`unable to load participants: ${error.response}`);
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

const Prices = ({ gameId }) => {
  const data = [
    {
      title: 'Orval',
    },
    {
      title: 'Duvel',
    },
    {
      title: 'Dink',
    },
    {
      title: 'Pintje',
    },
    {
      title: 'Title 5',
    },
    {
      title: 'Title 6',
    },
    {
      title: 'Title 7',
    },
    {
      title: 'Title 8',
    },
  ];
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
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Card
            hoverable
            cover={
              <img
                alt="example"
                src="https://img.saveur-biere.com/img/p/81-14420-thickbox.jpg"
                style={{ maxHeight: '400px', objectFit: 'cover', padding: '1Opx' }}
              />
            }
            actions={[
              <SettingOutlined key="setting" />,
              <EditOutlined key="edit" />,
              <EuroCircleTwoTone key="sale" twoToneColor="#52c41a" />,
            ]}
          >
            <Card
              title={item.title}
              bordered={false}
              cover={
                <ul style={{ float: 'left' }}>
                  <li>Min Price: €1</li>
                  <li>Max Price: €5</li>
                </ul>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Game;
