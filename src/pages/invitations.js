import React, { useState, useEffect } from 'react';
import { message, PageHeader, List, Card, Divider, Tabs } from 'antd';
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

const InvitationCards = ({ invitations, loading, respond }) => {
  return (
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
};

const Invitations = ({ shouldUpdate, triggerUpdate }) => {
  const [invitations, setInvitations] = useState({
    [InvitationStates.PENDING]: [],
    [InvitationStates.ACCEPTED]: [],
    [InvitationStates.DECLINED]: [],
  });
  const [loading, setLoading] = useState(true);

  function getInvitations() {
    setLoading(true);
    ApiClient.get('/invitations')
      .then(function (response) {
        const invitations = {
          [InvitationStates.PENDING]: [],
          [InvitationStates.ACCEPTED]: [],
          [InvitationStates.DECLINED]: [],
        };

        response.data.forEach(function (invitation) {
          invitations[invitation.state].push(invitation);
        });

        setInvitations(invitations);
      })
      .catch(function (error) {
        message.error(`Unable to load invites: ${error.message}`);
      });

    setLoading(false);
  }

  useEffect(getInvitations, [shouldUpdate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerUpdate();
    }, 30_000);

    return () => clearTimeout(timer);
  });

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

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Invitations"
        avatar={{ icon: <MailOutlined /> }}
      />
      <Tabs defaultActiveKey="pending" type="card" style={{ padding: '15px' }}>
        <Tabs.TabPane
          key="pending"
          tab={
            <span>
              <HourglassOutlined />
              Pending
            </span>
          }
        >
          <InvitationCards
            invitations={invitations[InvitationStates.PENDING]}
            loading={loading}
            respond={respond}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="accepted"
          tab={
            <span>
              <CheckOutlined />
              Accepted
            </span>
          }
        >
          <InvitationCards
            invitations={invitations[InvitationStates.ACCEPTED]}
            loading={loading}
            respond={respond}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          key="declined"
          tab={
            <span>
              <StopOutlined />
              Declined
            </span>
          }
        >
          <InvitationCards
            invitations={invitations[InvitationStates.DECLINED]}
            loading={loading}
            respond={respond}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default Invitations;
