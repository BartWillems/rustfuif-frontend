import React from 'react';
import { message, Table } from 'antd';
import Moment from 'moment';

const GAMES_URL = `${process.env.REACT_APP_API_URL}/games`;

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => <strong>{text}</strong>,
  },
  {
    title: 'Owner ID',
    dataIndex: 'owner_id',
    key: 'owner_id',
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

class GamesList extends React.Component {
  state = {
    games: [],
    loading: false,
  };

  componentDidMount = async () => {
    this.loadGames().catch(function(error) {
      console.log(`unable to load games: ${error}`);
      message.warning('unable to load the games');
    });
    this.setState({ loading: false });
  };

  loadGames = async () => {
    this.setState({ loading: true });
    const response = await fetch(GAMES_URL);
    const resp = await response.json();

    const now = Moment.now();

    const games = resp.map(game => ({
      duration: getDuration(game),
      status: getStatus(now, game),
      ...game,
    }));

    this.setState({ games });
  };

  render() {
    return (
      <Table
        className="game-list"
        columns={columns}
        dataSource={this.state.games}
        loading={this.state.loading}
        rowKey="id"
      />
    );
  }
}

function Games() {
  return <GamesList />;
}

export default Games;
