import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Table, PageHeader, Button, Modal } from 'antd';
import { Form, Input, DatePicker, Slider } from 'antd';
import Moment from 'moment';
import ApiClient from '../../helpers/Api';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <strong>{text}</strong>,
  },
  {
    title: 'Owner',
    dataIndex: 'owner',
    key: 'owner',
    render: owner => owner.username,
  },
  {
    title: 'Start Time',
    dataIndex: 'start_time',
    key: 'start_time',
    render: date => `${Moment(date).format('YYYY/MM/DD HH:mm')}`,
  },
  {
    title: 'Close Time',
    dataIndex: 'close_time',
    key: 'close_time',
    render: date => `${Moment(date).format('YYYY/MM/DD HH:mm')}`,
  },
  {
    title: 'Duration',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

function getStatus(now, game) {
  if (now > Moment(game.close_time)) {
    return 'Finished';
  }

  if (now > Moment(game.start_time)) {
    return 'In Progress';
  }

  return 'Not Started';
}

function getDuration(game) {
  const diff = Moment(game.close_time).diff(Moment(game.start_time));

  return Moment.duration(diff).humanize();
}

const Gamelist = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createGameMenu, showCreateGame] = useState(false);

  async function loadGames() {
    let games = [];

    await ApiClient.get('/games?completed=false')
      .then(function (response) {
        games = response.data;
      })
      .catch(function (error) {
        throw new Error(error.response?.statusText || 'unexpected error occured');
      });

    const now = Moment.now();

    const gamesMapped = games.map(game => ({
      duration: getDuration(game),
      status: getStatus(now, game),
      ...game,
    }));

    setGames(gamesMapped);
  }

  useEffect(() => {
    loadGames().catch(function (error) {
      message.error(`Unable to load games: ${error.message}`);
    });

    setLoading(false);
  }, []);

  const history = useHistory();

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Games"
        extra={[
          <Button key="1" type="primary" onClick={() => showCreateGame(true)}>
            Create Game
          </Button>,
        ]}
      />
      <Table
        className="game-list"
        columns={columns}
        dataSource={games}
        loading={loading}
        rowKey="id"
        onRow={game => {
          return {
            onClick: () => history.push(`/games/${game.id}`),
          };
        }}
      />

      <CreateGame open={createGameMenu} setVisible={showCreateGame} loadGames={loadGames} />
    </>
  );
};

const CreateGame = ({ open, setVisible, loadGames }) => {
  const [loading, setLoading] = useState(false);
  async function createGame(game) {
    setLoading(true);
    game.close_time = Moment(game.start_time).add(game.duration, 'minutes');

    await ApiClient.post('/games', game)
      .then(function () {
        loadGames().catch(function (error) {
          message.error(`Unable to load games: ${error.message}`);
        });
        message.success(`Successfully created ${game.name}`);
        setVisible(false);
      })
      .catch(function (error) {
        message.error(`Error: ${error.response?.data || 'unknown error occured'}`);
        console.log(error.response);
      })
      .finally(function () {
        setLoading(false);
      });
  }

  return (
    <Modal title="Create Game" visible={open} onCancel={() => setVisible(false)} footer={null}>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={createGame}
        initialValues={{
          start_time: Moment().seconds(0).add(2, 'minutes'),
          duration: 30,
        }}
      >
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Start Time" name="start_time" rules={[{ required: true }]}>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="Duration" required name="duration">
          <Slider
            min={30}
            max={240}
            step={30}
            dots={true}
            marks={{
              30: '30 Minutes',
              120: '2 Hours',
              240: '4 Hours',
            }}
            tipFormatter={val => `${val} minutes`}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Gamelist;
