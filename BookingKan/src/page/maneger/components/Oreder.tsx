import {
    Badge,
    Button,
    Dropdown,
    Modal,
    Space,
    Table,
    Typography,
    message,
  } from "antd";
  import { useEffect, useState } from "react";
  import { DownOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { OrderRent, OrderRentItem } from "../../../api/models/Order";
import agent from "../../../api/agent";
import moment from "moment";
  
  export const Orders = () => {
  
    const [modals, setModal] = useState(false);
    const [order, setOrder] = useState<OrderRent[]>([]);
  const [orederItem, setOrederItem] = useState<OrderRentItem[]>([])
  
    useEffect(() => {
      agent.OrderRent.getOrder().then((order) => setOrder(order));
      agent.OrderRent.getOrderItem().then((order) => setOrederItem(order));
    }, []);
  
    console.log("order", order);
    console.log("orederItem", orederItem);
    const columns = [
      {
        title: "หมายเลขทะเบียนรถ",
        dataIndex: "carRegistrationNumber",
        key: "carRegistrationNumber",
      },
      {
        title: "วันที่ที่รับรถ",
        dataIndex: "dateTimePickup",
        key: "dateTimePickup",
      },
      {
        title: "วันที่ที่คืนรถ",
        dataIndex: "dateTimeReturn",
        key: "dateTimeReturn",
      },
      { title: "สถานที่ที่รับรถ", dataIndex: "placePickup", key: "placePickup" },
      { title: "สถานที่ที่คืนรถ", dataIndex: "placeReturn", key: "placeReturn" },
      { title: "สถานะ", dataIndex: "statusText", key: "statusText",render: (dataIndex:any) => <Badge status="warning" text={dataIndex} /> },
      {
        title: "แก้ไข",
        key: "operation",
        fixed: 'right',
        render: (text: any, record: any) => (
          <Button type="dashed" onClick={() => setModal(record)}>
            แก้ไข
          </Button>
        ),
        width: 150,
      },
    ];
    const dataSource = orederItem.map((item) => {
      const {
        cars,
        dateTimePickup,
        dateTimeReturn,
        driver,
        itemPrice,
        orderRentItemId,
        placePickup,
        placeReturn,
        quantity,
      } = item;
  
      const { orderRentId, orderSatus, passenger, paymentDate } = order.find(orderItem => orderItem.orderRentId === item.orderRentId) || {};

      const { passengerId, email, idCardNumber, passengerName,phone }:any = passenger;

      const { carBrand, carModel, carRegistrationNumber, classCars, carsId } = cars;
      const { className, classCarsId, price } = classCars;
      const { driverId,driverName} = driver;
      
      let statusText;
  
      switch (orderSatus) {
        case 0:
          statusText = "ต้องชำระ";
          break;
        case 1:
          statusText = "กำลังดำเนินการ";
          break;
        case 2:
          statusText = "จ่ายเงินสำเร็จ";
          break;
        case 3:
          statusText = "ยกเลิก";
          break;
        default:
          statusText = "Unknown Status";
      }
  
      const formattedItem = {
        key: orderRentItemId,
        carsId,
        dateTimePickup,
        dateTimeReturn,
        driverId,
        driverName,
        itemPrice,
        orderRentItemId,
        placePickup,
        placeReturn,
        quantity,
        orderRentId,
        orderSatus,
        passenger,
        paymentDate,
        passengerId,
        phone,
        email,
        idCardNumber,
        passengerName,
        carBrand,
        carModel,
        carRegistrationNumber,
        className,
        classCarsId,
        price,
        statusText,
      };
  
      return formattedItem;
    });
  
    const expandedRowRender = (record: any) => {
      const columns = [
        { title: "ชื่อผู้เช่า", dataIndex: "passengerName", key: "passengerName" },
        { title: "อีเมล์ผู้เช่า", dataIndex: "email", key: "email" },
        { title: "หมายเลขโทรศัพท์ผู้เช่า", dataIndex: "phone", key: "phone" },
        { title: "หมายเลขบัตรประจำตัวประชาชนผู้เช่า", dataIndex: "idCardNumber", key: "idCardNumber" },
        { title: "ชื่อคนขับ", dataIndex: "driverName", key: "driverName" },
       
      ];
      const dataSource2 = orederItem.map((item) => {
        const {
          cars,
          dateTimePickup,
          dateTimeReturn,
          driver,
          itemPrice,
          orderRentItemId,
          placePickup,
          placeReturn,
          quantity,
        } = item;
    
        const { orderRentId, orderSatus, passenger, paymentDate } = order.find(orderItem => orderItem.orderRentId === item.orderRentId) || {};
  
        const { passengerId, email, idCardNumber, passengerName,phone }:any = passenger;
  
        const { carBrand, carModel, carRegistrationNumber, classCars, carsId } = cars;
        const { className, classCarsId, price } = classCars;
        const { driverId,driverName} = driver;
        
        let statusText;
    
        switch (orderSatus) {
          case 0:
            statusText = "ต้องชำระ";
            break;
          case 1:
            statusText = "กำลังดำเนินการ";
            break;
          case 2:
            statusText = "จ่ายเงินสำเร็จ";
            break;
          case 3:
            statusText = "ยกเลิก";
            break;
          default:
            statusText = "Unknown Status";
        }
    
        const formattedItem = {
          key: orderRentItemId,
          carsId,
          dateTimePickup,
          dateTimeReturn,
          driverId,
          driverName,
          itemPrice,
          orderRentItemId,
          placePickup,
          placeReturn,
          quantity,
          orderRentId,
          orderSatus,
          passenger,
          paymentDate,
          passengerId,
          phone,
          email,
          idCardNumber,
          passengerName,
          carBrand,
          carModel,
          carRegistrationNumber,
          className,
          classCarsId,
          price,
          statusText,
        };
    
        return formattedItem;
      });

      const data = [
        {
          key: record.key,
          passengerName:record.passengerName,
          email:record.email,
          phone:record.phone,
          idCardNumber:record.idCardNumber,
          driverName:record.driverName
        },
      ];
      return (
        <Table columns={columns} dataSource={data} pagination={false} />
      );
    };
  
    return (
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        size="small"
      />
      // <>
      // <Typography>Order</Typography>
      // </>
    );
  };
  