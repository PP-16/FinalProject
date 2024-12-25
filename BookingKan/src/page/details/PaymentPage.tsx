import { useEffect, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Image,
  notification,
  message,
  Modal,
  Descriptions,
  UploadProps,
  Upload,
  Radio,
  RadioChangeEvent,
} from "antd";
import { useNavigate } from "react-router-dom";
import agent from "../../api/agent";
import { Booking } from "../../api/models/Booking";
import moment from "moment";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { updateStatusBookingAsync } from "../../api/redux/Slice/BookingSlice";
import { InboxOutlined } from "@ant-design/icons";
import { createPaymentAsync } from "../../api/redux/Slice/PaymentSlice";
import { PathPublicRouter } from "../../routers/PathAllRoute";
import { RcFile } from "antd/es/upload";
import { SystemSetting } from "../../api/models/SystemSetting";
import { PathImage, imageLocal } from "../../routers/PathImage";
const pathServer = import.meta.env.VITE_SERVER_QRCODE

export const PaymentForm = ({ visible, bookingData, cancel }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [detalis, setDetalis] = useState<Booking[]>([]);
  const [payment, setPayment] = useState();
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageSlipeUrl, setImageSlipeUrl] = useState<string>();
  const [paymentmethod, setPaymentmethod] = useState(null);
  const PaymentData = useAppSelector((t) => t.payment.payments);
  const system: any = useAppSelector((t) => t.system.system);
  const [setstateStripe, setsetstateStripe] = useState(false);
  const { confirm } = Modal;
  const navigate = useNavigate();
  // console.log("bookingData", bookingData);
  // console.log("PaymentData", PaymentData);

  useEffect(() => {
    agent.Bookings.getBookingById(bookingData).then((item) => setDetalis(item));
    agent.Bookings.getBookingPaymentById(bookingData).then((item) =>
      setPayment(item)
    );
  }, []);
  // console.log("detalis", detalis);
  const onChange = (e: RadioChangeEvent) => {
    // console.log("radio checked", e.target.value);
    setPaymentmethod(e.target.value);
  };

  //#region  payment

  const handlePayment = async () => {
    // console.log("paymentmethod", paymentmethod);

    try {
      const PaymentDto = {
        paymentBookingId: 0,
        paymentIntentId: "",
        clientSecret: "",
        bookingId: bookingData,
        ImagePayment: imageSlipeUrl || "",
        // orderRentId :number,
        categoryPayment: paymentmethod,
      };
      // console.log("PaymentDto", PaymentDto);
      await dispatch(createPaymentAsync(PaymentDto));
      dispatch(
        updateStatusBookingAsync({
          ID: bookingData,
          statusBooking: 2,
        })
      );
      if (paymentmethod == 0) {
        navigate(PathPublicRouter.accountPage);
      }
      setsetstateStripe(true);
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion
  //#region   handleStripe

  const handleSubmit = async (event: any) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (elements == null) {
      return;
    }
    if (!stripe) {
      setErrorMessage('Stripe has not been initialized');
      return;
    }
    // Trigger form validation and wallet collection
    const { error: submitError }:any = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      console.log("submitError.message", submitError.message);
      return;
    }

    const clientSecret:any = PaymentData?.clientSecret;

    try {
      // ทำการ confirmPayment
      // dispatch(updateStatusBookingAsync({ ID: bookingData, statusBooking: 2 }));
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `${pathServer}AccountPage`,
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
    onChange(info:any) {
      const { status, originFileObj } = info.file;

      // getBase64(info.file.originFileObj as FileType, (url) => {
      //   setImageUrl(url);
      // });

      getBase64(info.file.originFileObj as RcFile).then((res) => {
        setImageUrl(res);
    })        

      setImageSlipeUrl(originFileObj);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  //#endregion

  return (
    <Modal
      open={visible}
      width={1000}
      footer={null}
      onCancel={() => cancel(false)}
      wrapClassName="vertical-center-modal"
    >
      {detalis.map((itemD: any) => {
        const data = moment(itemD.dateAtBooking).format("Do MMM YY");
        const timeIss = moment(itemD.itinerary.issueTime).format("LT");
        const timeArri = moment(itemD.itinerary.arrivalTime).format("LT");
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
      <Row>
        <Col span={24}>
          <Radio.Group size="small" onChange={onChange} value={paymentmethod}>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ justifyContent: "center", flex: 1, display: "flex" }}
            >
              <Col xs={24} sm={18} md={12} xl={12} xxl={12}>
                <Radio value="0">
                  <Card title="สแกนจ่าย">
                    <img src={imageLocal.tarnfer} width={"100%"} />
                  </Card>
                </Radio>
              </Col>
              <Col xs={24} sm={18} md={12} xl={12} xxl={12}>
                <Radio value="2">
                  <Card title="จ่ายผ่านบัตรเครดิต">
                    <img src={imageLocal.card} width={"100%"} />
                  </Card>
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Col>
        {paymentmethod == 0 ? (
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
              {system.map((itemSys: SystemSetting) => {
                const imgQr = PathImage.imagePayment + itemSys.imagePrompay;
                return <Image src={imgQr} width={"100%"} />;
              })}
              </Col>
              <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                <Card style={{ width: "100%" }}>
                  <Dragger {...props} style={{ width: "100%" }}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
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
                    )}
                  </Dragger>
                </Card>
              </Col>
            </Row>
          </>
        ) : null}
        <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
          <Button type="primary" block onClick={() => handlePayment()}>
            เสร็จสิ้น
          </Button>
        </Col>
      </Row>

      {setstateStripe == true ? (
        <>
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
        </>
      ) : null}
    </Modal>
  );
};
