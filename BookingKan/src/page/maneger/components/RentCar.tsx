import React, { useEffect, useState } from "react";
import { Car } from "../../../api/models/Cars";
import agent from "../../../api/agent";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  CheckboxProps,
  Col,
  DatePicker,
  Descriptions,
  Form,
  Image,
  Input,
  List,
  Modal,
  Row,
  Skeleton,
  Steps,
  Tag,
  TimePicker,
  Typography,
  message,
  notification,
  theme,
} from "antd";
import Lottie from "lottie-react";
import Meta from "antd/es/card/Meta";
import { useAppDispatch } from "../../../api/redux/Store/configureStore";
import notfound from "../../../assets/lotti/Empty.json";
import { RentDetail } from "../../details/RentDetails";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  EditOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { addTooCart, createOrderRentAsync } from "../../../api/redux/Slice/OrderRentSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { Drivers } from "../../../api/models/Drivers";

export const RentCar = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sendData, setsendData] = useState();
  const { RangePicker } = DatePicker;
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({});
  const [cartmodal, setCartmodal] = useState(false);

  const [driver, setDriver] = useState<Drivers[]>([]);


  const cartlocal = localStorage.getItem("addcart");
  const cart = JSON.parse(cartlocal);
  console.log("cartlocal", cart);

  const [addCart, setAddCart] = useState<Car[]>([]);

  useEffect(() => {
    agent.Cars.getCarForRents().then((car) => setCars(car));
    agent.Drivers.getDriver().then((dri) => setDriver(dri));
  }, []);
  console.log("dri", driver);

  const modals = (item: any) => {
    setsendData(item);
    setIsModalOpen(true);
  };

  //#region HandelOrederToCart
  const handleAddCart = async (item: any) => {
    try {
      dispatch(addTooCart(item));
      // window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveFromCart = (carsIdToRemove: any) => {
    console.log("Removing carsId:", carsIdToRemove);

    // Remove the item from the cart based on carsId
    const updatedCart = cart.filter(
      (item: any) => item.carsId !== carsIdToRemove
    );
    console.log("Updated Cart:", updatedCart);

    // Update the local storage and state with the new cart
    localStorage.setItem("addcart", JSON.stringify(updatedCart));
    window.location.reload();
    // Assuming you have a state for the cart, update it as well if needed
    // setCart(updatedCart);
  };

  //#endregion

  //#region  handleCreateOrder
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
    console.log("forme", formData);
    try {
      const orderDtos = cart.map((cartItem:any) => {
        return {
          quantity: 1, // หรือจำนวนที่ต้องการกำหนด
           itemPriceitemPrice: cartItem.classCars?.price,
          dateTimePickup: DateRent[0].format(),
          dateTimeReturn: DateRent[1].format(),
          placePickup: pickUpPlace,
          placeReturn: returnPlace,
          cars: cartItem.carsId,
          passengerName: passengerName,
          idCardNumber: idCardNumber,
          email: email,
          phone: phone,
          driverId:101
        };
      });
  
      console.log("orderDtos", orderDtos);
  
      // ส่ง orderDtos ทั้งหมดไปยัง createOrderRentAsync
      for (const orderDto of orderDtos) {
        await dispatch(createOrderRentAsync(orderDto));
      }
      next()
    } catch (error) {
      console.log("error",error);
      
    }
  };

  //#endregion

  const steps = [
    {
      title: "รายละเอียดรถ",
      content: () => (
        <>
          <Row style={{ justifyContent: "space-around" }}>
            <Col span={20} style={{ display: "flex" }}>
              <Form>
                <Row style={{ justifyContent: "space-around" }}>
                  <Col span={8}>
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

                  <Col span={8}>
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

                  <Col span={8}>
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
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col
              span={4}
              style={{
                justifyContent: "flex-end",
                display: "flex",
              }}
            >
              <Badge count={cart.length} offset={[10, 10]}>
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

          <Row style={{ justifyContent: "space-evenly" }}>
            {cars.map((item) => (
              <Col key={item.carsId} xl={6} md={12} sm={18}>
                <Badge.Ribbon
                  text={item.statusCar == 0 ? "ว่าง" : "ไม่ว่าง"}
                  color={item.statusCar == 0 ? "green" : "red"}
                >
                  <Card
                    cover={
                      <img
                        alt="car"
                        src="https://www.grandprix.co.th/wp-content/uploads/2021/09/%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3-5-%E0%B8%A3%E0%B8%96-%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%A7.jpg"
                      />
                    }
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
            ))}
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
                  {cart.map((item: any) => (
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
      content: () => (
        <Row style={{ justifyContent: "space-around" }}>
          <Col span={12}>
            <Form>
              <Card title="รายละเอียดการเช่า" style={{margin:5}}>
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
                    onChange={(e) => setFormData({ ...formData, DateRent: e })}
                  />
                </Form.Item>
              </Card>

              <Card title="ข้อมูลผู้เช่า" style={{margin:5}}>
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

          <Col span={12}>
            <Card style={{margin:5}}>
              <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                dataSource={cart}
                renderItem={(item: any) => (
                  <List.Item
                    key={item.carsId}
                    actions={[
                      <Button
                        type="primary"
                        style={{ backgroundColor: "red" }}
                        onClick={() => handleRemoveFromCart(item.carsId)}
                      >
                        ลบ
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Image
                          src="https://www.grandprix.co.th/wp-content/uploads/2021/09/%E0%B9%81%E0%B8%99%E0%B8%B0%E0%B8%99%E0%B8%B3-5-%E0%B8%A3%E0%B8%96-%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%A7.jpg"
                          style={{ width: 100, height: 100 }}
                        />
                      }
                      title={item.carModel}
                      description={item.classCars.price}
                      style={{ justifyContent: "center" }}
                    />
                    <List.Item.Meta
                      title={item.carModel}
                      description={item.classCars.price}
                      style={{ justifyContent: "center" }}
                    />
                  </List.Item>
                )}
              />
            </Card>
            
          </Col>
          <Button type="primary" block onClick={creatOrder}>เช่ารถ</Button>
        </Row>
      ),
    },
    {
      title: "การชำระเงิน",
      content: () => (
        <Row>
          <Typography>1111</Typography>
        </Row>
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
  return (
    <>
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
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            ถัดไป
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
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
