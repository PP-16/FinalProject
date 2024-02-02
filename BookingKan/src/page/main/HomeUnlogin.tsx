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
  Modal,
  Popover,
  Badge,
  Divider,
} from "antd";
import { Car } from "../../api/models/Cars";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import { Itinerary } from "../../api/models/Itinerary";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { searchItineraryAsync } from "../../api/redux/Slice/ItinerarySlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Lottie from "lottie-react";
import notfound from "../../assets/lotti/Empty.json";
import "dayjs/locale/th";
import { Content, Header } from "antd/es/layout/layout";
import { CarOutlined } from "@ant-design/icons";
import { it } from "node:test";
import Item from "antd/es/list/Item";
import { time } from "console";

export const HomeUnloginUser = () => {
  //#region headFrom

  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmitฺBooking = (item: Itinerary) => {
    const { DateBooking }: any = formData;
    console.log("DateBooking", DateBooking);

    if (!DateBooking) {
      notification.warning({
        message: "แจ้งเตือน",
        description: "กรุณาลงลงชื่อเข้าใช้งานก่อน.",
      });
      return;
    } else {
      navigate("/login");
    }
  };

  //#endregion
  const { Meta } = Card;
  const [car, setCars] = useState<Car[]>([]);
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [top3, setTop3] = useState<any>([]);

  const dispatch = useAppDispatch();
  const sreachItinerary = async () => {
    const { OriginRoute }: any = formData;
    console.log("search", OriginRoute);
    try {
      const actionResult: any = await dispatch(
        searchItineraryAsync(OriginRoute)
      );
      const itineraryResult = unwrapResult(actionResult);
      console.log("itineraryResult", itineraryResult);

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
  }, []);

  console.log("top3", top3);

  // useEffect(() => {
  //   // Iterate through all cars and update their status
  //   car.forEach((car) => {
  //     agent.Cars.updateStatusRent(car.carsId);
  //   });
  // }, [car]);
  return (
    <>
      <Layout>
        <Header
          style={{
            backgroundColor: "#8FC0F9",
            borderBottom:1,borderBottomStyle:'double',borderBottomColor:'#00000040'
          }}
        >
          <Row style={{ flex: 1 }}>
            <Col span={16} style={{ marginTop: 10 }}>
              <Link to="/">
                <Row style={{ justifyContent: "flex-start" }}>
                  <CarOutlined style={{ fontSize: "25px", color: "black" }} />
                  <Typography
                    style={{
                      fontSize: "25px",
                      color: "black",
                      textAlign: "center",
                    }}
                  >
                    BookingKan
                  </Typography>
                </Row>
              </Link>
            </Col>
            <Col span={8}>
              <Row style={{ justifyContent: "right", alignItems: "center" }}>
                <div style={{ marginRight: 30 }}>
                  <Link to="/login">
                    <Button
                      size="large"
                      type="primary"
                       style={{ backgroundColor: "#ffa39e",color:'black' }}
                    >
                      เข้าสู่ระบบ
                    </Button>
                  </Link>
                </div>
                <div style={{ marginRight: 30 }}>
                  <Link to="/register">
                    <Button
                      type="primary"
                       style={{ backgroundColor: "#ffa39e",color:'black' }}
                      size="large"
                    >
                      สมัครสมาชิก
                    </Button>
                  </Link>
                </div>
              </Row>
            </Col>
          
          </Row>
       
        </Header>
        {/* <div >
        <Divider style={{padding:0}}/>
        </div> */}
    
        <Header
          style={{
            backgroundColor: "#8FC0F9",
            position: "sticky",
            top: 0,
            zIndex: 1,
            display: "flex", 
          
          }}
        >
   
          <div
            style={{
              width: "100%",
              justifyContent: "center",
              alignContent: "center",  margin:10
           
            }}
          >
            <Form>
              <Row style={{ alignContent: "center" }}>
                <Col span={16}>
                  <Form.Item name="OriginRoute" label="ค้นหาเส้นทาง">
                    <Input
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
                <Col span={6}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      type="primary"
                      shape="round"
                      size="large"
                      style={{
                        backgroundColor: "#ffa39e",
                        fontSize: 17,
                      }}
                      onClick={() => sreachItinerary()}
                    >
                      ค้นหาเส้นทาง
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </div>
        </Header>

        <Content>
          <Carousel autoplay>
            <div>
              <img
                src="https://cdn.getyourguide.com/img/tour/5f449108c4917.jpeg/145.jpg"
                width="100%"
                style={contentStyle}
              ></img>
            </div>
            <div>
              <img
                src="https://a.cdn-hotels.com/gdcs/production154/d494/c157904b-4f71-4aec-9db9-5e732d9e75f4.jpg"
                width="100%"
                style={contentStyle}
              ></img>
            </div>
            <div>
              <img
                src="https://bangkokattractions.com/wp-content/uploads/2017/02/bangkok-to-kanchanaburi.jpg"
                width="100%"
                style={contentStyle}
              ></img>
            </div>
            <div>
              <img
                src="https://stingynomads.com/wp-content/uploads/2016/09/Things-to-do-in-Kanchanaburi.-Erawan-national-park.jpg"
                width="100%"
                style={contentStyle}
              ></img>
            </div>
          </Carousel>
          <Row >
            <Col span={24} style={{ margin: 12}}>
              <Typography style={{ fontSize: 30 }}>
                รอบการเดินรถ
              </Typography>
            </Col>
            {top3.map((itemTop) => {
              return (
                <Col key={itemTop.itineraryId} style={{flex:1}}>
                  <Row style={{margin:12}}>
                    {itinerary
                      .filter(
                        (item) => item.itineraryId === itemTop.itineraryId
                      )
                      .map((filteredItem) => {
                        const timeArrival = moment(
                          filteredItem.arrivalTime
                        ).format("LT");
                        const timeIssueTime = moment(
                          filteredItem.issueTime
                        ).format("LT");

                        return (
                          <>
                          <div
                            style={{ width: "100%"}}
                            key={filteredItem.itineraryId}
                          >
                             <Badge.Ribbon text="ยอดนิยม" color="#ffc53d" style={{fontSize:15,padding:6,paddingRight:12,paddingLeft:12}}>
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
                                  <Col span={6} style={{ margin: 2 }}>
                                    <Typography style={{ color: "gray" }}>
                                      หมายเลขรถ
                                    </Typography>
                                    <Typography>
                                      {
                                        filteredItem?.cars
                                          ?.carRegistrationNumber
                                      }
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
                                        backgroundColor: "#ffa39e",
                                        margin: 20,
                                        justifyContent: "center",
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
                          </div>
                          {/* <div
                            style={{ width: "100%"}}
                            key={filteredItem.itineraryId}
                          >
                             <Badge.Ribbon text="ยอดนิยม" color="#ffc53d" style={{fontSize:15,padding:6,paddingRight:12,paddingLeft:12}}>
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
                                  <Col span={6} style={{ margin: 2 }}>
                                    <Typography style={{ color: "gray" }}>
                                      หมายเลขรถ
                                    </Typography>
                                    <Typography>
                                      {
                                        filteredItem?.cars
                                          ?.carRegistrationNumber
                                      }
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
                                        backgroundColor: "#ffa39e",
                                        margin: 20,
                                        justifyContent: "center",
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
                          </div> */}
                          </>
                          
                          
                        );
                      })}
                  </Row>
                </Col>
              );
            })}
          </Row>
          <Row style={{ justifyContent: "space-evenly" }}>
            <Row style={{ justifyContent: "space-evenly", margin: 10 }}></Row>
          </Row>
        </Content>
      </Layout>
    </>
  );
};
