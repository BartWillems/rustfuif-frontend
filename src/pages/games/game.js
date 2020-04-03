import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { message, Row, Col, Table, Tag, PageHeader } from 'antd';
import ApiClient from '../../helpers/Api';

const Game = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    ApiClient.get(`/games/${gameId}`)
      .then(function(response) {
        setGame(response.data);
      })
      .catch(function(error) {
        console.log(error);
        console.log(error.response);
        message.error(`Unable to load game: ${error.response}`);
      })
      .finally(function() {
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
      <Row>
        <Col span={24}>
          <h1>Participants</h1>
          <Participants gameId={gameId} />
        </Col>
      </Row>
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
      .then(function(response) {
        setParticipants(response.data);
      })
      .catch(function(error) {
        console.log(error);
        message.error(`unable to load participants: ${error.response}`);
      })
      .finally(function() {
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
