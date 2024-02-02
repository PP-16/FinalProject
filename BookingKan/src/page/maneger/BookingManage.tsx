import React, { useEffect, useState } from "react";
import { Booking } from "../../api/models/Booking";
import agent from "../../api/agent";
import { Badge, Button, Modal, Popconfirm, Table, message, notification } from "antd";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { updateStatusCarAsync } from "../../api/redux/Slice/CarsSlice";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { createRefundPaymentAsync, updateStatusBookingAsync } from "../../api/redux/Slice/BookingSlice";
import moment from "moment";

export const BookingManage = () => {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [modals, setModal] = useState(false);
  const { confirm } = Modal;
  const [statuscar, setStatusCar] = useState("");
  const [switchButt, setswitchButt] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    agent.Bookings.getBooking().then((booking) => setBooking(booking));
  }, []);

  // console.log("booking", booking);

  const columns = [
    {
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passengerName",
      key: "passengerName",
    },
    {
      title: "หมายเลขทะเบียนรถ",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
    },
    {
      title: "หมายเลขที่นั่ง",
      dataIndex: "seatsSerialized",
      key: "seatsSerialized",
    },

    { title: "ราคารวม", dataIndex: "totalPrice", key: "totalPrice" },
    {
      title: "วันที่เดินทาง",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "สถานะ",
      dataIndex: "statusText",
      key: "statusText",
      render: (dataIndex: any) => <Badge status="warning" text={dataIndex} />,
    },
    // {
    //   title: "แก้ไข",
    //   key: "operation",
    //   fixed: "right",
    //   render: (text: any, record: any) => (
    //     <Button type="dashed" onClick={() => setModal(record)}>
    //       แก้ไข
    //     </Button>
    //   ),
    //   width: 150,
    // },
    {
      title: "ยกเลิกการจอง",
      key: "operation",
      fixed: "right",
      render: (text: any, record: any) => {
        // console.log("cancelRecord", record);
        const iscancle = record.bookingStatus == 3;
        const isrefund = record.bookingStatus == 4;
        return (
          <>
            {iscancle ? (
              <>
              <Popconfirm
              title="ชำระเงิน"
              description="ต้องการชำระเงินเลยใช่หรือไม่"
              onConfirm={()=>handlerefund(record.key)}
          
              onOpenChange={() => console.log("open change")}
            >
              <Button
                type="primary"
                disabled={isrefund}
                
                onClick={() =>Sethandlerefund(record.key)}
                style={{ color: "#fff", backgroundColor: "green" }}
              >
                คืนเงิน
              </Button>
            </Popconfirm>
              </>
            ) : (
              <>
                <Button
                  onClick={() => showDeleteConfirm(record)}
                  type={switchButt ? "default" : "primary"}
                  disabled={isrefund}
                  style={
                    isrefund ?  {} : { color: "#fff", backgroundColor: "red" }
                  }
                >
                  ยกเลิก
                </Button>
              </>
            )}
          </>
        );
      },
      width: 150,
    },
  ];
  const dataSource = booking.map((item) => {
    const {
      bookingId,
      totalPrice,
      seatsSerialized,
      passenger,
      itinerary,
      dateAtBooking,
      bookingStatus,
    } = item;
    const { cars, arrivalTime, issueTime, routeCars, itineraryId } = itinerary;
    const { carRegistrationNumber, carsId } = cars;
    const { destinationName, originName, routeCarsId } = routeCars;
    const { passengerName, idCardNumber, email } = passenger;
   
   const date = moment(dateAtBooking).format("Do MMM YY"); 
   
    let statusText;

    switch (bookingStatus) {
      case 0:
        statusText = "ต้องชำระ";
        break;
      case 1:
        statusText = "กำลังดำเนินการ";
        break;
      case 2:
        statusText = "จ่ายเงินสำเร็จ";
        break;
      case 3:
        statusText = "ยกเลิก";
        break;
        case 4:
          statusText = "คืนเงินแล้ว";
          break;
      default:
        statusText = "Unknown Status";
    }
    const formattedItem = {
      key: bookingId,
      totalPrice,
      seatsSerialized,
      passenger,
      
      date,
      carRegistrationNumber,
      arrivalTime,
      issueTime,
      destinationName,
      originName,
      statusText,
      passengerName,
      idCardNumber,
      email,
      itineraryId,
      carsId,
      routeCarsId,
      bookingStatus,
    };

    return formattedItem;
  });

  // console.log("datasou", dataSource);

  const expandedRowRender = (record: any) => {
    const columns = [
      {
        title: "หมายเลขบัตรประจำตัวประชาชนผู้โดยสาร",
        dataIndex: "idCardNumber",
        key: "idCardNumber",
      },
      { title: "อีเมล์ผู้โดยสาร", dataIndex: "email", key: "email" },
      {
        title: "เวลาออกเดินทาง",
        dataIndex: "issueTime",
        key: "issueTime",
      },
      {
        title: "เวลาที่ไปถึง",
        dataIndex: "arrivalTime",
        key: "arrivalTime",
      },

      {
        title: "สถานที่ต้นทาง",
        dataIndex: "originName",
        key: "originName",
      },

      {
        title: "สถานที่ปลายทาง",
        dataIndex: "destinationName",
        key: "destinationName",
      },
    ];
    console.log("record", record);

    const data = [
      {
        key: record.key,
        idCardNumber: record.idCardNumber,
        email: record.email,
        issueTime: moment(record.issueTime).format('LT'),
        arrivalTime: moment(record.arrivalTime).format('LT'),
        originName: record.originName,
        destinationName: record.destinationName,
        bookingStatus: record.bookingStatus,
      },
    ];

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "Are you sure to delete this car?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        updateBooking(record.key);
        console.log("OK", record.key);
        // Add your delete logic here using the record object
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const updateBooking = async (bookingId: number) => {
    const status = 3;
    try {
      await dispatch(
        updateStatusBookingAsync({ ID: bookingId, statusBooking: status })
      );
      notification.success({
        message: "สำร็จ",
        description: "ยกเลิกการจองสำเร็จ.",
      });
      setswitchButt(true);
    } catch (error) {
      console.log("Error updating car:", error);
    }
  };
  const [payment, setPayment] = useState();
  
  const Sethandlerefund = async (bookingId: any) => {
    console.log("bookingId", bookingId);
    agent.Bookings.getBookingPaymentById(bookingId).then((item) =>
      setPayment(item)
    );
    // dispatch( updateStatusBookingAsync({ ID: bookingId, statusBooking: 4 }));
  };

  const handlerefund = async (bookingId: any) => {
    try {
      await dispatch(
        createRefundPaymentAsync(payment.paymentIntentId)
      );
       dispatch( updateStatusBookingAsync({ ID: bookingId, statusBooking: 4 }));
      setswitchButt(true);
    } catch (error) {
      console.log("Error updating car:", error);
    }
  };
  console.log("payment", payment);
  return (
    <>
      <Table
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={dataSource}
        size="small"
      />
    </>
  );
};
