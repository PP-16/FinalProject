import {
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Col,
  DatePicker,
  Form,
  Row,
  Space,
  Typography,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SeatBookedLayout } from "./SeatBooked";
import { useAppDispatch } from "../../../api/redux/Store/configureStore";
import {
  CheckSeatEmptyAsync,
  CheckSeatPendingAsync,
  updateDateBookingAsync,
} from "../../../api/redux/Slice/BookingSlice";
import { Booking } from "../../../api/models/Booking";
import moment from "moment";

export const ChangeDateBooking = () => {
  const props = useLocation();
  const data = props.state;
  const [formData, setFormData] = useState({});
  const [open, setOpen] = useState(false);
  const [modalsSeat, setModalsSeat] = useState(true);
  console.log("dataCheck", data);

  const dispatch = useAppDispatch();
  //#region checkSeat

  const [selectedSeat, setSelectedSeat] = useState<string[]>(data.seatNumbers);
  const handleSelectedSeatChange = (updatedSeats: string[]) => {
    setSelectedSeat(updatedSeats);
  };
  // console.log("sseee", selectedSeat);

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
  }, []);
  //#endregion

  //#region  updateHandels
  const handleFormSubmitฺBooking = async () => {
    const { DateBooking }: any = formData;
    console.log("DateBooking", DateBooking );

    if (!DateBooking) {
      notification.warning({
        message: "แจ้งเตือน",
        description: "กรุณากรอกวันที่ที่เดินทาง.",
      });
      return;
    }
    checkSeatNew(DateBooking);
    setModalsSeat(true);
  
    // if (selectedSeat != null)
    // const NewSeat = [];
    // selectedSeat != null ? NewSeat == selectedSeat : null;
  };

const handelUpdateDate =async () => {
  const { DateBooking }: any = formData;
  const dateBooking = moment(DateBooking.$d).format(
    "YYYY-MM-DDTHH:mm:ss"
  );
  try {
    const bookingDto: Booking = {
      dateAtBooking: dateBooking,
      seatNumbers: selectedSeat.map((item) => item.toString()),
      itineraryId: data.bookingId,
    };
    console.log("bDTo", bookingDto);

    await dispatch(updateDateBookingAsync(bookingDto));
  } catch (error) {
    console.log(error);
  }
}

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
