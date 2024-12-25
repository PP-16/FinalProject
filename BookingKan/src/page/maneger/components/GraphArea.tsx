import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const GraphArea = ({ data, widthGraph }: any) => {
  // console.log("data", data);

  return (
    <>
      <AreaChart
        width={widthGraph}
        height={300}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" name="วันที่" />
        <YAxis />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="price"
          name="ราคารวม"
          stroke="#8884d8"
          fill="#8884d8"
        />
      </AreaChart>
    </>
  );
};
