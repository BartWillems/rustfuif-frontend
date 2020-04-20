import React, { useState, useEffect } from 'react';
import { message, Table, PageHeader } from 'antd';
import Moment from 'moment';
import ApiClient from '../helpers/Api';

const columns = [
  {
    title: 'From',
    dataIndex: 'game',
    key: 'from',
    render: game => <strong>{game.owner.username}</strong>,
  },
  {
    title: 'Game',
    dataIndex: 'game',
    key: 'game',
    render: game => game.name,
  },
  {
    title: 'Start Time',
    dataIndex: 'game',
    key: 'start_time',
    render: game => `${Moment(game.start_time).format('YYYY/MM/DD HH:mm')}`,
  },
  {
    title: 'Close Time',
    dataIndex: 'game',
    key: 'close_time',
    render: game => `${Moment(game.start_time).format('YYYY/MM/DD HH:mm')}`,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ApiClient.get('/invitations')
      .then(function (response) {
        setInvitations(response.data);
      })
      .catch(function (error) {
        message.error(`Unable to load invites: ${error.message}`);
      });

    setLoading(false);
  }, []);

  return (
    <>
      <PageHeader className="site-page-header" title="Invitations" />
      <Table
        columns={columns}
        dataSource={invitations}
        loading={loading}
        rowKey={invitation => invitation.game.id}
      />
    </>
  );
};

export default Invitations;
