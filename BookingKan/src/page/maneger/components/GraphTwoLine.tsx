import React from "react";
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Line,
  Tooltip,
} from "recharts";

export const GraphTwoLine = ({ dataBar,widthGraph }: any) => {
  return (
    <>
      <LineChart width={widthGraph} height={350} data={dataBar}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="วันที่" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="เช่ารถ"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        />
        <Line type="monotone" dataKey="จองที่นั่ง" stroke="#82ca9d" />
      </LineChart>
    </>
  );
};
