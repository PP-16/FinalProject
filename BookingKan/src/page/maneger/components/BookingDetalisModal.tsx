import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Modal,
  QRCode,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import { PathImage } from "../../../routers/PathImage";
import html2pdf from "html2pdf.js";
import moment from "moment";
import agent from "../../../api/agent";
import { Booking } from "../../../api/models/Booking";
import { PathPrivateRouter } from "../../../routers/PathAllRoute";
import loadingLottie from "../../../assets/lotti/bussLoading.json";
import Lottie from "lottie-react";
import { log } from "console";
import { fetchBookingById } from "../../../api/redux/Slice/BookingSlice";
const pathServer = import.meta.env.VITE_SERVER_QRCODE;

export const BookingDetalisModal = ({ bookingId }: any) => {
  const system = useAppSelector((t) => t.system.system);
  // const [loading, setLoading] = useState(true);
  // const [data, setData] = useState<Booking | null>();
  const [userDetail, setUser] = useState<any>([]);
  const user = useAppSelector((t) => t.account.user);
  const data = useAppSelector((t) => t.booking.bookById);
  const loading = useAppSelector((t) => t.booking.loading);
  const dateIssueTime = moment(data[0]?.itinerary?.issueTime).format("LT");
  const dateArrivalTime = moment(data[0]?.itinerary?.arrivalTime).format("LT");
  const dateBooking = moment(data[0]?.dateAtBooking).format("Do MMM YY");
  const dispatch = useAppDispatch();
  const getData = async () => {
    await dispatch(fetchBookingById(bookingId));
  };

  useEffect(() => {
    getData()
    agent.Account.getUser(user?.token).then((user) => setUser(user));
  }, []);
  console.log("data", data);

  const generatePDF = () => {
    const element = document.getElementById("html-element-id-to-pdf"); // เปลี่ยน 'your-html-element-id' เป็น ID ขององค์ประกอบ HTML ที่คุณต้องการแปลงเป็น PDF
    html2pdf()
      .from(element)
      .save(bookingId + ".pdf");
  };

  return (
    <>
      {loading ? (
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ flex: 1, justifyContent: "center" }}
        >
          <Col xs={24} sm={18} md={12} xl={24} xxl={24}>
            <Lottie loop={true} autoPlay={true} animationData={loadingLottie} />
          </Col>
        </Row>
      ) : (
        <>
          <div style={{ margin: 20 }} id="html-element-id-to-pdf">
          <Card key={data[0]?.bookingId}
                headStyle={{ backgroundColor: "#4F6F52" }}
                title={
                  <>
                    <Row>
                      {system.map((i: any) => {
                        const imgLogo = PathImage.logo + i.logo;
                        return (
                          <>
                            <Avatar
                              size="large"
                              shape="square"
                              src={<img src={imgLogo} alt="avatar" />}
                            />
                            <Typography
                              style={{
                                fontSize: "25px",
                                color: "#fff",
                                textAlign: "center",
                              }}
                            >
                              {i.nameWeb}
                            </Typography>
                          </>
                        );
                      })}
                    </Row>
                  </>
                }
              >
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <Descriptions
                      labelStyle={{
                        color: "black",
                      }}
                      contentStyle={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#4F6F52",
                      }}
                    >
                      <Descriptions.Item label="ชื่อ">
                        {data[0]?.passenger?.passengerName}
                      </Descriptions.Item>
                      <Descriptions.Item label="เบอร์โทรศัพท์">
                        {data[0]?.passenger?.phone}
                      </Descriptions.Item>
                      <Descriptions.Item label="หมายเลขที่นั่ง">
                        {data[0]?.seatsSerialized}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <Descriptions
                      labelStyle={{
                        color: "black",
                      }}
                      contentStyle={{
                        fontWeight: "bold",
                        fontSize: 16,
                        color: "#4F6F52",
                      }}
                    >
                      <Descriptions.Item label="วันที่เดินทาง">
                        {dateBooking}
                      </Descriptions.Item>
                      <Descriptions.Item label="เวลาที่ออก">
                        {dateIssueTime}
                      </Descriptions.Item>
                      <Descriptions.Item label="เวลาที่ถึง">
                        {dateArrivalTime}
                      </Descriptions.Item>
                      <Descriptions.Item label="สถานที่ต้นทาง">
                        {data[0]?.itinerary?.routeCars?.originName}
                      </Descriptions.Item>
                      <Descriptions.Item label="สถานที่ปลายทาง">
                        {data[0]?.itinerary?.routeCars?.destinationName}
                      </Descriptions.Item>
                      <Descriptions.Item label="หมายเลขรถ">
                        {data[0]?.itinerary?.cars?.carRegistrationNumber}
                      </Descriptions.Item>
                    </Descriptions>
                  </Col>
                </Row>
                <Divider orientation="left" style={{ borderColor: "black" }}>
                  เพิ่มเติม
                </Divider>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col xs={24} sm={24} md={6} xl={6} xxl={3}>
                        <QRCode
                          value={`${pathServer}BookingManage?bookingId=${bookingId}&details=true`}
                          bgColor="#fff"
                        />
                      </Col>
                      <Col xs={24} sm={24} md={16} xl={16} xxl={16}>
                        <Descriptions
                          labelStyle={{
                            color: "black",
                          }}
                          contentStyle={{
                            fontWeight: "bold",
                            fontSize: 16,
                            color: "#4F6F52",
                          }}
                        >
                          <Descriptions.Item label="ราคารวม">
                            {data[0]?.totalPrice}
                          </Descriptions.Item>
                          {/* <Descriptions.Item label="สถานะการจ่ายเงิน">
                            {data[0]?.bookingStatus}
                          </Descriptions.Item> */}
                          <Descriptions.Item label="หมายเหตุ">
                            {data[0]?.note}
                          </Descriptions.Item>
                        </Descriptions>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
          </div>
          {(userDetail.roleId == 0 ||
            userDetail.roleId == 3 ||
            userDetail.roleId != undefined) && (
            <Button
              type="primary"
              style={{ backgroundColor: "#1A4D2E" }}
              onClick={generatePDF}
              block
            >
              พิมพ์ตั๋ว
            </Button>
          )}
        </>
      )}
    </>
  );
};
