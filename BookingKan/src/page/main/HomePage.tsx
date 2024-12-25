import {
  Badge,
  Button,
  Card,
  Carousel,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
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
import { PathPublicRouter } from "../../routers/PathAllRoute";
import { NewsCrad } from "./components/NewsCrad";
import { fetchNews } from "../../api/redux/Slice/NewsSlice";
import dayjs from "dayjs";
import { RangePickerProps } from "antd/es/date-picker";
import { PathImage } from "../../routers/PathImage";

const { RangePicker } = DatePicker;

export const HomePageUser = () => {
  //#region headFrom

  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [top3, setTop3] = useState<any>([]);
  const [openNews, setOpenNews] = useState(true);
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
      navigate(PathPublicRouter.bookingDetail, { state: { item, formData } });
    }

    // Proceed with form submission logic here
    // ...
  };
  const disabledDate: RangePickerProps["disabledDate"] = (current: any) => {
    // Can not select days before today and today
    return current && current < dayjs().startOf("day");
  };
  //#endregion

  const [modalDetails, setModalDetails] = useState(false);
  const [dataModalDetails, setDataModalDetails] = useState<any>();

  const { Meta } = Card;
  const [car, setCars] = useState<Car[]>([]);

  const [itinerary, setItinerary] = useState<Itinerary[]>([]);

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
      setOpenNews(false);
    } catch (error) {
      console.log("error", error);
    }
  };
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };
  useEffect(() => {
    agent.Cars.getCarForRents().then((car) => setCars(car));
    agent.Itinerarys.getItinarery().then((itinerary) =>
      setItinerary(itinerary)
    );
    agent.Bookings.getTop3().then((top) => setTop3(top));
    dispatch(fetchNews());
  }, []);

  // console.log("cars", car);

  return (
    <>
      <Card
        style={{
          margin: 10,
        }}
      >
        <Form>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={18} md={12} xl={12} xxl={5}>
              <Form.Item name="OriginRoute" label="สถานที่ต้นทาง-ปลายทาง">
                <Input
                  placeholder="ค้นหาจุดขึ้น-ลงรถ"
                  onChange={(e) =>
                    setFormData({ ...formData, OriginRoute: e.target.value })
                  }
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={18} md={12} xl={12} xxl={5}>
              <Button
                type="primary"
                shape="round"
                block
                style={{
                  backgroundColor: "#4F6F52",
                  color: "#fff",
                }}
                onClick={() => sreachItinerary()}
              >
                ค้นหาเส้นทาง
              </Button>
            </Col>

            <Col xs={24} sm={18} md={12} xl={12} xxl={5}>
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
                  placeholder="เลือกวันที่ต้องการเดินทาง"
                  disabledDate={disabledDate}
                  onOpenChange={setOpen}
                  style={{ width: "100%" }}
                  onChange={(e) => setFormData({ ...formData, DateBooking: e })}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
              <Form.Item name="QuantityPassenger" label="จำนวณผู้โดยสาร">
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={10}
                  defaultValue={1}
                  onChange={(e: any) =>
                    setFormData({ ...formData, QuantityPassenger: e })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 32 }}>
        {itinerary.length != 0 ? (
          <Col xs={24} sm={24} md={24} xl={24} xxl={24} style={{ margin: 12 }}>
            <Typography style={{ fontSize: 30 }}>
              รอบการเดินรถยอดนิยม
            </Typography>
          </Col>
        ) : (
          <Col xs={24} sm={24} md={24} xl={24} xxl={24} style={{ margin: 12 }}>
            <Typography style={{ fontSize: 30 }}>
              ไม่พบเส้นทาง
            </Typography>
          </Col>
        )}
        {top3.map((itemTop: any) => {
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
                      style={{ marginTop: 10 }}
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
      {openNews == true && (
        <div style={{ marginTop: 30, marginBottom: 30 }}>
          <NewsCrad
            dataDetails={setDataModalDetails}
            openDetails={setModalDetails}
          />
        </div>
      )}
      <Modal
        width={1000}
        open={modalDetails}
        onCancel={() => setModalDetails(false)}
        footer={null}
      >
        <>
          {dataModalDetails && (
            <Card
              style={{ marginTop: 20 }}
              title={dataModalDetails.newsName}
              headStyle={{ fontSize: 20 }}
            >
              <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 32 }}>
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                  <Carousel autoplay draggable>
                    {dataModalDetails.imageNews.map((imageS: any) => {
                      // console.log("imageS", imageS);
                      const mapImg = PathImage.imageNews + imageS.images;
                      return (
                        <div>
                          <img style={{ width: "100%" }} src={mapImg}></img>
                        </div>
                      );
                    })}
                  </Carousel>
                </Col>
              </Row>

              <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 32 }}>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  xl={24}
                  xxl={24}
                  style={{ margin: 12 }}
                >
                  <Typography style={{ fontSize: 18 }}>รายละเอียด</Typography>
                </Col>
                <Col>
                  <Typography.Paragraph>
                    {dataModalDetails.newsDetails}
                  </Typography.Paragraph>
                </Col>
              </Row>
            </Card>
          )}
        </>
      </Modal>
      <Row gutter={{ xs: 8, sm: 16, md: 18, lg: 32 }}>
        {itinerary == null || itinerary.length === 0 ? (
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            style={{ flex: 1, justifyContent: "center" }}
          >
            <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
              <Lottie loop={true} autoPlay={true} animationData={notfound} />
            </Col>
          </Row>
        ) : (
          <>
            {itinerary.map((item) => {
              const timeArrival = moment(item.arrivalTime).format("LT");
              const timeIssueTime = moment(item.issueTime).format("LT");
              return (
                <Col
                  xs={24}
                  sm={18}
                  md={12}
                  xl={8}
                  xxl={8}
                  style={{ marginTop: 10 }}
                  key={item.itineraryId}
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
                        <Typography style={{ color: "gray" }}>จาก</Typography>
                        <Typography>{item.routeCars.originName}</Typography>
                        <Typography style={{ color: "gray" }}>ถึง</Typography>
                        <Typography>
                          {item.routeCars.destinationName}
                        </Typography>
                        <Typography style={{ color: "gray" }}>เวลา</Typography>
                        <Typography>{`${timeIssueTime} - ${timeArrival}`}</Typography>
                      </Col>
                      <Col style={{ margin: 2 }}>
                        <Typography style={{ color: "gray" }}>
                          หมายเลขรถ
                        </Typography>
                        <Typography>
                          {item?.cars?.carRegistrationNumber}
                        </Typography>
                        <Typography style={{ color: "gray" }}>ราคา</Typography>
                        <Typography>{item?.cars?.priceSeat}</Typography>

                        <Button
                          type="primary"
                          shape="round"
                          style={{
                            backgroundColor: "#4F6F52",
                            color: "#fff",
                          }}
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
      </Row>
    </>
  );
};
