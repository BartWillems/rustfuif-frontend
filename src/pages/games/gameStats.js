import React, { useState, useEffect } from 'react';
import { message, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import ApiClient from '../../helpers/Api';

const { Title } = Typography;

async function getStats(gameId, query) {
  return ApiClient.get(`/games/${gameId}/stats/${query}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      let msg = error.response?.statusText || 'unexpected error occured';
      message.error(`unable to fetch stats: ${msg}`);
    });
}

export const SalesChart = ({ gameId, shouldUpdate, beverages }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getStats(gameId, 'sales').then(sales => {
      for (let i = 0; i < sales?.length; i++) {
        sales[i].name = beverages[i]?.name || 'unconfigured';
      }
      setSales(sales);
    });
  }, [gameId, shouldUpdate, beverages]);

  return (
    <div style={{ width: 600 }}>
      <Title style={{ textAlign: 'center' }}>Beverage Sales</Title>
      <BarChart
        width={600}
        height={300}
        data={sales}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export const UserSalesChart = ({ gameId, shouldUpdate }) => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    getStats(gameId, 'users').then(sales => {
      setSales(sales);
    });
  }, [gameId, shouldUpdate]);

  return (
    <div style={{ width: 600 }}>
      <Title style={{ textAlign: 'center' }}>User Sales</Title>
      <BarChart
        width={600}
        height={300}
        data={sales}
        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="username" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

const Stats = ({ gameId, shouldUpdate, beverages }) => {
  return (
    <>
      <SalesChart gameId={gameId} shouldUpdate={shouldUpdate} beverages={beverages} />
      <UserSalesChart gameId={gameId} shouldUpdate={shouldUpdate} />
    </>
  );
};

export default Stats;
