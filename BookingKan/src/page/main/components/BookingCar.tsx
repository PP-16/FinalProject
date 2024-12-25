import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Modal,
  Radio,
  Row,
  Steps,
  Typography,
  Upload,
  UploadProps,
  message,
  notification,
  theme,
  Image,
  RadioChangeEvent,
} from "antd";
import React, { useEffect, useState } from "react";
import { Itinerary } from "../../../api/models/Itinerary";
import { Car } from "../../../api/models/Cars";
import agent from "../../../api/agent";
import {
  fetchItinarery,
  searchItineraryAsync,
} from "../../../api/redux/Slice/ItinerarySlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import { unwrapResult } from "@reduxjs/toolkit";
import { InboxOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Input, { SearchProps } from "antd/es/input";
import moment from "moment";
import Lottie from "lottie-react";
import notfound from "../../../assets/lotti/Empty.json";
import { BusSeatLayout } from "../../details/components/BusSeatLayout";
import { Booking } from "../../../api/models/Booking";
import {
  CheckSeatEmptyAsync,
  CheckSeatPendingAsync,
  createEmployeeBookingsAsync,
  fetchBooking,
  updateStatusBookingAsync,
} from "../../../api/redux/Slice/BookingSlice";
import dayjs from "dayjs";
import { createPaymentAsync } from "../../../api/redux/Slice/PaymentSlice";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { RcFile } from "antd/es/upload";
import { RangePickerProps } from "antd/es/date-picker";
import {
  fetchCars,
  fetchCarsForRent,
} from "../../../api/redux/Slice/CarsSlice";
import { SystemSetting } from "../../../api/models/SystemSetting";
import { PathImage, imageLocal } from "../../../routers/PathImage";
const pathServer = import.meta.env.VITE_SERVER_QRCODE;
export const BookingCar = () => {
  // const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  // const [car, setCars] = useState<Car[]>([]);
  const itinerary: any = useAppSelector((t) => t.itinerary.itinerary);
  const BookedData: any = useAppSelector((t) => t.booking.booked);
  const PaymentData: any = useAppSelector((t) => t.payment.payments);
  const car: any = useAppSelector((t) => t.cars.carForRent);
  const system: any = useAppSelector((t) => t.system.system);
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const [details, setDetails] = useState<any>([]);
  const [formData, setFormData] = useState({});
  const [paymentmethod, setPaymentmethod] = useState<any>(0);
  const [modalSlipe, setModalSlipe] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageSlipeUrl, setImageSlipeUrl] = useState<string>();
  const [modalStripe, setModalStripe] = useState(false);
  const [countSeatEmpty, setCountSeatEmpty] = useState(Number);
  const { confirm } = Modal;
  const timeiss = dayjs(details.issueTime).format("HH:mm  A");
  const timearrive = dayjs(details.arrivalTime).format("HH:mm  A");
  const currentDate = dayjs().format();
  const DateBookind = moment(details.formDate).format("Do MM YYYY");
  const [formDate, setFormDate] = useState<any>(currentDate);
  const disabledDate: RangePickerProps["disabledDate"] = (current: any) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  //#region  handleIinerary
  const dateBooking = moment(formDate).format("YYYY-MM-DDTHH:mm:ss");
  const handleSelectItinerary = (item: any) => {
    setDetails({ item, formDate: dateBooking });
    next();
  };

  const onSearch: SearchProps["onSearch"] = (value, _: any, info) => {
    console.log(info?.source, value);
    try {
      const actionResult: any = dispatch(searchItineraryAsync(value));
      const itineraryResult = unwrapResult(actionResult);
      console.log("itineraryResult", itineraryResult);

      // Set the received data into the itinerary state
      // setItinerary(itineraryResult);
    } catch (error) {
      console.log("error", error);
    }
  };
  const { Search } = Input;

  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const handleSelectedSeatChange = (updatedSeats: string[]) => {
    setSelectedSeat(updatedSeats);
  };
  const SeatBooked = useAppSelector((t) => t.booking.seatBooked);
  const SeatBookingPending = useAppSelector((t) => t.booking.seatBookedPending);

  console.log("SeatBooked", SeatBooked);
  console.log("SeatBookingPending", SeatBookingPending);

  const checkSeat = async () => {
    const Id = details.item?.itineraryId;
    if (!Id) return;
    console.log("Id", Id);

    try {
      await dispatch(CheckSeatEmptyAsync({ ItineraryId: Id, dateBooking }));
      await dispatch(CheckSeatPendingAsync({ ItineraryId: Id, dateBooking }));
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // Fetch cars and itineraries
    // agent.Cars.getCarForRents().then((car) => setCars(car));
    dispatch(fetchCarsForRent());
    dispatch(fetchCars());
    dispatch(fetchItinarery());

    if (details.item?.itineraryId) {
      checkSeat();
    }
  }, [details]);

  const calculateAvailableSeats = ({
    totalSeats,
    bookedSeats,
    pendingSeats,
  }: any) => {
    return totalSeats - bookedSeats.length - pendingSeats.length;
  };

  //#endregion

  //#region  handleBooking

  // const defaultDateFormatted = moment(formDate).format();

  const handleBooking = async () => {
    const { passengerName, idCardNumber, email, phone, note }: any = formData;
    if (!passengerName || !idCardNumber || !email || !phone) {
      return notification.error({
        message: "ผิดพลาด",
        description: "กรุณากรอกข้อมูลผู้โดยสารให้ครบถ้วน.",
      });
    }
    const totalPrice = selectedSeat.length * details.item.cars.priceSeat;
    try {
      const bookingDto = {
        bookingId: 0,
        passengerName: passengerName,
        idCardNumber: idCardNumber,
        email: email,
        phone: phone,
        dateAtBooking: formDate,
        seatNumbers: selectedSeat.map((item) => item.toString()),
        totalPrice: totalPrice,
        itineraryId: details.item.itineraryId,
        note: note,
      };
      console.log("bDTo", bookingDto);
      await dispatch(createEmployeeBookingsAsync(bookingDto)).then(() =>
        next()
      );
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region  payment

  const handlePayment = async () => {
    console.log("paymentmethod", paymentmethod);

    try {
      const PaymentDto = {
        paymentBookingId: 0,
        paymentIntentId: "",
        clientSecret: "",
        bookingId: BookedData.bookingId,
        ImagePayment: imageSlipeUrl || "",
        // orderRentId :number,
        categoryPayment: paymentmethod,
      };
      console.log("PaymentDto", PaymentDto);
      await dispatch(createPaymentAsync(PaymentDto));
      if (paymentmethod != 2) {
        dispatch(
          updateStatusBookingAsync({
            ID: BookedData.bookingId,
            statusBooking: 2,
          })
        );
      } else {
        setModalStripe(true);
      }
      dispatch(fetchBooking()).then(() => prev());
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  //#region stripe
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);

    if (e.target.value == "0") {
      setModalSlipe(true);
      setPaymentmethod(e.target.value);
    }
    if (e.target.value == "1") {
      confirm({
        title: "ต้องการชำระด้วยเงินสด ?",
        icon: <QuestionCircleOutlined />,
        content: "กรุณาตรวจสอบยอดเงินให้ถูกต้อง",
        onOk() {
          setPaymentmethod(e.target.value);
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          setPaymentmethod(null);
        },
      });
    }
    setPaymentmethod(e.target.value);
  };
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  // const [detalis, setDetalis] = useState<Booking[]>([]);
  // const [payment, setPayment] = useState();
  // console.log("payment", payment);

  const handleSubmit = async (event: any) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (elements == null) {
      return;
    }
    if (!stripe) {
      setErrorMessage("Stripe has not been initialized");
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError }: any = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      console.log("submitError.message", submitError.message);
      return;
    }

    const clientSecret: any = PaymentData?.clientSecret || null;

    try {
      dispatch(
        updateStatusBookingAsync({
          ID: BookedData.bookingId,
          statusBooking: 2,
        })
      );
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: "http://127.0.0.1:5173/",
        },
      });

      // แสดง notification สำเร็จ
      notification.success({
        message: "สำเร็จ",
        description: "ขอบคุณที่จองรถกับเรา.",
      });
    } catch (error) {
      // กรณีเกิด error ในการ confirmPayment
      console.error(error);

      // ทำการแสดง notification ข้อผิดพลาด (ถ้าต้องการ)
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถทำการจองรถได้ กรุณาลองใหม่อีกครั้ง.",
      });
    }

    message.success("Payment successful!");
  };
  //#endregion

  //#region upload
  // type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  // const getBase64 = (img: FileType, callback: (url: string) => void) => {
  //   const reader = new FileReader();
  //   reader.addEventListener("load", () => callback(reader.result as string));
  //   reader.readAsDataURL(img);
  // };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    // multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      getBase64(info.file.originFileObj as RcFile).then((res) => {
        setImageUrl(res);
      });

      setImageSlipeUrl(originFileObj);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  //#endregion

  //#region handleStep
  const steps = [
    {
      title: "เลือกรอบรถ",
      content: () => (
        <>
          <Form>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} sm={24} md={10} xl={10} xxl={10}>
                <Form.Item>
                  <Search
                    placeholder="กรุณากรอกรอบเดินรถที่ต้องการ"
                    onSearch={onSearch}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={24} md={10} xl={10} xxl={10}>
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
                    defaultValue={dayjs(formDate)}
                    disabledDate={disabledDate}
                    // value={dayjs(formDate, "DD/MM/YYYY")}
                    format={"DD/MM/YYYY"}
                    onChange={(date) => {
                      console.log("date", date);
                      const newDate = dayjs(date).format("DD/MM/YYYY");
                      setFormDate(newDate);
                    }}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Card>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {itinerary == null || itinerary.length === 0 ? (
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                    <Lottie
                      loop={true}
                      autoPlay={true}
                      animationData={notfound}
                      height={"100%"}
                      width={"100%"}
                    />
                  </Col>
                </Row>
              ) : (
                <>
                  {itinerary.map((item: any) => {
                    // checkSeat(item.itineraryId)
                    console.log("itinerary", item?.cars.quantitySeat);
                    // const totalSeats = item.cars?.seat || 0;
                    // const bookedSeats = SeatBooked.filter(
                    //   (seat: any) => seat.itineraryId === item.itineraryId
                    // );
                    // const pendingSeats = SeatBookingPending.filter(
                    //   (seat: any) => seat.itineraryId === item.itineraryId
                    // );
                    // const availableSeats = calculateAvailableSeats({
                    //   totalSeats,
                    //   bookedSeats,
                    //   pendingSeats,
                    // });
                    const timeArrival = moment(item?.arrivalTime).format("LT");
                    const timeIssueTime = moment(item?.issueTime).format("LT");
                    return (
                      <Col
                        xs={24}
                        sm={24}
                        md={12}
                        xl={8}
                        xxl={8}
                        key={item.itineraryId}
                        style={{ marginTop: 10 }}
                      >
                        <Card
                          style={{ width: "100%" }}
                          hoverable
                          key={item.itineraryId}
                          onClick={() => handleSelectItinerary(item)}
                          title={`${item.routeCars.originName} - ${item.routeCars.destinationName}`}
                        >
                          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col
                              xs={12}
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
                                หมายเลขรถ
                              </Typography>
                              <Typography
                                style={{ color: "black", fontSize: 20 }}
                              >
                                {item.cars?.carRegistrationNumber}
                              </Typography>

                              <Typography style={{ color: "gray" }}>
                                เวลา
                              </Typography>
                              <Typography
                                style={{ color: "black", fontSize: 20 }}
                              >{`${timeIssueTime} - ${timeArrival}`}</Typography>
                            </Col>
                            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
                              <Typography style={{ color: "gray" }}>
                                ราคา
                              </Typography>
                              <Typography
                                style={{ color: "black", fontSize: 20 }}
                              >
                                {item?.cars?.priceSeat}
                              </Typography>
                            </Col>
                            {/* <p>จำนวนที่นั่งทั้งหมด: {totalSeats}</p>
                            <p>ที่นั่งที่ถูกจองแล้ว: {bookedSeats.length}</p>
                            <p>ที่นั่งที่รอดำเนินการ: {pendingSeats.length}</p>
                            <p>ที่นั่งที่ว่าง: {availableSeats}</p> */}
                          </Row>
                        </Card>
                      </Col>
                    );
                  })}
                </>
              )}
            </Row>
          </Card>
        </>
      ),
    },
    {
      title: "เลือกที่นั่ง",
      content: () => (
        <>
          <Card>
            <Row>
              <Col span={24}>
                <Card style={{ margin: 5 }}>
                  <Descriptions title="รายละเอียดการจองที่นั่ง">
                    <Descriptions.Item label="หมายเลขทะเบียนรถ">
                      {details.item.cars.carRegistrationNumber}
                    </Descriptions.Item>
                    <Descriptions.Item label="สถานีต้นทาง">
                      {details.item.routeCars.originName}
                    </Descriptions.Item>
                    <Descriptions.Item label="สถานีปลายทาง">
                      {details.item.routeCars.destinationName}
                    </Descriptions.Item>
                    <Descriptions.Item label="วันที่เดินทาง">
                      {DateBookind}
                    </Descriptions.Item>
                    <Descriptions.Item label="เวลาออกเดินทาง">
                      {timeiss}
                    </Descriptions.Item>
                    <Descriptions.Item label="เวลาที่ไปถึง">
                      {timearrive}
                    </Descriptions.Item>
                    <Descriptions.Item label="หมายเลขที่นั่ง">
                      {selectedSeat.length > 0
                        ? `${selectedSeat.join(", ")}`
                        : ""}
                    </Descriptions.Item>
                  </Descriptions>
                  <Form>
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                        <Form.Item
                          style={{ color: "gray" }}
                          name="passengerName"
                          label="ชื่อผู้เช่า"
                        >
                          <Input
                            placeholder="นางสาว ADB"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                passengerName: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                        <Form.Item
                          style={{ color: "gray" }}
                          name="idCardNumber"
                          label="หมายเลขบัตรประจำตัวประชาชน"
                        >
                          <Input
                            placeholder="xxxxx-xxxxxx-xx-x"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                idCardNumber: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                        <Form.Item
                          style={{ color: "gray" }}
                          name="email"
                          label="อีเมล์ผู้เช่า"
                        >
                          <Input
                            placeholder="xxxxx@gmail.com"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                        <Form.Item
                          style={{ color: "gray" }}
                          name="phone"
                          label="เบอร์โทรศัพท์"
                        >
                          <Input
                            placeholder="096-xxxx-xxx"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                        <Form.Item
                          style={{ color: "gray" }}
                          name="note"
                          label="หมายเหตุ"
                        >
                          <Input
                            placeholder="จุดรับส่งระหว่างทาง"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                note: e.target.value,
                              })
                            }
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Card>
              </Col>
              <Col span={24}>
                <Card style={{ margin: 5 }}>
                  <BusSeatLayout
                    props={details}
                    onSelectedSeatChange={handleSelectedSeatChange}
                  />
                </Card>
              </Col>
              <Button type="primary" block onClick={handleBooking}>
                ดำเนินการจอง
              </Button>
            </Row>
          </Card>
        </>
      ),
    },
    {
      title: "ชำระเงิน",
      content: () => (
        <>
          <Radio.Group size="small" onChange={onChange} value={paymentmethod}>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                <Radio value="0">
                  <Card title="สแกนจ่าย">
                    <img src={imageLocal.tarnfer} width={"100%"} />
                  </Card>
                </Radio>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                <Radio value="1">
                  <Card title="เงินสด">
                    <img src={imageLocal.cash} width={"100%"} />
                  </Card>
                </Radio>
              </Col>

              <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
                <Radio value="2">
                  <Card title="จ่ายผ่านบัตรเครดิต">
                    <img src={imageLocal.card} width={"100%"} />
                  </Card>
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </>
      ),
    },
  ];

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));
  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  //#endregion

  return (
    <>
      <Modal
        width={1000}
        open={modalStripe}
        onCancel={() => setModalStripe(false)}
        wrapClassName="vertical-center-modal"
      >
        <Card style={{ margin: 20 }}>
          <Form onFinish={handleSubmit}>
            <Form.Item>
              <PaymentElement />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={!stripe || !elements}
              >
                Pay
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>

      <Modal
        open={modalSlipe}
        onCancel={() => setModalSlipe(false)}
        onOk={() => setModalSlipe(false)}
        width={1000}
        wrapClassName="vertical-center-modal"
      >
        <>
          <Row>
            <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
              {system.map((itemSys: SystemSetting) => {
                const imgQr = PathImage.imagePayment + itemSys.imagePrompay;
                return <Image src={imgQr} width={350} />;
              })}
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
              <Card>
                <Dragger {...props}>
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: "100%" }}
                    />
                  ) : (
                    <>
                      <Row style={{ justifyContent: "center" }}>
                        <Col xs={12} sm={12} md={16} xl={24} xxl={24}>
                          <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                          </p>
                          <p className="ant-upload-text">อัพโหลดไฟล์</p>
                          <p className="ant-upload-hint">
                            ลากหรือเลือกรูปที่ต้องการ
                          </p>
                        </Col>
                      </Row>
                    </>
                  )}
                </Dragger>
              </Card>
            </Col>
          </Row>
        </>
      </Modal>

      <Steps current={current} items={items} />
      <Card style={contentStyle}>{steps[current].content()}</Card>

      <div style={{ marginTop: 24 }}>
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => handlePayment()}>
            เสร็จสิ้น
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            กลับ
          </Button>
        )}
      </div>
    </>
  );
};
