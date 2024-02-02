import {
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  Typography,
  Image,
  theme,
  Steps,
  Button,
  message,
  Form,
  Input,
  ConfigProvider,
  DatePicker,
  TimePicker,
} from "antd";
import "moment/locale/th";
import { useState } from "react"

;
const { Meta } = Card;
const { RangePicker } = DatePicker;

export const RentDetail = ({ visble, cars, cancel }: any) => {
  console.log("item", cars);
  let statusText;

  switch (cars.statusCar) {
    case 0:
      statusText = "ว่าง";
      break;
    case 1:
      statusText = "เช่าแล้ว";
      break;
    default:
      statusText = "Unknown Status";
  }

  return (
    <Modal
      open={visble}
      width={1000}
      footer={null}
      onCancel={() => cancel(false)}
    >
      <Card style={{margin:30}} title="รายละเอียดรถ">
        <Row style={{justifyContent:'center',}}>
          <Col span={24} style={{justifyItems:'center',margin:10,display:'flex'}}>
            <Image src="https://www.grandprix.co.th/wp-content/uploads/2021/09/%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3-5-%E0%B8%A3%E0%B8%96-%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%A7.jpg"/>
          </Col>
          <Col span={24}>
            <Descriptions >
              <Descriptions.Item label="แบนด์รถ">
                {cars.carBrand}
              </Descriptions.Item>
              <Descriptions.Item label="รุ่นรถ">
                {cars.carModel}
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขทะเบียนรถ">
                {cars.carRegistrationNumber}
              </Descriptions.Item>
              <Descriptions.Item label="คลาสรถ">
                {cars.classCars.className}
              </Descriptions.Item>
              <Descriptions.Item label="ราคาต่อวัน">
                {cars.classCars.price}
              </Descriptions.Item>
              <Descriptions.Item label="รายละเอียดรถ">
                {cars.detailCar}
              </Descriptions.Item>
              <Descriptions.Item label="สถานะ">
                {statusText}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
