import React, { useState, useEffect } from 'react';
import { message, Table, PageHeader, Radio, List, Card, Switch, Divider } from 'antd';
import {
  ClockCircleOutlined,
  UserOutlined,
  CheckCircleTwoTone,
  StopTwoTone,
  MailOutlined,
  HourglassOutlined,
  CheckOutlined,
  StopOutlined,
} from '@ant-design/icons';
import Moment from 'moment';
import ApiClient from '../helpers/Api';
import { getStatus } from './games/gameList';
import { InvitationStates } from '../helpers/Constants';

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
    dataIndex: 'state',
    key: 'state',
    render: state => (
      <Radio.Group value={state} onChange={console.log}>
        <Radio.Button value="ACCEPTED">Accept</Radio.Button>
        <Radio.Button value="DECLINED" danger>
          Decline
        </Radio.Button>
        {/* <Radio.Button value="PENDING">Pending</Radio.Button> */}
      </Radio.Group>
    ),
  },
];

const Invitations = ({ shouldUpdate, triggerUpdate }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardView, setCardView] = useState(true);

  function getInvitations() {
    setLoading(true);
    ApiClient.get('/invitations')
      .then(function (response) {
        setInvitations(response.data);
      })
      .catch(function (error) {
        message.error(`Unable to load invites: ${error.message}`);
      });

    setLoading(false);
  }

  useEffect(getInvitations, [shouldUpdate]);

  function respond(invitation, answer) {
    ApiClient.post(`/invitations/${invitation.id}/${answer}`)
      .then(function (response) {
        console.log(response);
        triggerUpdate();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function getInvitationIcon(state) {
    switch (state) {
      case InvitationStates.ACCEPTED:
        return (
          <span>
            accepted &nbsp;
            <CheckOutlined />
          </span>
        );
      case InvitationStates.PENDING:
        return (
          <span>
            pending &nbsp;
            <HourglassOutlined />
          </span>
        );
      case InvitationStates.DECLINED:
        return (
          <span>
            declined &nbsp;
            <StopOutlined />
          </span>
        );
      default:
        console.log(`received invalid invitation state: ${state}`);
    }
  }

  const cardList = (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 6,
      }}
      dataSource={invitations}
      loading={loading}
      pagination={true}
      renderItem={invitation => (
        <List.Item>
          <Card
            hoverable
            title={invitation.game.name}
            extra={getInvitationIcon(invitation.state)}
            actions={[
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                key="accept"
                onClick={() => respond(invitation, InvitationStates.ACCEPTED)}
              />,
              <StopTwoTone
                twoToneColor="#dd1313"
                key="decline"
                onClick={() => respond(invitation, InvitationStates.DECLINED)}
              />,
            ]}
          >
            <UserOutlined /> <strong>{invitation.game.owner.username}</strong>
            <Divider />
            <ClockCircleOutlined /> <strong> {getStatus(Moment.now(), invitation.game)} </strong>
          </Card>
        </List.Item>
      )}
    />
  );

  const tableList = (
    <Table
      columns={columns}
      dataSource={invitations}
      loading={loading}
      rowKey={invitation => invitation.game.id}
    />
  );

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Invitations"
        extra={
          <div>
            <label>Card View &nbsp;</label>
            <Switch checked={cardView} onChange={setCardView} />
          </div>
        }
        avatar={{ icon: <MailOutlined /> }}
      />
      {cardView ? cardList : tableList}
    </>
  );
};

export default Invitations;
