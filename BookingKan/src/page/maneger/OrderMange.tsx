import React from 'react'
import { Orders } from './components/Oreder';
import { RentCar } from './components/RentCar';
import { Tabs } from 'antd';

export const OrderMange = () => {
 const items=[
    {
      label: 'เช่ารถ',
      key: '1',
      children: <RentCar/>,
    },
    {
      label: 'จัดการการเช่ารถ',
      key: '2',
      children:  <Orders/>,
    },
  ];
  return (
    <>
  <Tabs
    // onChange={onChange}
    type="card"
    items={items}
  />
    </>
  )
}

