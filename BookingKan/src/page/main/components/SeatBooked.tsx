import { Card, Col, Row, Space, Typography, notification } from "antd";
import React, { useEffect, useState } from "react";

import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";

import {
  CheckSeatEmptyAsync,
  CheckSeatPendingAsync,
} from "../../../api/redux/Slice/BookingSlice";
import { imageLocal } from "../../../routers/PathImage";
import loadingLottie from "../../../assets/lotti/bussLoading.json";
import Lottie from "lottie-react";

export const SeatBookedLayout = ({ props, onSelectedSeatChange }: any) => {
  console.log("props", props);
  const dispatch = useAppDispatch();

  const checkSeat = async () => {
    const ID = props.itineraryId;
    const dateBooking = props.dateAtBooking;
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

  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const SeatBooked: any = useAppSelector((t) => t.booking.seatBooked) || [];
  const loading: boolean = useAppSelector((t) => t.booking.loading);
  const SeatBookingPending: any =
    useAppSelector((t) => t.booking.seatBookedPending) || [];

  const handleSeatClick = (seatNumber: string) => {
    const updatedSeats = selectedSeat.includes(seatNumber)
      ? selectedSeat.filter((seat) => seat !== seatNumber)
      : [...selectedSeat, seatNumber];

    if (updatedSeats.length <= props.seatNumbers.length) {
      setSelectedSeat(updatedSeats);
      onSelectedSeatChange(updatedSeats);
    } else {
      notification.error({
        message: "ล้มเหลว",
        description: `จำนวณที่นั่งที่เลือกใหม่ไม่ถูกต้อง กรุณาเลือกที่นั่งใหม่.`,
      });
    }
  };

  const columns = 4;
  const SeatComponent = ({ seatNumber, onSelectSeat, isSelected }: any) => {
    // const isSeatBooked = SeatBooked.includes(seatNumber);
    console.log("SeatBooked",SeatBooked);
    console.log("seatNumber",seatNumber);
    const isSeatBooked = SeatBooked.find((x:any) => x === seatNumber) || ""; 
    console.log("SeatBookingPending",SeatBookingPending);
    
    const isSeatBookingPending = SeatBookingPending.find(
      (x:any) => x === isSeatBooked
    )|| "";

    
    // const isSeatBookingPending = SeatBookingPending.includes(seatNumber);
    const userBookedSeat = props.seatNumbers.map((x: any) => x.toString());
    const isUserBooked = userBookedSeat.includes(seatNumber);

    const row = Math.ceil(seatNumber / columns);
    const column = ((seatNumber - 1) % columns) + 1;
    const isDriverSeat = seatNumber === 1;
    const isDoor = seatNumber === 2 || seatNumber === 3;
    const isLastRow =
      row === Math.ceil(props.itinerary.cars.quantitySeat / columns);

    const seatStyle: any = {
      width: 80,
      height: 90,
      margin: 8,
      padding: 8,
      border: "2px solid",
      borderRadius: 8,
      cursor: isSeatBooked || isSeatBookingPending ? "not-allowed" : "pointer",
      opacity: isSeatBooked || isSeatBookingPending ? 0.5 : 1,
      gridRow: row,
      gridColumn: column,
      position: "relative",
    };

    if (isDriverSeat) {
      seatStyle.gridColumn = columns;
      seatStyle.gridRow = 1;
    }

    if (isDoor) {
      seatStyle.gridRow = row;
      seatStyle.gridColumn = 1;
    }

    if (isLastRow) {
      seatStyle.gridRow = Math.ceil(
        props.itinerary.cars.quantitySeat / columns
      );
    }

    return (
      <div style={seatStyle} onClick={() => onSelectSeat(seatNumber)}>
        <img
          src={
            isUserBooked
              ? imageLocal.myseat
              : isSeatBookingPending
              ? imageLocal.paySeat
              : isSeatBooked
              ? imageLocal.Booked
              : isSelected
              ? imageLocal.checkSeats
              : imageLocal.carseat
          }
          width={50}
          alt={`Seat ${seatNumber}`}
        />
        <Typography style={{ textAlign: "center" }}>{seatNumber}</Typography>
      </div>
    );
  };

  const seatRows = Array.from(
    { length: Math.ceil(props.itinerary.cars.quantitySeat / columns) },
    (_, index) => index + 1
  );

  useEffect(() => {
    if (selectedSeat !== null && !tags.includes(`Seat ${selectedSeat}`)) {
      setTags([...tags, `Seat ${selectedSeat}`]);
    }
    checkSeat()
  }, [selectedSeat, tags]);
  return (
   <>
    {loading ? (
      <Row
        gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
        style={{ flex: 1, justifyContent: "center" }}
      >
        <Col xs={24} sm={18} md={12} xl={24} xxl={24}>
          <Lottie loop={true} autoPlay={true} animationData={loadingLottie} />
        </Col>
      </Row>
    ) :( 
    <Space direction="vertical" style={{ width: "100%" }}>
    <Row>
      <Col span={4} style={{ justifyContent: "flex-end", display: "flex" }}>
        <Col style={{ justifyContent: "space-evenly", marginTop: 65 }}>
          <Col>
            <div style={{ textAlign: "left" }}>
              <img src={imageLocal.doorIn} width={60} />
            </div>
          </Col>
          {props.itinerary.cars.quantitySeat >= 15 && (
            <Col>
              <div style={{ textAlign: "left", marginTop: 560 }}>
                <img src={imageLocal.doorOut} width={60} />
              </div>
            </Col>
          )}
        </Col>
      </Col>
      <Col
        span={18}
        style={{
          border: "2px solid",
          borderRadius: 10,
          margin: 10,
          padding: 10,
        }}
      >
        <Row>
          <Col span={15}></Col>
          <Col
            style={{
              border: "2px solid",
              borderRadius: 8,
              width: 105,
              justifyContent: "center",
              display: "flex",
              alignItems: "center",
              height: 70,
            }}
          >
            <img src={imageLocal.driver} width={50} />
            <Typography style={{ textAlign: "center" }}>คนขับ</Typography>
          </Col>
        </Row>
        <Row style={{ justifyContent: "center", display: "flex" }}>
          <Col span={20} style={{ flexDirection: "column" }}>
            {seatRows.map((row) => (
              <Row justify="space-between">
                <Col span={12}>
                  <Row>
                    <Col span={10}>
                      <SeatComponent
                        seatNumber={`A${row}`}
                        onSelectSeat={handleSeatClick}
                        isSelected={selectedSeat.includes(`A${row}`)}
                      />
                    </Col>
                    <Col span={10}>
                      <SeatComponent
                        seatNumber={`B${row}`}
                        onSelectSeat={handleSeatClick}
                        isSelected={selectedSeat.includes(`B${row}`)}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col span={12}>
                  <Row>
                    <Col span={10}>
                      <SeatComponent
                        seatNumber={`C${row}`}
                        onSelectSeat={handleSeatClick}
                        isSelected={selectedSeat.includes(`C${row}`)}
                      />
                    </Col>
                    <Col span={10}>
                      <SeatComponent
                        seatNumber={`D${row}`}
                        onSelectSeat={handleSeatClick}
                        isSelected={selectedSeat.includes(`D${row}`)}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}
          </Col>
        </Row>
      </Col>
    </Row>
  </Space>
  )}
   
   </>
  );
};
