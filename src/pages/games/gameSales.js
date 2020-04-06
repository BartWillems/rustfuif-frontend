import React, { useState, useEffect } from 'react';
import { message, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ApiClient from '../../helpers/Api';

const { Title } = Typography;

const Sales = ({ gameId, shouldUpdate }) => {
  const [sales, setSales] = useState([]);

  async function getSales() {
    await ApiClient.get(`/games/${gameId}/prices`)
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
      <Title style={{ textAlign: 'center' }}>Sales</Title>
      <BarChart
        width={600}
        height={300}
        data={sales}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="slot_no" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Sales;
