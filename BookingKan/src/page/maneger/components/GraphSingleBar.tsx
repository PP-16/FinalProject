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

export const GraphSingleBar = ({ data,widthGraph }: any) => {
  return (
    <>
      <BarChart
           width={widthGraph}
           height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" name="วันที่" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar   dataKey="price" name="ราคารวม" barSize={20} fill="#8884d8" />
      </BarChart>
    </>
  );
};
