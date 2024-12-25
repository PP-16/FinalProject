import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import agent from "../../../api/agent";
import moment from "moment";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import { Col, Row } from "antd";

export const GraphLine = ({ total,widthGraph }: any) => {
  // console.log("total", total);

  return (
    <LineChart
      width={widthGraph}
      height={300}
      data={total}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="price" name="ราคารวม" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="date" name="วันที่" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};
