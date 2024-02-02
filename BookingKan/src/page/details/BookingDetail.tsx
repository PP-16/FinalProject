import {
  Button,
  Card,
  Carousel,
  Col,
  Image,
  Popconfirm,
  Row,
  Typography,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import carseat from "../../assets/car-seat.png";
import Booked from "../../assets/carseat.png";
import paySeat from "../../assets/payseat.png";
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

export const BookingDetail = () => {
  const isAuthenticated = localStorage.getItem("user");
  const user = isAuthenticated ? JSON.parse(isAuthenticated) : null;
  // console.log("isAuthenticated", user.passengerId);
  const location = useLocation();
  const propsData = location.state;
  const [paymodal, setPaymodal] = useState(false);
  const [bookingData, setBookingData] = useState<any>(null);

  const dispatch = useAppDispatch();

  const details = propsData.item;
  const validate = propsData.formData;
  // console.log("details", validate.DateBooking.$d);

  const dateBooking = moment(validate.DateBooking.$d).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  const dateBookingShow = moment(validate.DateBooking.$d).format("Do MMM YY");
  const contentStyle: React.CSSProperties = {
    height: "250px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

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

  const SeatBookingPending = useAppSelector((t) => t.booking.seatBookedPending);
  console.log("seatBookd", SeatBookingPending);

  //#endregion

  //#region  seatManage
  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const handleSelectedSeatChange = (updatedSeats: string[]) => {
    setSelectedSeat(updatedSeats);
  };

  //#endregion

  const totalPrice = selectedSeat.length * details.cars.priceSeat;

  //#region creatBooking
  const handleBooking = async () => {
    try {
      const bookingDto: Booking = {
        dateAtBooking: dateBooking,
        seatNumbers: selectedSeat.map((item) => item.toString()),
        totalPrice: totalPrice,
        passengerId: user.passengerId,
        itineraryId: details.itineraryId,
      };
      console.log("bDTo", bookingDto);

      const booking = await dispatch(createBookingsAsync(bookingDto)).then(() =>
        message.success("จองสำเร็จ")
      );
      setBookingData(booking.payload);
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  //#region handlePaymentBooking
  const handlePaymentBooking = async () => {
    try {
      const bookingDto: Booking = {
        dateAtBooking: dateBooking,
        seatNumbers: selectedSeat.map((item) => item.toString()),
        totalPrice: totalPrice,
        passengerId: user.passengerId,
        itineraryId: details.itineraryId,
      };
      console.log("bDTo", bookingDto);

      const booking = await dispatch(createBookingsAsync(bookingDto));
      setBookingData(booking.payload);
      setPaymodal(true);
    } catch (error) {
      console.log(error);
    }
  };
  //#endregion

  return (
    <>
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
              <Col span={8}>
                <img src={carseat} width={50} />
                <Typography>ที่นั่งที่ว่างอยู่</Typography>
              </Col>
            </Row>
            <Row style={{ flex: 1, justifyContent: "center" }}>
              <Col span={8}>
                <img src={Booked} width={50} />
                <Typography>ที่นั่งที่ถูกจองแล้ว</Typography>
              </Col>
            </Row>

            <Row style={{ flex: 1, justifyContent: "center" }}>
              <Col span={8}>
                <img src={paySeat} width={50} />
                <Typography>ที่นั่งที่ชำระแล้ว</Typography>
              </Col>
            </Row>
          </Row>
        </Card>
      </Row>
      <Row>
        <Col xl={15} md={12} sm={18}>
          <Card style={{ width: "100%" }}>
          <BusSeatLayout props={details} onSelectedSeatChange={handleSelectedSeatChange} />
            {/* {details.cars.quantitySeat > 15 ? (
              <BusSeatLayout props={details} onSelectedSeatChange={handleSelectedSeatChange} />
            ) : (
              <VanSeatLayout props={details} onSelectedSeatChange={handleSelectedSeatChange} />
            )} */}
          </Card>
        </Col>
        <Col xl={9} md={12} sm={18}>
          <Card>
            <Carousel autoplay>
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
            </Carousel>
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
            <Button
              type="primary"
              shape="round"
              size="large"
              block
              onClick={handleBooking}
              style={{ backgroundColor: "#ffa39e", margin: 20 }}
            >
              จอง
            </Button>
            <Popconfirm
              title="ชำระเงิน"
              description="ต้องการชำระเงินเลยใช่หรือไม่"
              onConfirm={handlePaymentBooking}
              onOpenChange={() => console.log("open change")}
            >
              <Button
                type="primary"
                shape="round"
                size="large"
                block
                style={{ backgroundColor: "#ffa39e", margin: 20 }}
              >
                ชำระเงิน
              </Button>
            </Popconfirm>
          </Card>
        </Col>
      </Row>
    </>
  );
};
