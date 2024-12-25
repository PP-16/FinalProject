import { DatePicker, Tabs, TabsProps } from "antd";
import { Car } from "../../api/models/Cars";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import "dayjs/locale/th";
import { RentCar } from "./components/RentCar";
import { BookingCar } from "./components/BookingCar";
import { BookingManage } from "../maneger/BookingManage";
import { OrderMange } from "../maneger/OrderMange";

export const HomeEmployee = () => {
  const tabList = [
    {
      key: "บริการเช่ารถ",
      label: "บริการเช่ารถ",
      children: <RentCar />,
    },
    {
      key: "จัดการการเช่ารถ",
      label: "จัดการการเช่ารถ",
      children: <OrderMange />,
    },
    {
      key: "บริการจองที่นั่งรถ",
      label: "บริการจองที่นั่งรถ",
      children: <BookingCar />,
    },
    {
      key: "จัดการการจองที่นั่งรถ",
      label: "จัดการการจองที่นั่งรถ",
      children: <BookingManage />,
    },
  ];

  const [car, setCars] = useState([]);
  useEffect(() => {
    agent.Cars.getCarForRents().then((car) => setCars(car));
  }, []);

  const [activeKey, setActiveKey] = useState("บริการเช่ารถ");

  const onTabChange = (key:any) => {
    setActiveKey(key);
  };

  // console.log("cars", car);

  return (
    <>
      <Tabs
        defaultActiveKey="บริการเช่ารถ"
        items={tabList}
        activeKey={activeKey}
        onChange={onTabChange}
      />
    </>
  );
};