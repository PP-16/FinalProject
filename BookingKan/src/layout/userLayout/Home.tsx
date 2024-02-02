import {
  CarOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LogoutOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Layout, Row, Image, MenuProps, Dropdown } from "antd";
import Typography from "antd/es/typography/Typography";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { signOut } from "../../api/redux/Slice/AccountSlice";
import { useState } from "react";

const { Header, Content, Footer } = Layout;

export const HomeUser = ({ children }: never) => {
  const src =
    "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEj7TioeGNeKliUqUdIEC8Y53bhJ99D6QoXumj2DH4ktUjWjOU5.jpg";

  const dispatch = useAppDispatch();
  const userId = useAppSelector((state: any) => state.account.user.passengerId);

  const storedUser = localStorage.getItem(`user-${userId}`);
  const cart = storedUser ? JSON.parse(storedUser) : [];
  const history = useNavigate();

  // const countItem = cart.length;

  // const [isCartModalVisible, setCartModalVisible] = useState(false);
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Row>
          <UserOutlined />
          <Typography onClick={()=>history('/AccountPage')}>บัญชีของฉัน</Typography>
        </Row>
      ),
    },
    {
      key: "2",
      label: (
        <Row>
          <LogoutOutlined />
          <Typography
            onClick={() => {
              dispatch(signOut());
              history("/");
              window.location.reload();
              // dispatch(clearCart(userId));
            }}
          >
            ออกจากระบบ
          </Typography>
        </Row>
      ),
    },
  ];

  const [details, setDetails] = useState<any>([null]);
  console.log("details", details);
  return (
    <Layout style={{ flex: 1 }}>
      <Header
        style={{
          backgroundColor: "#8FC0F9",
         
        }}
      >
        <Row style={{flex:1}}>
          <Col span={16} style={{marginTop:10}}>
            <Link to="/" >
              <Row style={{ justifyContent: "flex-start"}}>
                <CarOutlined style={{ fontSize: "25px", color: "black" }} />
                <Typography style={{ fontSize: "25px", color: "black",textAlign:'center' }}>
                  BookingKan
                </Typography>
              </Row>
            </Link>
          </Col>
          <Col span={8}>
            <Row style={{ justifyContent: "right", alignItems: "center" }}>
              <div style={{ marginRight: 30 }}>
                {/* <Badge count={countItem}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "25px", margin: 10 }}
                    onClick={() => setCartModalVisible(true)}
                  />
                </Badge>
                <Modal
                  title="ตระกร้า"
                  visible={isCartModalVisible}
                  onCancel={() => setCartModalVisible(false)}
                  width={1000}
                  footer={
                    <Button
                      shape="round"
                      size="large"
                      block
                      style={{ backgroundColor: "#ffa39e", margin: 10 }}
                    >
                      ชำระเงิน
                    </Button>
                  }
                >
                  <Row>
                    <Col span={8} push={16}>
                      {details && (
                        <>
                          <Card style={{ margin: 16 }}>
                            <Row style={{ justifyContent: "space-between" }}>
                              <Typography
                                style={{ fontSize: 25, textAlign: "center" }}
                              >
                                {details?.cars?.carModel}
                              </Typography>

                              <Typography style={{ fontSize: 15, padding: 12 }}>
                                {details?.cars?.classCars?.price} ฿ / วัน
                              </Typography>
                            </Row>

                            <Image
                              width={250}
                              alt="logo"
                              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                            />

                            <Row gutter={[16, 16]}>
                              <Col span={12}>
                                <Typography>
                                  Class : {details?.cars?.classCars?.className}
                                </Typography>
                           
                              </Col>
                              <Col span={12}>
                              <Typography>
                                  สถานที่ที่รับรถ : {details?.placePickup}
                                </Typography>
                                <Typography>
                                  สถานที่ที่คืนรถ : {details?.placeReturn}
                                </Typography>
                              </Col>
                            </Row>
                            <Typography>
                              รวมทั้งสิ้น {details?.diffInDays} วัน
                            </Typography>
                            <Typography>ราคารวม: {details?.totalprice}</Typography>
                          </Card>
                          <Card
                            style={{ margin: 16 }}
                            type="inner"
                            title="ยอดรวม"
                          >
                            <Typography>
                              ราคารวม : {details?.totalprice}
                            </Typography>
                          </Card>
                        </>
                      )}
                    </Col>
                    <Col span={16} pull={8}>
                      {cart.map((item: any) => {
                        const datePickup = moment(item.dateTimePickup);
                        const dateRetrun = moment(item.dateTimeReturn);

                        const diffInDays =
                          dateRetrun.diff(datePickup, "days") + 1;
                        console.log("diffInDays", diffInDays);

                        const totalprice = item.itemPrice * diffInDays;
                        console.log("totalprice", totalprice);

                        return (
                          <Card
                            onClick={() =>
                              setDetails({
                                ...item,
                                diffInDays: diffInDays,
                                totalprice: totalprice,
                              })
                            }
                            style={{ marginTop: 16 }}
                            type="inner"
                            title={item.cars.carRegistrationNumber}
                            extra={
                              <Button
                                onClick={() =>
                                  setDetails({
                                    ...item,
                                    diffInDays: diffInDays,
                                    totalprice: totalprice,
                                  })
                                }
                              >
                                รายละเอียดเพิ่มเติม
                              </Button>
                            }
                          >
                            <Row>
                              <Col span={12}> <Typography>วันที่รับรถ :  {datePickup.format("Do MMM YY")}</Typography>           
                              <Typography>วันที่คืนรถ :   {dateRetrun.format("Do MMM YY")}</Typography>
                              <Typography>ราคาต่อวัน : {item.itemPrice}</Typography></Col>
                              <Col span={12}>
                              <Typography>รวมทั้งหมด  : {diffInDays} วัน</Typography>
                              <Typography>ราคารวม : {totalprice}</Typography>
                              </Col>
                            </Row>
                             
                          </Card>
                        );
                      })}
                    </Col>
                  </Row>
                </Modal> */}

                <Dropdown menu={{ items }} placement="bottomRight">
                  <UserOutlined style={{ fontSize: "25px", margin: 10 }} />
                </Dropdown>
              </div>
            </Row>
          </Col>
        </Row>
      </Header>
      <Content>
        <main id="main" style={{ margin: 20, flex: 1 }}>
          {children}
        </main>
      </Content>
      <Footer style={{ textAlign: "center", backgroundColor: "#8FC0F9" }}>
        <Row>
          <Col sm={2} md={4} xl={8}>
            <Image src={src} />
          </Col>
          <Col sm={2} md={4} xl={8}>
            <Typography style={{ fontSize: "20px" }}>ติดต่อ</Typography>
            <Row style={{ justifyContent: "center" }}>
              <PhoneOutlined style={{ fontSize: "18px" }} />
              <Typography style={{ margin: 5, fontSize: "16px" }}>
                012-3456789
              </Typography>
            </Row>
            <Row style={{ justifyContent: "center" }}>
              <FacebookOutlined style={{ fontSize: "18px" }} />
              <Typography style={{ margin: 5, fontSize: "16px" }}>
                BookingKan
              </Typography>
            </Row>
            <Row style={{ justifyContent: "center" }}>
              <InstagramOutlined style={{ fontSize: "18px" }} />
              <Typography style={{ margin: 5, fontSize: "16px" }}>
                BookingKan
              </Typography>
            </Row>
          </Col>
          <Col sm={2} md={4} xl={8}>
            <Typography style={{ fontSize: "20px" }}>ที่อยู่</Typography>
            <Row style={{ justifyContent: "center" }}>
              <Typography style={{ fontSize: "16px" }}>
                เลขที่ 70 หมู่ 4 ตำบลหนองบัว อำเภอเมืองกาญจนบุรี
                จังหวัดกาญจนบุรี 71000
              </Typography>
            </Row>
          </Col>
        </Row>
      </Footer>
    </Layout>
  );
};
