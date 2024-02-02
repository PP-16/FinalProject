import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { Car } from "../../api/models/Cars";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import { Itinerary } from "../../api/models/Itinerary";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { searchItineraryAsync } from "../../api/redux/Slice/ItinerarySlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Lottie from "lottie-react";
import notfound from "../../assets/lotti/Empty.json";
import "dayjs/locale/th";

const { RangePicker } = DatePicker;

export const HomePageUser = () => {
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
        description: "กรุณากรอกวันที่ที่เดินทาง.",
      });
      return;
    } else {
      navigate("/BookingDetail", { state: { item, formData } });
    }

    // Proceed with form submission logic here
    // ...
  };

  //#endregion
  const { Meta } = Card;
  const [car, setCars] = useState<Car[]>([]);

  const [itinerary, setItinerary] = useState<Itinerary[]>([]);

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

  useEffect(() => {
    agent.Cars.getCarForRents().then((car) => setCars(car));
    agent.Itinerarys.getItinarery().then((itinerary) =>
      setItinerary(itinerary)
    );
  }, []);

  console.log("cars", car);

  // useEffect(() => {
  //   // Iterate through all cars and update their status
  //   car.forEach((car) => {
  //     agent.Cars.updateStatusRent(car.carsId);
  //   });
  // }, [car]);

  return (
    <>
      <Card
        style={{
          margin: 10,
          position: "sticky",
          top: 0,
          zIndex: 1,
          display: "flex",
          flex: 1,
        }}
      >
        <Form>
          <Row>
            <Col sm={6} md={6} xl={18}>
              {/* <Typography style={{ color: "gray" }}>สถานที่ขึ้นรถ</Typography> */}
              <Form.Item name="OriginRoute" label="สถานที่ต้นทาง-ปลายทาง">
                <Input
                  placeholder="ค้นหาจุดขึ้น-ลงรถ"
                  onChange={(e) =>
                    setFormData({ ...formData, OriginRoute: e.target.value })
                  }
                />
              </Form.Item>
            </Col>
            <Col sm={6} md={6} xl={6}>
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
            <Col sm={3} md={6} xl={6} style={{ padding: 20 }}>
              <Form.Item
                name="DateBooking"
                label="วันที่ต้องการจอง"
                rules={[
                  {
                    required: true,
                    message: "กรุณากรอกวันที่ที่ต้องการเดินทาง",
                  },
                ]}
              >
                <DatePicker
                  open={open}
                  onOpenChange={setOpen}
                  onChange={(e) => setFormData({ ...formData, DateBooking: e })}
                />
              </Form.Item>
            </Col>

            <Col sm={3} md={6} xl={6} style={{ padding: 20 }}>
              <Form.Item name="QuantityPassenger" label="จำนวณผู้โดยสาร">
                <InputNumber
                  min={1}
                  max={10}
                  defaultValue={3}
                  onChange={(e: any) =>
                    setFormData({ ...formData, QuantityPassenger: e })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row>
        {itinerary == null || itinerary.length === 0 ? (
          <Row style={{ flex: 1, justifyContent: "center" }}>
            <div
              style={{
                width: 500,
                height: 500,
              }}
            >
              <Col>
                <Lottie
                  loop={true}
                  autoPlay={true}
                  animationData={notfound}
                  height={"100%"}
                  width={"100%"}
                />
              </Col>
            </div>
          </Row>
        ) : (
          <>
            {itinerary.map((item) => {
              const timeArrival = moment(item.arrivalTime).format("LT");
              const timeIssueTime = moment(item.issueTime).format("LT");

              return (
                <Row >
                  <Col
                   span={24}
                    key={item.itineraryId}
                    style={{ margin: 5, padding: 10,width:500 }}
                  >
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
                          <Typography>{item.routeCars.originName}</Typography>
                          <Typography style={{ color: "gray" }}>ถึง</Typography>
                          <Typography>
                            {item.routeCars.destinationName}
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
                            {item?.cars?.carRegistrationNumber}
                          </Typography>
                          <Typography style={{ color: "gray" }}>
                            ราคา
                          </Typography>
                          <Typography>{item?.cars?.priceSeat}</Typography>

                          <Button
                            type="primary"
                            shape="round"
                            style={{
                              backgroundColor: "#ffa39e",
                              margin: 20,
                              justifyContent: "center",
                            }}
                            onClick={() => handleFormSubmitฺBooking(item)}
                          >
                            รายละเอียด
                          </Button>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              );
            })}
          </>
        )}
      </Row>
      <Row style={{justifyContent:'space-evenly'}}>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt="example"
              src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
      </Row>
    </>
  );
};
