import {
  Button,
  Card,
  Carousel,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Typography,
  notification,
  Image,
  Badge,
  Avatar,
  DatePicker,
} from "antd";
import { Car } from "../../api/models/Cars";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import { Itinerary } from "../../api/models/Itinerary";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { searchItineraryAsync } from "../../api/redux/Slice/ItinerarySlice";
import { unwrapResult } from "@reduxjs/toolkit";
import "dayjs/locale/th";
import { Content, Footer, Header } from "antd/es/layout/layout";
import {
  FacebookOutlined,
  InstagramOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { fetchSystem } from "../../api/redux/Slice/SystemSlice";
import { PathImage } from "../../routers/PathImage";
import { fetchNews } from "../../api/redux/Slice/NewsSlice";
import { NewsCrad } from "./components/NewsCrad";
import {
  PathAccountRouter,
  PathPublicRouter,
} from "../../routers/PathAllRoute";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { HomePageUser } from "./HomePage";

export const HomeUnloginUser = () => {
  //#region headFrom

  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmitฺBooking = (item: Itinerary) => {
    const { DateBooking }: any = formData;
    // console.log("DateBooking", DateBooking);

    if (!DateBooking) {
      notification.warning({
        message: "แจ้งเตือน",
        description: "กรุณากรอกวันที่ที่เดินทาง.",
      });
      return;
    } else {
      navigate(PathAccountRouter.bookingDetail, { state: { item, formData } });
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current:any) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };

  //#endregion
  const { Meta } = Card;
  const [car, setCars] = useState<Car[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [top3, setTop3] = useState<any>([]);
  const system = useAppSelector((t) => t.system.system);

  const dispatch = useAppDispatch();
  const sreachItinerary = async () => {
    const { OriginRoute }: any = formData;
    // console.log("search", OriginRoute);
    try {
      const actionResult: any = await dispatch(
        searchItineraryAsync(OriginRoute)
      );
      const itineraryResult = unwrapResult(actionResult);
      // console.log("itineraryResult", itineraryResult);

      // Set the received data into the itinerary state
      setItinerary(itineraryResult);
    } catch (error) {
      console.log("error", error);
    }
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "550px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  const dataMock = Array.from({ length: 6 }).map((_, i) => ({
    title: `เส้นทางยอดนิยม ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  }));
  const content = (item: any) => (
    <>
      <div>{item.description}</div>
      <div>{item.content}</div>
    </>
  );

  useEffect(() => {
    agent.Cars.getCarForRents().then((car) => setCars(car));
    agent.Itinerarys.getItinarery().then((itinerary) =>
      setItinerary(itinerary)
    );
    agent.Bookings.getTop3().then((top) => setTop3(top));
    dispatch(fetchSystem());
    dispatch(fetchNews());
  }, []);

  // console.log("top3", top3);
  // console.log("itinerary", itinerary);

  return (
    <Layout style={{ flex: 1 }}>
      <Header
        style={{
          backgroundColor: "#4F6F52",
          borderBottom: 1,
          borderBottomStyle: "double",
          borderBottomColor: "#1A4D2E",
        }}
      >
        <Row gutter={{ xs: 1, sm: 2, md: 8, lg: 8 }}>
          <Col xs={12} sm={12} md={18} xl={20} xxl={20}>
            <Link to={PathPublicRouter.home}>
              <>
                {system.map((i) => {
                  const imgLogo = PathImage.logo + i.logo;
                  return (
                    <Row style={{ marginTop: 10 }}>
                      <Avatar
                        size="large"
                        shape="square"
                        src={<img src={imgLogo} alt="avatar" />}
                      />

                      <Typography
                        style={{
                          fontSize: "20px",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        {i.nameWeb}
                      </Typography>
                    </Row>
                  );
                })}
              </>
            </Link>
          </Col>
          <Col xs={2} sm={12} md={6} xl={4} xxl={4}>
            <Row>
              {/* <div style={{ marginRight: 30 }}> */}
              <Link to={PathAccountRouter.login}>
                <Button
                  size="large"
                  type="primary"
                  shape="round"
                  style={{ backgroundColor: "#fff", color: "#1A4D2E" }}
                >
                  เข้าสู่ระบบ / สมัครสมาชิก
                </Button>
              </Link>
              {/* </div> */}
            </Row>
          </Col>
        </Row>
      </Header>
      {/* <Header
        style={{
          backgroundColor: "#4F6F52",
          position: "sticky",
          top: 0,
          zIndex: 1,
          display: "flex",
        }}
      >
        <Form style={{ marginTop: 10, flex: 1 }}>
          <Row gutter={{ xs: 12, sm: 3, md: 10, lg: 32 }}>
            <Col xs={8} sm={8} md={8} xl={10} xxl={10}>
              <Form.Item name="OriginRoute">
                <Input
                  width={"100%"}
                  placeholder="ค้นหาจุดขึ้น-ลงรถ"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      OriginRoute: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={8} sm={8} md={8} xl={2} xxl={2}>
              <Form.Item>
                <Button
                  type="primary"
                  shape="round"
                  style={{
                    backgroundColor: "#fff",
                    color: "#1A4D2E",
                  }}
                  onClick={() => sreachItinerary()}
                >
                  ค้นหาเส้นทาง
                </Button>
              </Form.Item>
            </Col>
            <Col xs={8} sm={8} md={8} xl={9} xxl={10}>
              <Form.Item name="DateBooking">
                <DatePicker
                  open={open}
                  disabledDate={disabledDate}
                  placeholder="เลือกวันที่ต้องการเดินทาง"
                  onOpenChange={setOpen}
                  style={{ width: "100%" }}
                  onChange={(e) => setFormData({ ...formData, DateBooking: e })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Header> */}

      <Content style={{ margin: 20, flex: 1 }}>
        <HomePageUser/>
        {/* <Row>
          <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
            <Carousel autoplay>
              {system.map((sys: any) =>
                sys?.imageSlide?.map((imageS: any) => {
                  console.log("imageS", imageS);
                  const mapImg = PathImage.imageSlide + imageS.imageSlides;
                  return (
                    <div>
                      <img
                        style={{ width: "100%", height: "350px" }}
                        src={mapImg}
                      ></img>
                    </div>
                  );
                })
              )}
            </Carousel>
          </Col>
        </Row>

        <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 32 }}>
          <Col xs={24} sm={24} md={24} xl={24} xxl={24} style={{ margin: 12 }}>
            <Typography style={{ fontSize: 30 }}>รอบการเดินรถ</Typography>
          </Col>
          {top3.map((itemTop:any) => {
            return (
              <>
                {itinerary
                  .filter((item) => item.itineraryId === itemTop.itineraryId)
                  .map((filteredItem) => {
                    const timeArrival = moment(filteredItem.arrivalTime).format(
                      "LT"
                    );
                    const timeIssueTime = moment(filteredItem.issueTime).format(
                      "LT"
                    );

                    return (
                      <Col
                        xs={24}
                        sm={18}
                        md={12}
                        xl={8}
                        xxl={8}
                        key={filteredItem.itineraryId}
                      >
                        <Badge.Ribbon
                          text="ยอดนิยม"
                          color="#ffc53d"
                          style={{
                            fontSize: 15,
                            padding: 6,
                            paddingRight: 12,
                            paddingLeft: 12,
                          }}
                        >
                          <Card hoverable>
                            <Row style={{ justifyContent: "space-evenly" }}>
                              <Col
                                sm={12}
                                md={12}
                                xl={12}
                                xxl={12}
                                style={{
                                  borderRightWidth: 2,
                                  borderRightStyle: "dotted",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography style={{ color: "gray" }}>
                                  จาก
                                </Typography>
                                <Typography>
                                  {filteredItem.routeCars.originName}
                                </Typography>
                                <Typography style={{ color: "gray" }}>
                                  ถึง
                                </Typography>
                                <Typography>
                                  {filteredItem.routeCars.destinationName}
                                </Typography>
                                <Typography style={{ color: "gray" }}>
                                  เวลา
                                </Typography>
                                <Typography>{`${timeIssueTime} - ${timeArrival}`}</Typography>
                              </Col>
                              <Col
                                sm={6}
                                md={6}
                                xl={6}
                                xxl={6}
                                style={{ margin: 2 }}
                              >
                                <Typography style={{ color: "gray" }}>
                                  หมายเลขรถ
                                </Typography>
                                <Typography>
                                  {filteredItem?.cars?.carRegistrationNumber}
                                </Typography>
                                <Typography style={{ color: "gray" }}>
                                  ราคา
                                </Typography>
                                <Typography>
                                  {filteredItem?.cars?.priceSeat}
                                </Typography>

                                <Button
                                  type="primary"
                                  shape="round"
                                  style={{
                                    backgroundColor: "#4F6F52",
                                    color: "#fff",
                                  }}
                                  onClick={() =>
                                    handleFormSubmitฺBooking(filteredItem)
                                  }
                                >
                                  รายละเอียด
                                </Button>
                              </Col>
                            </Row>
                          </Card>
                        </Badge.Ribbon>
                      </Col>
                    );
                  })}
              </>
            );
          })}
        </Row>
        <div style={{ marginTop: 30, marginBottom: 30 }}>
          <NewsCrad />
        </div>
        <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 32 }}>
          {itinerary.map((filteredItem) => {
            const timeArrival = moment(filteredItem.arrivalTime).format("LT");
            const timeIssueTime = moment(filteredItem.issueTime).format("LT");
            console.log("filteredItem", filteredItem);

            return (
              <Col xs={24} sm={18} md={12} xl={8} xxl={8} style={{
                marginBottom: 20
              }}>
                <div style={{ width: "100%" }} key={filteredItem.itineraryId}>
                  <Card hoverable>
                    <Row style={{ justifyContent: "space-evenly" }}>
                      <Col
                        span={14}
                        style={{
                          borderRightWidth: 2,
                          borderRightStyle: "dotted",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography style={{ color: "gray" }}>จาก</Typography>
                        <Typography>
                          {filteredItem.routeCars.originName}
                        </Typography>
                        <Typography style={{ color: "gray" }}>ถึง</Typography>
                        <Typography>
                          {filteredItem.routeCars.destinationName}
                        </Typography>
                        <Typography style={{ color: "gray" }}>เวลา</Typography>
                        <Typography>{`${timeIssueTime} - ${timeArrival}`}</Typography>
                      </Col>
                      <Col span={6} style={{ margin: 2 }}>
                        <Typography style={{ color: "gray" }}>
                          หมายเลขรถ
                        </Typography>
                        <Typography>
                          {filteredItem?.cars?.carRegistrationNumber}
                        </Typography>
                        <Typography style={{ color: "gray" }}>ราคา</Typography>
                        <Typography>{filteredItem?.cars?.priceSeat}</Typography>

                        <Button
                          type="primary"
                          shape="round"
                          style={{
                            backgroundColor: "#4F6F52",
                            color: "#fff",
                          }}
                          onClick={() => handleFormSubmitฺBooking(filteredItem)}
                        >
                          รายละเอียด
                        </Button>
                      </Col>
                    </Row>
                  </Card>
                </div>
              </Col>
            );
          })}
        </Row> */}
      </Content>
      <Footer style={{ backgroundColor: "#4F6F52" }}>
        {system.map((item: any) => {
          const imagelogo = PathImage.logo + item?.logo;
          return (
            <Row>
              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <Row>
                  <Col>
                    <Image src={imagelogo} style={{ width: 200 }} />
                    <Typography style={{ fontSize: "25px", color: "#E8DFCA" }}>
                      {item.nameWeb}
                    </Typography>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <Row>
                  <Typography style={{ fontSize: "25px", color: "#E8DFCA" }}>
                    ติดต่อ
                  </Typography>
                </Row>
                <Row>
                  <PhoneOutlined
                    style={{ fontSize: "18px", color: "#E8DFCA" }}
                  />
                  <Typography
                    style={{ margin: 5, fontSize: "20px", color: "#E8DFCA" }}
                  >
                    {item?.phoneNumber}
                  </Typography>
                </Row>
                <Row>
                  <FacebookOutlined
                    style={{ fontSize: "18px", color: "#E8DFCA" }}
                  />
                  <a
                    href={item?.contactFB}
                    style={{ margin: 5, fontSize: "20px", color: "#E8DFCA" }}
                  >
                    BookingKan
                  </a>
                </Row>
                <Row>
                  <InstagramOutlined
                    style={{ fontSize: "18px", color: "#E8DFCA" }}
                  />
                  <a
                    href={item?.contactIG}
                    style={{ margin: 5, fontSize: "20px", color: "#E8DFCA" }}
                  >
                    BookingKan
                  </a>
                </Row>
              </Col>

              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <Typography style={{ fontSize: "25px", color: "#E8DFCA" }}>
                  ที่อยู่
                </Typography>

                <Typography style={{ fontSize: "20px", color: "#E8DFCA" }}>
                  {item?.address}
                </Typography>
              </Col>
            </Row>
          );
        })}
      </Footer>
    </Layout>
  );
};
