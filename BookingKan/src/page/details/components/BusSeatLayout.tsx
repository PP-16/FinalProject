import { Col, Row, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";

import {
  CheckSeatEmptyAsync,
  CheckSeatPendingAsync,
} from "../../../api/redux/Slice/BookingSlice";
import { imageLocal } from "../../../routers/PathImage";

export const BusSeatLayout = ({ props, onSelectedSeatChange }: any) => {
  console.log("Prop", props);
  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const SeatBooked = useAppSelector((t) => t.booking.seatBooked);
  const SeatBookingPending = useAppSelector((t) => t.booking.seatBookedPending);
  const dispatch = useAppDispatch();
  const handleSeatClick = (seatNumber: string) => {
    const updatedSeats = selectedSeat.includes(seatNumber)
      ? selectedSeat.filter((seat) => seat !== seatNumber)
      : [...selectedSeat, seatNumber];

    setSelectedSeat(updatedSeats);
    onSelectedSeatChange(updatedSeats);
  };
  const checkSeat = async () => {
    const ID = props.item.itineraryId;
    const dateBooking =props.formDate|| props.formData.dateBooking;
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
  console.log("SeatBooked", SeatBooked);

  const columns = 4;
  const SeatComponent = ({ seatNumber, onSelectSeat, isSelected }: any) => {
    const isSeatBooked = SeatBooked.find((x) => x === seatNumber.toString());
    const isSeatBookingPending = SeatBookingPending.find(
      (x) => x === isSeatBooked
    );

    const row = Math.ceil(seatNumber / columns);
    const column = ((seatNumber - 1) % columns) + 1; // Adjusted the column calculation
    const isDriverSeat = seatNumber === 1;
    const isDoor = seatNumber === 2 || seatNumber === 3;

    const isLastRow = row === Math.ceil(props.item?.cars.quantitySeat / columns);

    const seatStyle:any = {
      width: "100%",
      height: "100%",
      // margin: 8,
      // padding: 8,
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
      seatStyle.gridRow = Math.ceil(props.item?.cars.quantitySeat / columns);
    }
    return (
      <div style={seatStyle} onClick={() => onSelectSeat(seatNumber)}>
        <img
          src={
            isSeatBookingPending
              ? imageLocal.paySeat
              : isSeatBooked
              ? imageLocal.Booked
              : isSelected
              ? imageLocal.checkSeats
              : imageLocal.carseat
          }
          width={"100%"}
          alt={`Seat ${seatNumber}`}
        />
        <Typography style={{ textAlign: "center" }}>{seatNumber}</Typography>
      </div>
    );
  };
  const seatRows = Array.from(
    { length: Math.ceil(props.item.cars?.quantitySeat / columns) },
    (_, index) => index + 1
  );

  useEffect(() => {
    if (selectedSeat !== null && !tags.includes(`Seat ${selectedSeat}`)) {
      setTags([...tags, `Seat ${selectedSeat}`]);
    }
  }, [selectedSeat, tags]);

  return (
    <>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Row>
          <Col
            xs={4}
            sm={4}
            md={4}
            xl={4}
            xxl={4}
            style={{ justifyContent: "flex-end", display: "flex" }}
          >
            <Col
              style={{
                justifyContent: "space-evenly",
                marginTop: 65,
              }}
            >
              <Col>
                <div style={{ textAlign: "left" }}>
                  <img src={imageLocal.doorIn} width={"100%"} />
                </div>
              </Col>
              {props.item.cars?.quantitySeat >= 15 && (
                <Col>
                  <div style={{ textAlign: "left", marginTop: 560 }}>
                    <img src={imageLocal.doorOut} width={"100%"} />
                  </div>
                </Col>
              )}
            </Col>
          </Col>
          <Col
            xs={18}
            sm={18}
            md={18}
            xl={18}
            xxl={18}
            style={{
              border: "2px solid",
              borderRadius: 10,
              margin: 10,
              padding: 10,
            }}
          >
            <Row>
              <Col xs={14} sm={14} md={14} xl={14} xxl={14}></Col>
              <Col
                xs={6}
                sm={6}
                md={6}
                xl={6}
                xxl={6}
                style={{
                  border: "2px solid",
                  borderRadius: 8,
                  width: "100%",
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  height: "70%",
                }}
              >
                <img src={imageLocal.driver} width={"50%"} />
                <Typography style={{ textAlign: "center" }}>คนขับ</Typography>
              </Col>
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ justifyContent: "center", display: "flex" }}
            >
              <Col
                xs={20}
                sm={20}
                md={20}
                xl={20}
                xxl={20}
                style={{
                  flexDirection: "column",
                }}
              >
                {seatRows.map((row) => (
                  <Row
                    gutter={{ xs: 8, sm: 8, md: 8, lg: 8 }}
                    justify="space-between"
                  >
                    {/* Seats A and B */}
                    <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
                      <Row gutter={{ xs: 8, sm: 8, md: 8, lg: 8 }}>
                        <Col xs={10} sm={10} md={10} xl={10} xxl={10} style={{marginTop:10}}>
                          <SeatComponent
                            seatNumber={`A${row}`}
                            onSelectSeat={handleSeatClick}
                            isSelected={selectedSeat.includes(`A${row}`)}
                          />
                        </Col>
                        <Col xs={10} sm={10} md={10} xl={10} xxl={10} style={{marginTop:10}}>
                          <SeatComponent
                            seatNumber={`B${row}`}
                            onSelectSeat={handleSeatClick}
                            isSelected={selectedSeat.includes(`B${row}`)}
                          />
                        </Col>
                      </Row>
                    </Col>

                    {/* Seats C and D */}
                    <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
                      <Row gutter={{ xs: 8, sm: 8, md: 8, lg: 8 }}>
                        <Col xs={10} sm={10} md={10} xl={10} xxl={10} style={{marginTop:10}}>
                          <SeatComponent
                            seatNumber={`C${row}`}
                            onSelectSeat={handleSeatClick}
                            isSelected={selectedSeat.includes(`C${row}`)}
                          />
                        </Col>
                        <Col xs={10} sm={10} md={10} xl={10} xxl={10} style={{marginTop:10}}>
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
    </>
  );
};
