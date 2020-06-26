import React, { useState, useEffect } from 'react';
import { message, List } from 'antd';
import ApiClient from '../../helpers/Api';
import Moment from 'moment';

const TransactionTimeline = ({ gameId, shouldUpdate, beverages }) => {
  const [transactions, setTransactions] = useState([{}]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    ApiClient.get(`/games/${gameId}/stats/transactions`)
      .then(function (response) {
        setTransactions(response.data);
        let total = 0;
        response.data.forEach(transaction => {
          total += transaction.price * transaction.amount;
        });
        setTotal(total);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`unable to fetch stats: ${msg}`);
      });
  }, [gameId, shouldUpdate]);

  return (
    <List
      itemLayout="horizontal"
      dataSource={transactions}
      header={`Total: €${(total / 100).toFixed(2)}`}
      renderItem={transaction => (
        <List.Item extra={Moment(transaction.created_at).format('HH:mm:ss')}>
          <List.Item.Meta
            title={`${transaction.amount}x ${beverages[transaction.slot_no]?.name} (€${(
              transaction.price / 100
            ).toFixed(2)})`}
            description={`€${((transaction.price * transaction.amount) / 100).toFixed(2)}`}
          />
        </List.Item>
      )}
    />
  );
};

export default TransactionTimeline;
