import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const GraphTwoBar = ({ dataBar,widthGraph }: any) => {
  return (
    <>
      <BarChart
        width={widthGraph}
        height={300}
        data={dataBar}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="วันที่" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="เช่ารถ" fill="#8884d8" background={{ fill: "#eee" }} />
        <Bar dataKey="จองที่นั่ง" fill="#82ca9d" />
      </BarChart>
    </>
  );
};
