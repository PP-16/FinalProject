import { Card, Col, Row, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../api/redux/Store/configureStore";

import carseat from "../../../assets/car-seat.png";
import Booked from "../../../assets/carseat.png";
import checkSeats from "../../../assets/check.png";
import paySeat from "../../../assets/payseat.png";
import driver from "../../../assets/steering-wheel.png";
import doorIn from "../../../assets/dorIn.png";
import doorOut from "../../../assets/dorOut.png";

export const BusSeatLayout = ({ props, onSelectedSeatChange }: any) => {
  // console.log("Prop",props);
  const [selectedSeat, setSelectedSeat] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const SeatBooked = useAppSelector((t) => t.booking.seatBooked);
  const SeatBookingPending = useAppSelector((t) => t.booking.seatBookedPending);

  const handleSeatClick = (seatNumber: string) => {
    const updatedSeats = selectedSeat.includes(seatNumber)
      ? selectedSeat.filter((seat) => seat !== seatNumber)
      : [...selectedSeat, seatNumber];

    setSelectedSeat(updatedSeats);
    onSelectedSeatChange(updatedSeats);
  };

  //   const SeatComponent = ({ seatNumber, onSelectSeat, isSelected }: any) => {
  //     const isSeatBooked = SeatBooked.find((x) => x === seatNumber);
  //     const isSeatBookingPending = SeatBookingPending.find(
  //       (x) => x === isSeatBooked
  //     );

  //     return (
  //       <div
  //         style={{
  //           margin: 8,
  //           padding: 8,
  //           border: "2px solid",
  //           borderRadius: 8,
  //           cursor:
  //             isSeatBooked || isSeatBookingPending ? "not-allowed" : "pointer",
  //           opacity: isSeatBooked || isSeatBookingPending ? 0.5 : 1,
  //         }}
  //         onClick={() => onSelectSeat(seatNumber)}
  //       >
  //         <img
  //           src={
  //             isSeatBookingPending
  //               ? paySeat
  //               : isSeatBooked
  //               ? Booked
  //               : isSelected
  //               ? checkSeats
  //               : carseat
  //           }
  //           width={50}
  //           alt={`Seat ${seatNumber}`}
  //         />
  //         <Typography style={{ textAlign: "center" }}>{seatNumber}</Typography>
  //       </div>
  //     );
  //   };
  //   useEffect(() => {
  //     if (selectedSeat !== null && !tags.includes(`Seat ${selectedSeat}`)) {
  //       setTags([...tags, `Seat ${selectedSeat}`]);
  //     }
  //   }, [selectedSeat, tags]);

  //   const seatCols = ["A", "B", "C", "D"];

  //   const seatRows = Array.from(
  //     { length: props.cars.quantitySeat / seatCols.length },
  //     (_, index) => index + 1
  //   );
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

    const isLastRow = row === Math.ceil(props.cars.quantitySeat / columns);

    const seatStyle = {
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
      seatStyle.gridRow = Math.ceil(props.cars.quantitySeat / columns);
    }
    return (
      <div style={seatStyle} onClick={() => onSelectSeat(seatNumber)}>
        <img
          src={
            isSeatBookingPending
              ? paySeat
              : isSeatBooked
              ? Booked
              : isSelected
              ? checkSeats
              : carseat
          }
          width={50}
          alt={`Seat ${seatNumber}`}
        />
        <Typography style={{ textAlign: "center" }}>{seatNumber}</Typography>
      </div>
    );
  };
  const seatRows = Array.from(
    { length: Math.ceil(props.cars.quantitySeat / columns) },
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
          <Col span={4} style={{ justifyContent: "flex-end", display: "flex" }}>
            <Col
              style={{
                justifyContent: "space-evenly",
                marginTop: 65,
              }}
            >
              <Col>
                <div style={{ textAlign: "left" }}>
                  <img src={doorIn} width={60} />
                </div>
              </Col>
              {props.cars.quantitySeat >= 15 && (
                <Col>
                  <div style={{ textAlign: "left", marginTop: 560 }}>
                    <img src={doorOut} width={60} />
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
                <img src={driver} width={50} />
                <Typography style={{ textAlign: "center" }}>คนขับ</Typography>
              </Col>
            </Row>
            <Row style={{ justifyContent: "center", display: "flex" }}>
              <Col
                span={20}
                style={{
                  flexDirection: "column",
                }}
              >
                {seatRows.map((row) => (
                  <Row justify="space-between">
                    {/* Seats A and B */}
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

                    {/* Seats C and D */}
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
    </>
  );
};
