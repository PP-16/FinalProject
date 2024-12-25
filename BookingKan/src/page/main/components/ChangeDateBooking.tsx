import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Row,
  Space,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SeatBookedLayout } from "./SeatBooked";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import {
  CheckSeatEmptyAsync,
  CheckSeatPendingAsync,
  updateDateBookingAsync,
} from "../../../api/redux/Slice/BookingSlice";
import moment from "moment";
import { PathPublicRouter } from "../../../routers/PathAllRoute";

export const ChangeDateBooking = () => {
  const props = useLocation();
  const data = props.state;
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [modalsSeat, setModalsSeat] = useState(false);
  const bookingData = useAppSelector((t) => t.booking.booked);
  const dispatch = useAppDispatch();
  const navigate = useNavigate()
  //#region checkSeat

  const ID = data.itineraryId;

  const checkSeat = async () => {
    try {
      await dispatch(
        CheckSeatEmptyAsync({
          ItineraryId: ID,
          dateBooking: data.dateAtBooking,
        })
      );
      await dispatch(
        CheckSeatPendingAsync({
          ItineraryId: ID,
          dateBooking: data.dateAtBooking,
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    checkSeat();
  }, [checkSeat]);

  const [selectedSeat, setSelectedSeat] = useState<string[]>(data.seatNumbers);
  const handleSelectedSeatChange = (updatedSeats: string[]) => {
    setSelectedSeat(updatedSeats);
  };
  // console.log("sseee", selectedSeat);

  
  //#endregion
  const { DateBooking }: any = formData;
  //#region  updateHandels
  const handleFormSubmitฺBooking = async () => {
 
    console.log("DateBooking", DateBooking);

    if (!DateBooking) {
      notification.warning({
        message: "แจ้งเตือน",
        description: "กรุณากรอกวันที่ที่เดินทาง.",
      });
      return;
    }
    checkSeatNew(DateBooking);
    setModalsSeat(true);

  };

  const handelUpdateDate = async () => {
    const { DateBooking }: any = formData;
    const dateBooking = moment(DateBooking.$d).format("YYYY-MM-DDTHH:mm:ss");
    try {
      const bookingDto = {
        dateAtBooking: dateBooking,
        seatNumbers: selectedSeat.map((item) => item.toString()),
        itineraryId: data.bookingId,
        note: data.note,
      };
      console.log("bDTo", bookingDto);

      await dispatch(updateDateBookingAsync(bookingDto)).then(() =>
       { 
        checkSeatNew(dateBooking);
        navigate(PathPublicRouter.accountPage)
       }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const checkSeatNew = async (newDateBooking: any) => {
    try {
      await dispatch(
        CheckSeatEmptyAsync({
          ItineraryId: ID,
          dateBooking: newDateBooking,
        })
      );
      await dispatch(
        CheckSeatPendingAsync({
          ItineraryId: ID,
          dateBooking: newDateBooking,
        })
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  //#endregion

  return (
    <Space
      direction="vertical"
      style={{
        width: "100%",
      }}
    >
      <Card>
        <Row>
          <Col>
            <Form>
              <Form.Item
                name="DateBooking"
                label="วันที่ต้องการจอง."
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
            </Form>
          </Col>
          <Col>
            <Button
              type="primary"
              shape="round"
              style={{
                backgroundColor: "#ffa39e",
              }}
              onClick={handleFormSubmitฺBooking}
            >
              เลือกวันที่
            </Button>
          </Col>
        </Row>
      </Card>
      {modalsSeat == true && (
        <Card title="ที่นั่งที่ต้องการเลือกใหม่">
          <SeatBookedLayout
            props={data}
            onSelectedSeatChange={handleSelectedSeatChange}
          />
        </Card>
      )}
      <Row>
        <Button
          type="primary"
          shape="round"
          block
          style={{
            backgroundColor: "#0958d9",
            margin: 10,
            padding: 5,
          }}
          onClick={handelUpdateDate}
        >
          เลือนวันที่จอง
        </Button>
      </Row>
    </Space>
  );
};
