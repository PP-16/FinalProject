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
  Divider,
  Typography,
} from "antd";
import { Order } from "@stripe/stripe-js";
import agent from "../../api/agent";
import moment from "moment";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { InboxOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { createPaymentAsync } from "../../api/redux/Slice/PaymentSlice";
import {
  CheckPaiedOrderPastAsync,
} from "../../api/redux/Slice/OrderRentSlice";
import { Payment } from "../../api/models/Payment";
import { RcFile } from "antd/es/upload";
import { SystemSetting } from "../../api/models/SystemSetting";
import { PathImage, imageLocal } from "../../routers/PathImage";
const pathServer = import.meta.env.VITE_SERVER_QRCODE

export const OrderPastPaymentPage = ({ visible, orderRentId, cancel }: any) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [details, setDetalis] = useState<Order[]>([]);
  const [payment, setPayment] = useState();
  const dispatch = useAppDispatch();
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageSlipeUrl, setImageSlipeUrl] = useState<string>();
  const [paymentmethod, setPaymentmethod] = useState(null);
  const PaymentData = useAppSelector((t) => t.payment.payments);
  const system: any = useAppSelector((t) => t.system.system);
  const [setstateStripe, setsetstateStripe] = useState(false);
  const [ordersPastDueId, setOrdersPastDueId] = useState(Number);
  const user = useAppSelector((t) => t.account.user);
  const { confirm } = Modal;
  // console.log("user", user);
  // console.log("orderRentId", orderRentId);
  // console.log("PaymentData", PaymentData);


  useEffect(() => {
    agent.OrderRent.getOrderPastById(orderRentId).then((item) => {
      setDetalis(item);
      // console.log("item", item);
      {
        item.map((i: any) => setOrdersPastDueId(i.ordersPastDueId));
      }
    });
  }, []);
  // console.log("details", details);

 

  const onChange = (e: RadioChangeEvent) => {
    // console.log("radio checked", e.target.value);
    if (e.target.value == "1") {
      confirm({
        title: "ต้องการชำระด้วยเงินสด ?",
        icon: <QuestionCircleOutlined />,
        content: "กรุณาตรวจสอบยอดเงินให้ถูกต้อง",
        onOk() {
          setPaymentmethod(e.target.value);
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
          }).catch(() => console.log("Oops errors!"));
        },
        onCancel() {
          setPaymentmethod(null);
        },
      });
    } 
    //    if (e.target.value == "2") {
    //   setsetstateStripe(true);
    //   setPaymentmethod(e.target.value);
    // }
    setPaymentmethod(e.target.value);
  };
  const totalPriceSum = details.reduce(
    (acc, itemD: any) => acc + itemD.totalPricePastDue,
    0
  );
  // console.log("ordersPastDueId", ordersPastDueId);

  // แสดงราคารวมทั้งหมด
  // console.log("ราคารวมทั้งหมด:", totalPriceSum);

  //#region  payment


  const handlePayment = async () => {
    // console.log("paymentmethod", paymentmethod);

    try {
      const PaymentDto = {
        paymentBookingId: 0,
        paymentIntentId: "",
        clientSecret: "",
        ordersPastDueId: ordersPastDueId,
        imagePayment: imageSlipeUrl || "",
        categoryPayment: paymentmethod,
      };
      // console.log("PaymentDto", PaymentDto);
      const statuscar = "0";
      const statusDriver = 0;

      await dispatch(createPaymentAsync(PaymentDto)).then(() => {
        dispatch(CheckPaiedOrderPastAsync({ Id: ordersPastDueId }));
     
      });
      if (paymentmethod == 2) {
        setsetstateStripe(true);
      }
    
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion
  //#region   handleStripe
  const stripe = useStripe();
  const elements = useElements();
  const handleSubmit = async (event: any) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }
 
  
    if (!elements) {
      setErrorMessage('Stripe elements not loaded');
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
      const result:any = await stripe.confirmPayment({
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
    } catch (error:any) {
      // กรณีเกิด error ในการ confirmPayment
      console.error(error);

      // ทำการแสดง notification ข้อผิดพลาด (ถ้าต้องการ)
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถทำการจองรถได้ กรุณาลองใหม่อีกครั้ง.",
      });
    }

    // if (error) {
    //   message.error(error.message);
    //   // setErrorMessage(error.message);
    //   console.log("error.message", error.message);
    // }
    message.success("Payment successful!");
  };
  //#endregion
  //#region upload
