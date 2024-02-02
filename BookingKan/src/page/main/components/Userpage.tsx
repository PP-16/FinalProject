import { AntDesignOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Descriptions, Row } from "antd";
import agent from "../../../api/agent";
import { store } from "../../../api/redux/Store/configureStore";
import { log } from "console";
import { useEffect, useState } from "react";
import { Passentger } from "../../../api/models/Passentger";

export const Userpage = () => {
  const token = store.getState().account.user?.token;

  const [user, setUser] = useState<any>([]);

  useEffect(() => {
    agent.Account.getUser(token).then((user) => setUser(user));
  }, []);
  console.log("user", user);

  const PhoneNumberComponent = () => {
    console.log("number", user.phone);

    // Check if user.phone exists before trying to format
    if (user.phone) {
      const phoneNumber = user.phone;

      // Extract the first 3 digits and the last 2 digits
      const prefix = phoneNumber.substring(0, 3);
      const suffix = phoneNumber.substring(phoneNumber.length - 1);

      // If there are more than 5 digits, replace the rest with 'x'
      const maskedMiddle =
        phoneNumber.length > 5
          ? phoneNumber.substring(3, phoneNumber.length - 1).replace(/\d/g, "x")
          : "";

      // Combine the parts to form the masked phone number
      const maskedPhoneNumber = `${prefix}-${maskedMiddle}${suffix}`;

      return <span>{maskedPhoneNumber}</span>;
    }

    // If user.phone is undefined, return a default message or handle it accordingly
    return <span>No phone number available</span>;
  };
  const PartialIdCard = () => {
    // Check if user object and idCardNumber property are defined
    if (!user || !user.idCardNumber) {
      return <div>No ID Card Number available</div>;
    }

    // ตัดบางส่วนของหมายเลขบัตรประชาชนเพื่อไม่ให้แสดงทั้งหมด
    const maskedIdNumber = `${user.idCardNumber.substring(
      0,
      3
    )}-XXXXXXXX-X${user.idCardNumber.substring(12)}`;

    return <span>{maskedIdNumber}</span>;
  };
  return (
    <>
      <Row>
        <Col span={5} style={{ justifyContent: "center",display:'flex' }}>
          <Avatar
            size={{ xs: 24, sm: 64, md: 100, lg: 150, xl: 200, xxl: 250 }}
            //   icon={<AntDesignOutlined />}
            src="https://i.pinimg.com/564x/bd/b3/f2/bdb3f247a9cf260eedbf9313a51a59f6.jpg"
          />
        </Col>
        <Col span={19} style={{ justifyContent: "center",display:'flex' }}>
          <Card title="ข้อมูลผู้ใช้">
            <Descriptions >
              <Descriptions.Item label="ชื่อ">
                {user.passengerName}
              </Descriptions.Item>
              <Descriptions.Item label="อีเมล์">{user.email}</Descriptions.Item>
              <Descriptions.Item label="หมายเลขเบอร์โทรศัพท์">
                <PhoneNumberComponent />
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขบัตรประจำตัวประชาชน">
                <PartialIdCard />
              </Descriptions.Item>
             
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </>
  );
};
