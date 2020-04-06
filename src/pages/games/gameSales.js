import React, { useState, useEffect } from 'react';
import { message, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ApiClient from '../../helpers/Api';

const { Title } = Typography;

export const SalesChart = ({ gameId, shouldUpdate, title, query, dataKey, color }) => {
  const [sales, setSales] = useState([]);

  async function getSales() {
    await ApiClient.get(`/games/${gameId}/stats/${query}`)
      .then(function (response) {
        setSales(response.data);
      })
      .catch(function (error) {
        let msg = error.response?.statusText || 'unexpected error occured';
        message.error(`unable to fetch the prices: ${msg}`);
      });
  }

  useEffect(() => {
    getSales();
  }, [gameId, shouldUpdate]);

  return (
    <div style={{ width: 600 }}>
      <Title style={{ textAlign: 'center' }}>{title}</Title>
      <BarChart
        width={600}
        height={300}
        data={sales}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill={color} />
      </BarChart>
    </div>
  );
};

export const Stats = ({ gameId, shouldUpdate }) => {
  return (
    <>
      <SalesChart
        gameId={gameId}
        shouldUpdate={shouldUpdate}
        title="Total Beverage Sales"
        query="sales"
        dataKey="slot_no"
        color="#8884d8"
      />
      <SalesChart
        gameId={gameId}
        shouldUpdate={shouldUpdate}
        title="Total User Sales"
        query="users"
        dataKey="username"
        color="#82ca9d"
      />
    </>
  );
};
