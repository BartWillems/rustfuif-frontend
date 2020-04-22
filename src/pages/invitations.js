import React, { useState, useEffect } from 'react';
import { message, PageHeader, List, Card, Divider } from 'antd';
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

const Invitations = ({ shouldUpdate, triggerUpdate }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <>
      <PageHeader
        className="site-page-header"
        title="Invitations"
        avatar={{ icon: <MailOutlined /> }}
      />
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
    </>
  );
};

export default Invitations;
