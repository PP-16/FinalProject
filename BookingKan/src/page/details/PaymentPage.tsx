import React, { useEffect, useState } from "react";
import {
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Form,
  Input,
  Button,
  Spin,
  Alert,
  Card,
  Row,
  Col,
  Typography,
  notification,
  Space,
  message,
  Modal,
  Descriptions,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import agent from "../../api/agent";
import { Booking } from "../../api/models/Booking";
import { log } from "console";
import moment from "moment";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { updateStatusBookingAsync } from "../../api/redux/Slice/BookingSlice";

export const PaymentForm = ({ visible, bookingData,cancel }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState(null);
  const [detalis, setDetalis] = useState<Booking[]>([]);
const [payment,setPayment]=useState()
  const dispatch = useAppDispatch();

  console.log("bookingData", bookingData);
  console.log("payment", payment);

  const handleSubmit = async (event: any) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      console.log("submitError.message", submitError.message);
      return;
    }

    const clientSecret = payment.clientSecret;

    try {
      // ทำการ confirmPayment
      dispatch( updateStatusBookingAsync({ ID: bookingData, statusBooking: 2 }));
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: "http://127.0.0.1:5173/AccountPage",
        },
      });
    
      // แสดง notification สำเร็จ
      notification.success({
        message: 'สำเร็จ',
        description: 'ขอบคุณที่จองรถกับเรา.',
      });
    
    } catch (error) {
      // กรณีเกิด error ในการ confirmPayment
      console.error(error);
    
      // ทำการแสดง notification ข้อผิดพลาด (ถ้าต้องการ)
      notification.error({
        message: 'เกิดข้อผิดพลาด',
        description: 'ไม่สามารถทำการจองรถได้ กรุณาลองใหม่อีกครั้ง.',
      });
    }
    
    if (error) {
      message.error(error.message);
      // setErrorMessage(error.message);
      console.log("error.message", error.message);
    }
    message.success("Payment successful!");
  };

  useEffect(() => {
    agent.Bookings.getBookingById(bookingData).then((item) =>
      setDetalis(item)
    );
    agent.Bookings.getBookingPaymentById(bookingData).then((item)=>setPayment(item))
  }, []);
  console.log("detalis", detalis);

  return (
    <Modal
      open={visible}
      width={900}
      footer={null}
      onCancel={()=>cancel(false)}
      wrapClassName="vertical-center-modal"
    >
      {detalis.map((itemD: any) => {
        const data = moment(itemD.dateAtBooking).format("Do MMM YY")
        const timeIss = moment(itemD.itinerary.issueTime).format('LT')
        const timeArri = moment(itemD.itinerary.arrivalTime).format('LT')
        return (
          <Card style={{ margin: 20 }}>
            <Descriptions title="Deatail Booking">
              <Descriptions.Item label="วันที่เดินทาง">
                {data}
              </Descriptions.Item>
              <Descriptions.Item label="เวลาที่รถออก">
                {timeIss}
              </Descriptions.Item>
              <Descriptions.Item label="เวลาที่ไปถึง">
                {timeArri}
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขรถ">
                {itemD.itinerary.cars.carRegistrationNumber}
              </Descriptions.Item>
              <Descriptions.Item label="สถานีต้นทาง">
                {itemD.itinerary.routeCars.originName}
              </Descriptions.Item>
              <Descriptions.Item label="สถานีปลายทาง">
                {itemD.itinerary.routeCars.destinationName}
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขที่นั่ง">
                {itemD.seatsSerialized}
              </Descriptions.Item>
              <Descriptions.Item label="ราคารวม">
               {itemD.totalPrice}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        );
      })}
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
        
          {errorMessage && message.error(errorMessage)}
        </Form>
      </Card>
    </Modal>
  );
};
