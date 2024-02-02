import {
  Button,
  Card,
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Row,
  TimePicker,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { Car } from "../../api/models/Cars";
import { useEffect, useState } from "react";
import Meta from "antd/es/card/Meta";
import agent from "../../api/agent";
import { Itinerary } from "../../api/models/Itinerary";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { searchItineraryAsync } from "../../api/redux/Slice/ItinerarySlice";
import { unwrapResult } from "@reduxjs/toolkit";
import Lottie from "lottie-react";
import notfound from "../../assets/lotti/Empty.json";
import locale from "antd/lib/locale/th_TH";
import "dayjs/locale/th";
import { it } from "node:test";
import { log } from "node:console";

const tabList = [
  {
    key: "บริการเช่ารถ",
    tab: "บริการเช่ารถ",
  },
  {
    key: "บริการจองที่นั่งรถ",
    tab: "บริการจองที่นั่งรถ",
  },
];
const { RangePicker } = DatePicker;

//#region inputnum
interface NumericInputProps {
  style: React.CSSProperties;
  value: string;
  onChange: (value: string) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat().format(value);

const NumericInput = (props: NumericInputProps) => {
  const { value, onChange } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if (reg.test(inputValue) || inputValue === "" || inputValue === "-") {
      onChange(inputValue);
    }
  };

  // '.' at the end or only '-' in the input box.
  const handleBlur = () => {
    let valueTemp = value;
    if (value.charAt(value.length - 1) === "." || value === "-") {
      valueTemp = value.slice(0, -1);
    }
    onChange(valueTemp.replace(/0*(\d+)/, "$1"));
  };

  const title = value ? (
    <span className="numeric-input-title">
      {value !== "-" ? formatNumber(Number(value)) : "-"}
    </span>
  ) : (
    "Input a number"
  );

  return (
    <Tooltip
      trigger={["focus"]}
      title={title}
      placement="topLeft"
      overlayClassName="numeric-input"
    >
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Input a number"
        maxLength={16}
      />
    </Tooltip>
  );
};

//#endregion

export const HomeEmployee = () => {
  //#region headFrom

  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const contentList: Record<string, React.ReactNode> = {
    บริการเช่ารถ: (
      <Form>
        <Row>
          <Col sm={6} md={6} xl={18} style={{ padding: 20 }}>
            <Form.Item
              style={{ color: "gray" }}
              name="pickUpPlace"
              label="สถานที่รับรถ"
            >
              <Input
                placeholder="จุดรับรถ"
                onChange={(e) =>
                  setFormData({ ...formData, pickUpPlace: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col sm={3} md={6} xl={6} style={{ padding: 20 }}>
            <Form.Item
              style={{ color: "gray" }}
              label="วันที่รับรถ - วันที่คืนรถ"
              name="DateRent"
            >
              <ConfigProvider locale={locale}>
                <RangePicker
                  onChange={(e) => setFormData({ ...formData, DateRent: e })}
                />
              </ConfigProvider>
            </Form.Item>
          </Col>
          <Col sm={6} md={6} xl={18} style={{ padding: 20 }}>
            <Form.Item
              style={{ color: "gray" }}
              name="returnPlace"
              label="สถานที่คืนรถ"
            >
              <Input
                placeholder="จุดคืนรถ"
                onChange={(e) =>
                  setFormData({ ...formData, returnPlace: e.target.value })
                }
              />
            </Form.Item>
          </Col>
          <Col sm={3} md={6} xl={6} style={{ padding: 20 }}>
            <Form.Item
              style={{ color: "gray" }}
              label=" เวลาที่รับรถ - เวลาที่คืนรถ"
              name="Time"
            >
              <TimePicker.RangePicker
                onChange={(e) => setFormData({ ...formData, Time: e })}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    ),
    บริการจองที่นั่งรถ: (
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
                { required: true, message: "กรุณากรอกวันที่ที่ต้องการเดินทาง" },
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
              <NumericInput
                onChange={(e) =>
                  setFormData({ ...formData, QuantityPassenger: e })
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    ),
  };

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

  const handleFormSubmitRent = (item: Car) => {
    const { pickUpPlace, returnPlace, DateRent, Time }: any = formData;
    console.log("dataRent", pickUpPlace, returnPlace, DateRent, Time);

    if (!pickUpPlace || !returnPlace || !DateRent || !Time) {
      notification.warning({
        message: "แจ้งเตือน",
        description: "กรุณากรอกข้อมูลวันที่เวลาและสถานที่ให้ครบ.",
      });
      return;
    } else {
      navigate("/RentDetail", { state: { item, formData } });
    }

    // Proceed with form submission logic here
    // ...
  };

  //#endregion
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

  const [activeTabKey1, setActiveTabKey1] = useState<string>("บริการเช่ารถ");

  const onTab1Change = (key: string) => {
    setActiveTabKey1(key);
  };

  console.log("cars",car);
  
  useEffect(() => {
    // Iterate through all cars and update their status
    car.forEach((car) => {
      agent.Cars.updateStatusRent(car.carsId);
    });
  }, [car]);


  return (
    <>
      <Card
        style={{ width: "100%", backgroundColor: "#CDE1F8" }}
        // extra={<a href="#">More</a>}
        tabList={tabList}
        activeTabKey={activeTabKey1}
        onTabChange={onTab1Change}
      >
        {contentList[activeTabKey1]}
      </Card>
      <br />
      <br />
      <Row>
        {activeTabKey1 == "บริการเช่ารถ" ? (
          <>
            {car == null || car.length === 0 ? (
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
                {car.map((item) =>
                  item.statusCar == 0 ? (
                    <Col
                      key={item.carsId}
                      xl={6}
                      md={12}
                      sm={18}
                      style={{ margin: 10 }}
                    >
                      <Card
                        hoverable
                        cover={
                          <img
                            alt="example"
                            src="https://hips.hearstapps.com/hmg-prod/images/dw-burnett-pcoty22-8260-1671143390.jpg?crop=0.668xw:1.00xh;0.184xw,0&resize=640:*"
                            // src={item.imageCars}
                          />
                        }
                        onClick={() => handleFormSubmitRent(item)}
                      >
                        <Meta
                          title={item.carModel}
                          description={item.carBrand}
                        />
                      </Card>
                    </Col>
                  ) : null
                )}
              </>
            )}
          </>
        ) : (
          <>
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
                    <Col
                      key={item.itineraryId}
                      xl={9}
                      md={16}
                      sm={18}
                      style={{ margin: 5, padding: 10 }}
                    >
                      <Card hoverable>
                        <Row>
                          <Col
                            xl={9}
                            md={16}
                            sm={18}
                            style={{
                              borderRightWidth: 3,
                              borderRightStyle: "dotted",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography style={{ color: "gray" }}>
                              จาก
                            </Typography>
                            <Typography>{item.routeCars.originName}</Typography>
                            <Typography style={{ color: "gray" }}>
                              ถึง
                            </Typography>
                            <Typography>
                              {item.routeCars.destinationName}
                            </Typography>
                            <Typography style={{ color: "gray" }}>
                              เวลา
                            </Typography>
                            <Typography>{`${timeIssueTime} - ${timeArrival}`}</Typography>
                          </Col>
                          <Col xl={9} md={16} sm={18} style={{ margin: 15 }}>
                            <Typography style={{ color: "gray" }}>
                              หมายเลขรถ
                            </Typography>
                            <Typography>
                              {item.cars.carRegistrationNumber}
                            </Typography>
                            <Typography style={{ color: "gray" }}>
                              ราคา
                            </Typography>
                            <Typography>{item.cars.priceSeat}</Typography>

                            <Button
                              type="primary"
                              shape="round"
                              size="large"
                              style={{ backgroundColor: "#ffa39e", margin: 20 }}
                              onClick={() => handleFormSubmitฺBooking(item)}
                            >
                              รายละเอียด
                            </Button>
                          </Col>
                        </Row>
                      </Card>
                    </Col>
                  );
                })}
              </>
            )}
          </>
        )}
      </Row>
    </>
  );
};