//  type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  // const getBase64 = (img:any, callback: (url: string) => void) => {
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
      style={{ zIndex: 1 }}
    >
      <Card style={{ margin: 20 }} title="รายละเอียดการเลยกำหนด">
        {details.map((itemD: any, i: number) => {
          console.log("itemD",itemD);
          
          const dateTimePickup = moment(
            itemD.orderRent.orderRentItems[0].dateTimePickup
          ).format("Do MMM YY");
          const dateTimeReturn = moment(
            itemD.orderRent.orderRentItems[0].dateTimeReturn
          ).format("Do MMM YY");

          return (
            <div key={i}>
              <Descriptions>
                <Descriptions.Item label="วันที่รับรถ">
                  {dateTimePickup}
                </Descriptions.Item>
                <Descriptions.Item label="วันที่คืนรถ">
                  {dateTimeReturn}
                </Descriptions.Item>
                <Descriptions.Item label="เลยกำหนดคืน">
                  {itemD.numberOfDays}
                </Descriptions.Item>
                {itemD.orderRent.orderRentItems.map(
                  (itemOr: any, _: number) => (
                    <>
                      <Descriptions.Item label="หมายเลขทะเบียนรถ">
                        {itemOr.cars.carRegistrationNumber}
                      </Descriptions.Item>
                      <Descriptions.Item label="ราคาค่าเช่ารถ">
                        {itemOr.carsPrice}
                      </Descriptions.Item>
                      <Descriptions.Item label="คนขับ">
                        {itemOr.driver.driverName}
                      </Descriptions.Item>
                      <Descriptions.Item label="ค่าบริการ">
                        {itemOr.driver.charges}
                      </Descriptions.Item>
                    </>
                  )
                )}
                <Descriptions.Item label="ราคารวม">
                  {itemD.totalPricePastDue}
                </Descriptions.Item>
              </Descriptions>
              {details.length !== i + 1 && <Divider />}
            </div>
          );
        })}
        <Card>
          <Typography>ราคารวมทั้งหมด</Typography>
          <Typography>{totalPriceSum}</Typography>
        </Card>
      </Card>
      <Row>
        <Col span={24}>
          <Radio.Group size="small" onChange={onChange} value={paymentmethod}>
            <Row style={{ justifyContent: "center", flex: 1, display: "flex" }}>
              <Col span={8}>
                <Radio value="0">
                  <Card title="สแกนจ่าย">
                    <img src={imageLocal.tarnfer} width={200} />
                  </Card>
                </Radio>
              </Col>

              <Col span={8}>
                {user?.roleId == 1 ||
                  (user?.roleId == 3 && (
                    <Radio value="1">
                      <Card title="เงินสด">
                        <img src={imageLocal.cash} width={200} />
                      </Card>
                    </Radio>
                  ))}
              </Col>
              <Col span={8}>
                <Radio value="2">
                  <Card title="จ่ายผ่านบัตรเครดิต">
                    <img src={imageLocal.card} width={200} />
                  </Card>
                </Radio>
              </Col>
            </Row>
          </Radio.Group>
        </Col>
        
        {paymentmethod == 0 ? (
          <>
            <Row>
              <Col span={12}>
              {system.map((itemSys: SystemSetting) => {
                const imgQr = PathImage.imagePayment + itemSys.imagePrompay;
                return <Image src={imgQr} width={"100%"} />;
              })}
              </Col>
              <Col span={12}>
                <Card>
                  <Dragger {...props}>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{ width: "100%" }}
                      />
                    ) : (
                      <>
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
                      </>
                    )}
                  </Dragger>
                </Card>
              </Col>
            </Row>
          </>
        ) : null}
        <Col span={24}>
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
