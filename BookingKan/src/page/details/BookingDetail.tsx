import {
  Button,
  Card,
  Carousel,
  Col,
  Input,
  Modal,
  Popconfirm,
  Row,
  Typography,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import moment from "moment";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { Booking } from "../../api/models/Booking";
import {
  CheckSeatEmptyAsync,
  CheckSeatPendingAsync,
  createBookingsAsync,
} from "../../api/redux/Slice/BookingSlice";
import { PaymentForm } from "./PaymentPage";
import { BusSeatLayout } from "./components/BusSeatLayout";
import {
  PathAccountRouter,
  PathPublicRouter,
} from "../../routers/PathAllRoute";
import { PathImage, imageLocal } from "../../routers/PathImage";

export const BookingDetail = () => {
  const isAuthenticated = localStorage.getItem("user");
  const user = isAuthenticated && JSON.parse(isAuthenticated);
  // console.log("isAuthenticated", user);
  const location = useLocation();
  const propsData = location.state;
  const [paymodal, setPaymodal] = useState(false);
  const navigate = useNavigate();
  const bookingData: any = useAppSelector((t) => t.booking.booked);
  const system = useAppSelector((t) => t.system.system);
  const [note, setNote] = useState("");
  // console.log("propsData", propsData);

  const dispatch = useAppDispatch();

  const details = propsData.item;
  const validate = propsData.formData;

  const dateBooking = moment(validate.DateBooking.$d).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const dateBookingShow = moment(validate.DateBooking.$d).format("Do MMM YY");

  const timeArrival = moment(details.arrivalTime).format("LT");
  const timeIssueTime = moment(details.issueTime).format("LT");

  //#region checkSeat
  const ID = details.itineraryId;

  const checkSeat = async () => {
    try {
      await dispatch(
        CheckSeatEmptyAsync({ ItineraryId: ID, dateBooking: dateBooking })
      );
      await dispatch(
        CheckSeatPendingAsync({ ItineraryId: ID, dateBooking: dateBooking })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    checkSeat();
  }, []);

  //#endregion

  //#region  seatManage
  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const handleSelectedSeatChange = (updatedSeats: string[]) => {
    setSelectedSeat(updatedSeats);
  };

  //#endregion

  const totalPrice = selectedSeat.length * details.cars.priceSeat;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    navigate(PathAccountRouter.login);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    navigate(PathAccountRouter.home);
  };
  //#region creatBooking
  const handleBooking = async () => {
    user == null && setIsModalOpen(true);

    try {
      const bookingDto = {
        dateAtBooking: dateBooking,
        seatNumbers: selectedSeat.map((item) => item.toString()),
        totalPrice: totalPrice,
        passengerId: user.passengerId,
        itineraryId: details.itineraryId,
        note: note,
      };
      console.log("bDTo", bookingDto);

      await dispatch(createBookingsAsync(bookingDto)).then(() => {
        message.success("จองสำเร็จ");
        checkSeat();
        navigate(PathPublicRouter.accountPage);
      });

      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region handlePaymentBooking
  const handlePaymentBooking = async () => {
    user == null && setIsModalOpen(true);

    try {
      const bookingDto = {
        dateAtBooking: dateBooking,
        seatNumbers: selectedSeat.map((item) => item.toString()),
        totalPrice: totalPrice,
        passengerId: user.passengerId,
        itineraryId: details.itineraryId,
        note: note,
      };
      console.log("bDTo", bookingDto);

      await dispatch(createBookingsAsync(bookingDto)).then(() => {
        checkSeat();
      });
      setPaymodal(true);
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  return (
    <>
      <Modal
        title="แจ้งเตือน"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <>
          <Typography>กรุณาเข้าสู่ระบบก่อนใช้งาน</Typography>
        </>
      </Modal>

      {paymodal == true && (
        <PaymentForm
          bookingData={bookingData.bookingId}
          visible={paymodal}
          cancel={setPaymodal}
        />
      )}
      <Row>
        <Card style={{ width: "100%" }}>
          <Row style={{ justifyContent: "center", alignItems: "center" }}>
            <Row style={{ flex: 1, justifyContent: "center" }}>
              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <img src={imageLocal.carseat} width={50} />
                <Typography>ที่นั่งที่ว่างอยู่</Typography>
              </Col>
            </Row>
            <Row style={{ flex: 1, justifyContent: "center" }}>
              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <img src={imageLocal.Booked} width={50} />
                <Typography>ที่นั่งที่ถูกจองแล้ว</Typography>
              </Col>
            </Row>

            <Row style={{ flex: 1, justifyContent: "center" }}>
              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <img src={imageLocal.paySeat} width={50} />
                <Typography>ที่นั่งที่ชำระแล้ว</Typography>
              </Col>
            </Row>
          </Row>
        </Card>
      </Row>
      <Row>
        <Col xs={24} sm={18} md={16} xl={12} xxl={12}>
          <Card style={{ width: "100%" }}>
            <BusSeatLayout
              props={propsData}
              onSelectedSeatChange={handleSelectedSeatChange}
            />
          </Card>
        </Col>
        <Col xs={24} sm={18} md={8} xl={12} xxl={12}>
          <Card>
            <Carousel autoplay draggable>
              {system.map((sys: any) =>
                sys?.imageSlide?.map((imageS: any) => {
                  // console.log("imageS", imageS);
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
            {/* <Carousel autoplay>
              <div>
                <Image
                  src="https://cdn.getyourguide.com/img/tour/5f449108c4917.jpeg/145.jpg"
                  width="100%"
                  style={contentStyle}
                ></Image>
              </div>
              <div>
                <Image
                  src="https://a.cdn-hotels.com/gdcs/production154/d494/c157904b-4f71-4aec-9db9-5e732d9e75f4.jpg"
                  width="100%"
                  style={contentStyle}
                ></Image>
              </div>
              <div>
                <Image
                  src="https://bangkokattractions.com/wp-content/uploads/2017/02/bangkok-to-kanchanaburi.jpg"
                  width="100%"
                  style={contentStyle}
                ></Image>
              </div>
              <div>
                <Image
                  src="https://stingynomads.com/wp-content/uploads/2016/09/Things-to-do-in-Kanchanaburi.-Erawan-national-park.jpg"
                  width="100%"
                  style={contentStyle}
                ></Image>
              </div>
            </Carousel> */}
          </Card>
          <Card
            title={`${details.routeCars.originName} - ${details.routeCars.destinationName}`}
            bordered={false}
            style={{ width: "100%" }}
          >
            <Row>
              <Typography style={{ color: "gray", fontSize: 15 }}>
                วันที่เดินทาง :
              </Typography>
              <Typography style={{ fontSize: 15 }}>
                {dateBookingShow}
              </Typography>
            </Row>

            <Row>
              <Typography style={{ color: "gray", fontSize: 15 }}>
                {" "}
                เวลาเดินทาง :{" "}
              </Typography>
              <Typography
                style={{ fontSize: 15 }}
              >{` ${timeIssueTime} - ${timeArrival}`}</Typography>
            </Row>

            <Row>
              <Typography style={{ color: "gray", fontSize: 15 }}>
                ราคาต่อที่นั่ง :
              </Typography>
              <Typography style={{ fontSize: 15 }}>
                {details.cars.priceSeat}
              </Typography>
            </Row>

            <Row>
              <Typography style={{ color: "gray", fontSize: 15 }}>
                หมายเหตุ :
              </Typography>
              <Input
                placeholder="โปรดระบุหากต้องการขึ้น/ลงระหว่างทาง"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </Row>

            <Row>
              <Typography style={{ color: "gray", fontSize: 20 }}>
                หมายเลขที่นั่ง :
              </Typography>
              <Typography style={{ fontSize: 20 }}>
                {selectedSeat.length > 0 ? `${selectedSeat.join(", ")}` : ""}
              </Typography>
            </Row>

            <Row>
              <Typography
                style={{ fontSize: 25, color: "gray", textAlign: "center" }}
              >
                ราคารวม :
              </Typography>
              <Typography style={{ fontSize: 25, textAlign: "center" }}>
                {totalPrice}
              </Typography>
            </Row>
            <Row>
              <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  onClick={handleBooking}
                  style={{
                    backgroundColor: "#4F6F52",
                    color: "#fff",
                  }}
                >
                  จอง
                </Button>
              </Col>

              <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                <Popconfirm
                  title="ชำระเงิน"
                  description="ต้องการชำระเงินเลยใช่หรือไม่"
                  onConfirm={handlePaymentBooking}
                >
                  <Button
                    type="primary"
                    shape="round"
                    size="large"
                    block
                    style={{ backgroundColor: "yellowgreen" }}
                  >
                    ชำระเงิน
                  </Button>
                </Popconfirm>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </>
  );
};
