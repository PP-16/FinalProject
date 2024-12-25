import React, { useEffect, useState } from "react";
import { Car } from "../../../api/models/Cars";
import agent from "../../../api/agent";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  InputNumber,
  List,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Slider,
  Steps,
  Typography,
  Upload,
  UploadProps,
  message,
  notification,
  theme,
} from "antd";
import Meta from "antd/es/card/Meta";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import { RentDetail } from "../../details/RentDetails";
import {
  CloseOutlined,
  EllipsisOutlined,
  InboxOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import {
  addTooCart,
  createOrderRentAsync,
  fetchOrder,
  fetchOrderItem,
  updateStatusOrderAsync,
} from "../../../api/redux/Slice/OrderRentSlice";
import { Drivers } from "../../../api/models/Drivers";

import { createPaymentAsync } from "../../../api/redux/Slice/PaymentSlice";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import QrPayment from "../../../assets/PaymentImg.jpg";
import { updateStatusCarAsync } from "../../../api/redux/Slice/CarsSlice";
import { searchBychargeAsync } from "../../../api/redux/Slice/DriverSilce";
import moment from "moment";
import { PathImage, imageLocal } from "../../../routers/PathImage";
import { RcFile } from "antd/es/upload";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { SystemSetting } from "../../../api/models/SystemSetting";
const pathServer = import.meta.env.VITE_SERVER_QRCODE
export const RentCar = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendData, setsendData] = useState();
  const { RangePicker } = DatePicker;
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({});
  const [cartmodal, setCartmodal] = useState(false);
  const [driver, setDriver] = useState<Drivers[]>([]);
  const [carInRent, setCarInRent] = useState([]);
  const [paymentmethod, setPaymentmethod] = useState<any>(0);
  const [modalSlipe, setModalSlipe] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageSlipeUrl, setImageSlipeUrl] = useState<string>();
  const [modalStripe, setModalStripe] = useState(false);
  const [driverNumber, setDriverNumbers] = useState<any>([]);
  const [modalDri, setModalDri] = useState(false);
  const [carId, setCarId] = useState();

  const { confirm } = Modal;
  const OrderRentData: any = useAppSelector((t) => t.order.ordereds);
  const PaymentData = useAppSelector((t) => t.payment.payments);
  const Driver: any = useAppSelector((t) => t.drivers.driver);
  const system: any = useAppSelector((t) => t.system.system);
  const [cartItem, setCartItem] = useState([]);

  console.log("cartItem", cartItem);

  useEffect(() => {
    agent.Cars.getCarForRents().then((car) => setCars(car));
    agent.Drivers.getDriver().then((dri) => setDriver(dri));
    agent.OrderRent.getCarInRent().then((inRent) => setCarInRent(inRent));
    const cartlocal: any = localStorage.getItem("addcart");
    const parsedCart = JSON.parse(cartlocal);
    if (parsedCart) {
      setCartItem(parsedCart);
    }
  }, []);

  console.log("dri", driver);
  console.log("driverNumber", driverNumber);

 


  const modals = (item: any) => {
    setsendData(item);
    setIsModalOpen(true);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current: any) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf("day");
  };

  //#region  TotalPrice
  const { DateRent }: any = formData;
  const [durations, setDurations] = useState<any>();

  useEffect(() => {
    if (DateRent && DateRent.length >= 2) {
      const pickuptime = moment(DateRent[0].$d);
      const retruntime = moment(DateRent[1].$d);
      console.log("DateRent", DateRent);
      setDurations(retruntime.diff(pickuptime, "days") + 1);
    }
  }, [DateRent]); // Add DateRent to the dependency array to ensure this effect runs when DateRent changes

  console.log("duration", durations);
  const calculateTotalCost = () => {
    let totalCost = 0;
    // Add null or undefined check for cartItem and driverNumber
    if (cartItem && Array.isArray(cartItem)) {
      cartItem.forEach((item: any) => {
        totalCost += parseFloat(item.classCars.price);
      });
    }

    if (driverNumber && Array.isArray(driverNumber)) {
      driverNumber.forEach((itemDri) => {
        totalCost += parseFloat(itemDri.driver.charges);
      });
    }

    if (durations) {
      totalCost *= durations;
    } else {
      totalCost;
    }

    return totalCost;
  };
  const TotalPrice = () => {
    let totalCost = 0;
    // Add null or undefined check for cartItem
    if (cartItem && Array.isArray(cartItem)) {
      cartItem.forEach((item: any) => {
        totalCost += parseFloat(item.classCars.price);
      });
    }

    // Add null or undefined check for driverNumber
    if (driverNumber && Array.isArray(driverNumber)) {
      driverNumber.forEach((itemDri) => {
        totalCost += parseFloat(itemDri.driver.charges);
      });
    }
    return totalCost;
  };
  //#endregion

  //#region manageDriver
  const [checkedDriver, setCheckedDriver] = useState(false);

  const selectDriv = (driver: any, car: any) => {
    const newDriverNumber = { driver, car };
    console.log("driver, car", driver);
    console.log("driver, car", car);

    setDriverNumbers((prevDriverNumbers: any) => [
      ...prevDriverNumbers,
      newDriverNumber,
    ]);
    setModalDri(false);
  };

  const toggleChecked = (item: any) => {
    setCheckedDriver(!checkedDriver);
    setCarId(item.carsId);
    setModalDri(true);
  };
  const [minPrice, setMinPrice] = useState(Number);
  const [maxPrice, setMaxPrice] = useState(Number);

  const onChangePrice = async (newValue: number[]) => {
    // console.log("newValue", newValue[1]);
    setMinPrice(newValue[0]);

    setMaxPrice(newValue[1]);
    await dispatch(searchBychargeAsync({ minPrice, maxPrice }));
    // setInputValue(maxPrice);
  };

  const removeDriver = (driverIdToRemove: any) => {
    setCheckedDriver(!checkedDriver);
    setDriverNumbers((prevDriverNumbers: any) =>
      prevDriverNumbers.filter(
        (driver: any) => driver.driver.driverId !== driverIdToRemove
      )
    );
  };

  useEffect(() => {
    if (Driver.length !== 0) {
      setDriver(Driver);
    } else {
      agent.Drivers.getDriver().then((dri) => setDriver(dri));
    }

    // if(cartItem.length == 0 ){prev()}
  }, [Driver]);
  //#endregion

  //#region HandelOrederToCart
  const handleAddCart = async (item: any) => {
    try {
      dispatch(addTooCart(item));
      const storedCartItems: any = localStorage.getItem("addcart");
      const parsedCart = JSON.parse(storedCartItems);
      if (parsedCart) {
        setCartItem(parsedCart);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = (carsIdToRemove: any) => {
    console.log("Removing carsId:", carsIdToRemove);
    const updatedCart = cartItem.filter(
      (item: any) => item.carsId !== carsIdToRemove
    );
    console.log("Updated Cart:", updatedCart);
    setCartItem(updatedCart);
    localStorage.setItem("addcart", JSON.stringify(updatedCart));
    if (cartItem.length == 0) {
      prev();
    }
  };

  //#endregion

  //#region  handleCreateOrder
  const handleupdateStatusCar = async (carId: any) => {
    const statuscar = "1";
    await dispatch(updateStatusCarAsync({ ID: carId, statusCar: statuscar }));
  };
  const updateStatusDriver = async (DriverId: any) => {
    const status = 1;
    await agent.Drivers.updateStatusDriver(DriverId, status);
  };

  const creatOrder = async () => {
    const {
      pickUpPlace,
      returnPlace,
      DateRent,
      passengerName,
      idCardNumber,
      email,
      phone,
    }: any = formData;
    const pickuptime = DateRent[0].format();
    const retruntime = DateRent[1].format();

    const orderDtos = {
      passengerName: passengerName,
      idCardNumber: idCardNumber,
      email: email,
      phone: phone,
      orderRentItems: cartItem.map((cartItem: any) => {
        const associatedDriverNumber = driverNumber.find(
          (driver: any) => driver.car === cartItem.carsId
        );
        console.log("associatedDriverNumber", associatedDriverNumber);
        // Determine driverId based on associatedDriverNumber
        const driverId = associatedDriverNumber
          ? associatedDriverNumber.driver.driverId
          : 101;
        console.log("driverId", driverId);

        return {
          orderRentItemId: 0,
          quantity: 1,
          itemPrice: cartItem.classCars?.price,
          dateTimePickup: pickuptime,
          dateTimeReturn: retruntime,
          placePickup: pickUpPlace,
          placeReturn: returnPlace,
          carsId: cartItem.carsId,
          driverId: driverId,
        };
      }),
    };
    console.log("orderDtos", orderDtos);
    try {
      // handleRemoveFromCart(orderDtos.orderRentItems.carsId);

      // ลบข้อมูลที่ต้องการออกจาก localStorage
      cartItem.forEach((cartItem: any) => {
        handleRemoveFromCart(cartItem.carsId);
        handleupdateStatusCar(cartItem.carsId);
      });

      await dispatch(createOrderRentAsync(orderDtos)).then(() => {
        for (const driverItem of driverNumber) {
          updateStatusDriver(driverItem.driver.driverId);
        }
        next();
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  //#endregion

  //#region  payment

  const handlePayment = async () => {
    console.log("paymentmethod", paymentmethod);

    try {
      const PaymentDto = {
        paymentBookingId: 0,
        paymentIntentId: "",
        clientSecret: "",
        orderRentId: OrderRentData.orderRentId,
        ImagePayment: imageSlipeUrl || "",
        categoryPayment: paymentmethod,
      };
      console.log("PaymentDto", PaymentDto);
      await dispatch(createPaymentAsync(PaymentDto));
      if (paymentmethod != 2) {
        await dispatch(
          updateStatusOrderAsync({
            ID: OrderRentData.orderRentId,
            Status: 2,
          })
        );
      } else {
        setModalStripe(true);
      }
      agent.Cars.getCarForRents().then((car) => setCars(car));
      dispatch(fetchOrder());
      dispatch(fetchOrderItem());
      prev()
    } catch (error) {
      console.log(error);
    }
  };

  //#endregion

  //#region stripe
  const onChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);

    if (e.target.value == "0") {
      setModalSlipe(true);
      setPaymentmethod(e.target.value);
    }
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
    setPaymentmethod(e.target.value);
  };
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  // const [detalis, setDetalis] = useState<Booking[]>([]);
  // const [payment, setPayment] = useState();
  // console.log("payment", payment);

  const handleSubmit = async (event: any) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (elements == null) {
      return;
    }
    if (!stripe) {
      setErrorMessage("Stripe has not been initialized");
      return;
    }
    // Trigger form validation and wallet collection
    const { error: submitError }: any = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      console.log("submitError.message", submitError.message);
      return;
    }

    const clientSecret: any = PaymentData?.clientSecret || null;

    try {
      const result = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `${pathServer}`,
        },
      });
      dispatch(
        updateStatusOrderAsync({
          ID: OrderRentData.orderRentId,
          Status: 2,
        })
      );
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
    onChange(info: any) {
      const { _, originFileObj } = info.file;
      getBase64(info.file.originFileObj as RcFile).then((res) => {
        setImageUrl(res);
      });

      setImageSlipeUrl(originFileObj);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  //#endregion

  //#region handleSteps
  const steps = [
    {
      title: "รายละเอียดรถ",
      content: () => (
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={20} sm={20} md={18} xl={18} xxl={20}>
              <Form>
                <Row style={{ justifyContent: "space-around" }}>
                  <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                    <Form.Item
                      style={{ color: "gray" }}
                      name="pickUpPlace"
                      label="สถานที่รับรถ"
                    >
                      <Input
                        placeholder="จุดรับรถ"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pickUpPlace: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                    <Form.Item
                      style={{ color: "gray" }}
                      name="returnPlace"
                      label="สถานที่คืนรถ"
                    >
                      <Input
                        placeholder="จุดคืนรถ"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            returnPlace: e.target.value,
                          })
                        }
                      />
                    </Form.Item>
                  </Col>

                  <Col xs={24} sm={18} md={16} xl={8} xxl={8}>
                    <Form.Item
                      style={{ color: "gray" }}
                      label="วันที่รับรถ - วันที่คืนรถ"
                      name="DateRent"
                    >
                      <RangePicker
                        disabledDate={disabledDate}
                        onChange={(e) =>
                          setFormData({ ...formData, DateRent: e })
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col
              xs={4}
              sm={4}
              md={6}
              xl={6}
              xxl={4}
              style={{
                justifyContent: "flex-end",
                display: "flex",
              }}
            >
              <Badge count={cartItem.length} offset={[10, 10]}>
                <Avatar
                  icon={<ShoppingCartOutlined style={{ color: "black" }} />}
                  shape="square"
                  size="large"
                  style={{ backgroundColor: "#f0f5ff" }}
                  onClick={() => setCartmodal(true)}
                />
              </Badge>
            </Col>
          </Row>

          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            {cars.map((item: any) => {
              const badgeText = item.statusCar !== 0 ? "ไม่ว่าง" : "ว่าง";

              const badgeColor = item.statusCar !== 0 ? "red" : "green";
              const image = PathImage.image + item.imageCars[0].image;

              // console.log("image", image);

              return (
                <Col
                  xs={24}
                  sm={12}
                  md={12}
                  xl={8}
                  xxl={8}
                  key={item.carsId}
                  style={{
                    justifyContent: "center",
                    display: "flex",
                    marginTop: 5,
                  }}
                >
                  <Badge.Ribbon text={badgeText} color={badgeColor}>
                    <Card
                      cover={<img alt="car" src={image} />}
                      actions={[
                        <Button
                          style={{ justifyContent: "center" }}
                          onClick={() => handleAddCart(item)}
                          disabled={item.statusCar == 1 && true}
                        >
                          <Row>
                            <PlusOutlined key="edit" />
                            <Typography style={{ margin: 3 }}>เลือก</Typography>
                          </Row>
                        </Button>,
                        <Row style={{ justifyContent: "center" }}>
                          <EllipsisOutlined key="ellipsis" />
                          <Typography
                            style={{ margin: 3 }}
                            onClick={() => modals(item)}
                          >
                            เพิ่มเติม
                          </Typography>
                        </Row>,
                      ]}
                      style={{ width: "100%" }}
                    >
                      <>
                        <Col span={24}>
                          <Meta
                            title={`หมายเลขทะเบียน : ${item.carRegistrationNumber}`}
                            style={{ margin: 3 }}
                          />
                        </Col>
                        <Col span={12}>
                          <Meta
                            description={`รุ่นรถ : ${item.carModel}`}
                            style={{ margin: 6 }}
                          />
                        </Col>
                      </>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              );
            })}
          </Row>

          {cartmodal == true && (
            <Modal
              title="รถที่เลือกไว้"
              width={900}
              open={cartmodal}
              onCancel={() => setCartmodal(false)}
              wrapClassName="vertical-center-modal"
            >
              <div style={{ margin: 20 }}>
                <Row>
                  {cartItem.map((item: any) => (
                    <Col span={12}>
                      <Card
                        title={`หมายเลขทะเบียนรถ  : ${item.carRegistrationNumber}`}
                        style={{ width: 400 }}
                        key={item.carsId}
                        extra={
                          <div
                            onClick={() => handleRemoveFromCart(item.carsId)}
                          >
                            <CloseOutlined
                              style={{ fontSize: 20, color: "#ff4d4f" }}
                            />
                          </div>
                        }
                      >
                        <Typography>
                          class : {item.classCars.className}
                        </Typography>
                        <Typography>ราคา : {item.classCars.price}</Typography>
                        <Typography></Typography>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </Modal>
          )}
        </>
      ),
    },
    {
      title: "รายละเอียดการเช่า",
      content: () => {
        // let totalCost = 0;

        return (
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={24} md={18} xl={12} xxl={12}>
              <Form>
                <Card title="รายละเอียดการเช่า" style={{ margin: 5 }}>
                  <Form.Item
                    style={{ color: "gray" }}
                    name="pickUpPlace"
                    label="สถานที่รับรถ"
                  >
                    <Input
                      placeholder="จุดรับรถ"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pickUpPlace: e.target.value,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ color: "gray" }}
                    name="returnPlace"
                    label="สถานที่คืนรถ"
                  >
                    <Input
                      placeholder="จุดคืนรถ"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          returnPlace: e.target.value,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ color: "gray" }}
                    label="วันที่รับรถ - วันที่คืนรถ"
                    name="DateRent"
                  >
                    <RangePicker
                      onChange={(e) =>
                        setFormData({ ...formData, DateRent: e })
                      }
                    />
                  </Form.Item>
                </Card>

                <Card title="ข้อมูลผู้เช่า" style={{ margin: 5 }}>
                  <Form.Item
                    style={{ color: "gray" }}
                    name="passengerName"
                    label="ชื่อผู้เช่า"
                  >
                    <Input
                      placeholder="นางสาว ADB"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          passengerName: e.target.value,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ color: "gray" }}
                    name="idCardNumber"
                    label="หมายเลขบัตรประจำตัวประชาชน"
                  >
                    <Input
                      placeholder="xxxxx-xxxxxx-xx-x"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idCardNumber: e.target.value,
                        })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ color: "gray" }}
                    name="email"
                    label="อีเมล์ผู้เช่า"
                    rules={[
                      {
                        type: "email",
                        message: "กรุณาป้อนอีเมล์ให้ถูกต้อง",
                      },
                    ]}
                  >
                    <Input
                      placeholder="xxxxx@gmail.com"
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </Form.Item>

                  <Form.Item
                    style={{ color: "gray" }}
                    name="phone"
                    label="เบอร์โทรศัพท์"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (!value || /^\d{3}-\d{4}-\d{3}$/.test(value)) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            "กรุณาป้อนเบอร์โทรศัพท์ให้ถูกต้อง"
                          );
                        },
                      },
                    ]}
                  >
                    <Input
                      placeholder="096-xxxx-xxx"
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </Form.Item>
                </Card>
              </Form>
            </Col>

            <Col xs={24} sm={24} md={18} xl={12} xxl={12}>
              <Card
                style={{ margin: 5 }}
                // title={`ราคารวม : ${calculateTotalCost()}`}
                actions={[
                  <>
                    <Row style={{ margin: 20 }}>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        xl={12}
                        xxl={12}
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        <Typography style={{ color: "gray", margin: 2 }}>
                          ราคาเช่ารถ
                        </Typography>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        xl={12}
                        xxl={12}
                        style={{ justifyContent: "flex-end", display: "flex" }}
                      >
                        <Typography style={{ margin: 2 }}>
                          {TotalPrice()} บาท
                        </Typography>
                      </Col>
                    </Row>
                    <Row style={{ margin: 20 }}>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        xl={12}
                        xxl={12}
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        <Typography style={{ color: "gray", margin: 2 }}>
                          จำนวนวันที่เช่าทั้งหมด
                        </Typography>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        xl={12}
                        xxl={12}
                        style={{ justifyContent: "flex-end", display: "flex" }}
                      >
                        <Typography style={{ margin: 2 }}>
                          {durations ? durations : 0} วัน
                        </Typography>
                      </Col>
                    </Row>

                    <Row style={{ margin: 20 }}>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        xl={12}
                        xxl={12}
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        <Typography style={{ color: "gray", margin: 2 }}>
                          ราคารวม
                        </Typography>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        xl={12}
                        xxl={12}
                        style={{ justifyContent: "flex-end", display: "flex" }}
                      >
                        <Typography style={{ margin: 2 }}>
                          {calculateTotalCost()} บาท
                        </Typography>
                      </Col>
                    </Row>
                  </>,
                ]}
              >
                <List
                  className="demo-loadmore-list"
                  itemLayout="horizontal"
                  dataSource={cartItem}
                  renderItem={(item: any) => {
                    console.log("item", item);
                    const image = PathImage.image + item.imageCars[0].image;
                    return (
                      <List.Item
                        key={item.carsId}
                        actions={[
                          <>
                            {/* {cartItem.length != 0 && ( */}
                            <Button
                              type="primary"
                              shape="round"
                              style={{ backgroundColor: "red" }}
                              onClick={() => handleRemoveFromCart(item.carsId)}
                            >
                              ลบ
                            </Button>
                            {/* )} */}
                          </>,
                        ]}
                      >
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          <Col xs={24} sm={24} md={8} xl={8} xxl={8}>
                            <Image src={image} style={{ width: "100%" }} />
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={8}
                            xl={8}
                            xxl={8}
                            style={{ marginTop: 70 }}
                          >
                            <Typography>รุ่นรถ : {item.carModel}</Typography>
                            <Typography>
                              ราคาเช่า : {item.classCars.price} / วัน
                            </Typography>
                          </Col>
                          <Col
                            xs={24}
                            sm={24}
                            md={8}
                            xl={8}
                            xxl={8}
                            style={{ marginTop: 70 }}
                          >
                            <Checkbox
                              checked={checkedDriver}
                              onChange={() => toggleChecked(item)}
                            >
                              เลือกคนขับรถ
                            </Checkbox>
                          </Col>
                        </Row>
                      </List.Item>
                    );
                  }}
                />
                {driverNumber.length != 0 && (
                  <>
                    {driverNumber.map((itemDri: any) => {
                      //  totalCost += parseFloat(itemDri.driver.charges);
                      console.log("itemDri", itemDri);
                      return (
                        <Collapse
                          size="large"
                          items={[
                            {
                              key: "1",
                              label: (
                                <>
                                  <Row>
                                    <Col
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      xl={12}
                                      xxl={12}
                                    >
                                      ชื่อคนขับ : {itemDri.driver.driverName}
                                    </Col>
                                    <Col
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      xl={12}
                                      xxl={12}
                                      style={{
                                        justifyContent: "flex-end",
                                        display: "flex",
                                      }}
                                    >
                                      <Button
                                        type="primary"
                                        style={{ backgroundColor: "red" }}
                                        onClick={() =>
                                          removeDriver(itemDri.driver.driverId)
                                        }
                                      >
                                        นำออก
                                      </Button>
                                    </Col>
                                  </Row>
                                </>
                              ),
                              children: (
                                <>
                                  <Descriptions>
                                    <Descriptions.Item label="ค่าแรงต่อวัน">
                                      {itemDri.driver.charges}
                                    </Descriptions.Item>
                                    <Descriptions.Item label="ที่อยู่ติดต่อ">
                                      {itemDri.driver.address}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item label="หมายเลขบัตรประชาชน">
                                      {itemDri.driver.idCardNumber}
                                    </Descriptions.Item> */}
                                    <Descriptions.Item label="หมายเลขโทรศัพท์">
                                      {itemDri.driver.phone}
                                    </Descriptions.Item>
                                    {/* <Descriptions.Item label="สำหรับขับรถ">
                                      {itemDri.car.carRegistrationNumber}
                                    </Descriptions.Item> */}
                                  </Descriptions>
                                </>
                              ),
                            },
                          ]}
                        />
                      );
                    })}
                  </>
                )}
              </Card>
            </Col>
            {cartItem.length != 0 && (
              <Button type="primary" block onClick={creatOrder}>
                เช่ารถ
              </Button>
            )}
          </Row>
        );
      },
    },
    {
      title: "การชำระเงิน",
      content: () => (
        <>
          <>
            <Radio.Group size="small" onChange={onChange} value={paymentmethod}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={18} xl={8} xxl={8}>
                  <Radio value="0">
                    <Card title="สแกนจ่าย">
                      <img src={imageLocal.tarnfer} width={"100%"} />
                    </Card>
                  </Radio>
                </Col>

                <Col xs={24} sm={24} md={18} xl={8} xxl={8}>
                  <Radio value="1">
                    <Card title="เงินสด">
                      <img src={imageLocal.cash} width={"100%"} />
                    </Card>
                  </Radio>
                </Col>

                <Col xs={24} sm={24} md={18} xl={8} xxl={8}>
                  <Radio value="2">
                    <Card title="จ่ายผ่านบัตรเครดิต">
                      <img src={imageLocal.card} width={"100%"} />
                    </Card>
                  </Radio>
                </Col>
              </Row>
            </Radio.Group>
          </>
        </>
      ),
    },
  ];

  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "260px",
    textAlign: "center",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  //#endregion

  return (
    <>
      {/* {modalDri == true && ( */}
      <Modal
        open={modalDri}
        onCancel={() => setModalDri(false)}
        onOk={() => setModalDri(false)}
        width={1000}
        wrapClassName="vertical-center-modal"
      >
        <Row
          style={{ margin: 10, justifyContent: "center", alignItems: "center" }}
        >
          <Col>
            <Typography style={{ margin: 10 }}>ราคาสูงสุดที่จ่าย :</Typography>
          </Col>
          <Col span={12}>
            <Slider
              style={{ margin: 10 }}
              min={0}
              max={5000}
              range
              defaultValue={[0, 100]}
              onChange={onChangePrice}
              // value={typeof inputValue === "number" ? inputValue : 0}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={100}
              max={5000}
              formatter={(value) =>
                `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              value={minPrice}
              onChange={(value) => {
                const newMinPrice = value !== null ? value : minPrice;
                const newMaxPrice = maxPrice;
                setMinPrice(newMinPrice);
                setMaxPrice(newMaxPrice);
                onChangePrice([newMinPrice, newMaxPrice]);
              }}
            />
            <InputNumber
              min={100}
              max={5000}
              formatter={(value) =>
                `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              value={maxPrice}
              onChange={(value) => {
                const newMaxPrice = value !== null ? value : maxPrice;
                const newMinPrice = minPrice;
                setMaxPrice(newMaxPrice);
                setMinPrice(newMinPrice);
                onChangePrice([newMinPrice, newMaxPrice]);
              }}
            />
          </Col>
        </Row>
        <Row
          style={{
            justifyContent: "space-between",
            flex: 1,
            display: "flex",
          }}
        >
          {driver.map((dri: any) => {
            return (
              !driverNumber.filter(
                (driver: any) => driver.driver.driverId === dri.driverId
              ).length &&
              dri.driverId != 101 &&
              dri.isUse == true &&
              dri.statusDriver != 1 && (
                <Col span={11} style={{ margin: 5, padding: 5 }}>
                  <Card>
                    <Meta
                      avatar={
                        <Avatar
                          src="https://api.dicebear.com/7.x/miniavs/svg?seed=8"
                          style={{ width: 100, height: 100 }}
                        />
                      }
                      title={`ชื่อ : ${dri.driverName}`}
                      description={`ค่าแรง : ${dri.driverName} / วัน`}
                    />
                    <Button block onClick={() => selectDriv(dri, carId)}>
                      <Row style={{ justifyContent: "center" }}>
                        <PlusOutlined key="edit" />
                        <Typography style={{ margin: 3 }}>เลือก</Typography>
                      </Row>
                    </Button>
                  </Card>
                </Col>
              )
            );
          })}
        </Row>
      </Modal>
      {/* )} */}

      {/* {modalStripe == true && ( */}
      <Modal
        width={1000}
        open={modalStripe}
        onCancel={() => setModalStripe(false)}
        wrapClassName="vertical-center-modal"
      >
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
      </Modal>
      <Modal
        open={modalSlipe}
        onCancel={() => setModalSlipe(false)}
        onOk={() => setModalSlipe(false)}
        width={1500}
        wrapClassName="vertical-center-modal"
      >
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={24} md={18} xl={12} xxl={12}>
            {system.map((itemSys: SystemSetting) => {
                const imgQr = PathImage.imagePayment + itemSys.imagePrompay;
                return <Image src={imgQr} width={"100%"} />;
              })}
            </Col>
            <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
              <Card style={{ width: "100%" }}>
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
      </Modal>
      {/* )} */}

      {isModalOpen == true && (
        <RentDetail
          cars={sendData}
          visble={isModalOpen}
          cancel={setIsModalOpen}
        />
      )}

      <Steps current={current} items={items} />
      <Card style={contentStyle}>{steps[current].content()}</Card>
      <div style={{ marginTop: 24 }}>
        {cartItem.length !== 0 && current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            ถัดไป
          </Button>
        )}

        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => handlePayment()}>
            เสร็จสิ้น
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            กลับ
          </Button>
        )}
      </div>
    </>
  );
};
