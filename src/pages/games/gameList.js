import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { message, Table } from 'antd';
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
    render: date => `${Moment(date).toString()}`,
  },
  {
    title: 'Close Time',
    dataIndex: 'close_time',
    key: 'close_time',
    render: date => `${Moment(date).toString()}`,
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
  );
};

export default Gamelist;
