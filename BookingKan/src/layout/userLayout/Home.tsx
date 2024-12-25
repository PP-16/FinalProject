import {
  CarOutlined,
  FacebookOutlined,
  InstagramOutlined,
  LogoutOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Col, Layout, Row, Image, MenuProps, Dropdown, Avatar } from "antd";
import Typography from "antd/es/typography/Typography";
import { Link, useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { signOut } from "../../api/redux/Slice/AccountSlice";
import { ReactNode, useEffect, useState } from "react";
import agent from "../../api/agent";
import { PathImage } from "../../routers/PathImage";
import { fetchSystem } from "../../api/redux/Slice/SystemSlice";
import { PathPublicRouter } from "../../routers/PathAllRoute";
import { fetchBookingForCanCle } from "../../api/redux/Slice/BookingSlice";
const { Header, Content, Footer } = Layout;

export const HomeUser: React.FC<{ children: ReactNode }> = ({ children }: any) => {
  const src =
    "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEj7TioeGNeKliUqUdIEC8Y53bhJ99D6QoXumj2DH4ktUjWjOU5.jpg";

  const dispatch = useAppDispatch();

  const [userDetail, setUser] = useState<any>([]);
  const user = useAppSelector((t) => t.account.user);
  const system = useAppSelector((t) => t.system.system);
  // console.log("user", user);
  // console.log("system", system);
  
  useEffect(() => {
    agent.Account.getUser(user?.token).then((user) => setUser(user));
    dispatch(fetchSystem());
    dispatch(fetchBookingForCanCle())
  }, []);
  // console.log("userD", userDetail);
  const image = PathImage.imageUser + userDetail.imagePassenger;

  const history = useNavigate();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Row>
          <UserOutlined />
          <Typography onClick={() => history(PathPublicRouter.accountPage)}>
            บัญชีของฉัน
          </Typography>
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
              history(PathPublicRouter.home);
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
  // console.log("details", details);
  return (
    <Layout>
      <Header style={{ backgroundColor: "#4F6F52" }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={19} sm={18} md={20} xl={22} xxl={22} style={{ marginTop: 10 }}>
            <Link to={PathPublicRouter.home}>
              <Row >
                {system.map((i) => {
                  const imgLogo = PathImage.logo + i.logo;
                  return (
                    <Avatar
                      size="large"
                      shape="square"
                      src={<img src={imgLogo} alt="avatar" />}
                    />
                  );
                })}
                <Typography
                  style={{
                    fontSize: "25px",
                    color: "#F5EFE6",
                    textAlign: "center",
                  }}
                >
                  {system.map((i) => i.nameWeb)}
                </Typography>
              </Row>
            </Link>
          </Col>
          <Col xs={5} sm={6} md={4} xl={2} xxl={2}>
            <Row >
              
              <div style={{ marginRight: 30 }}>
                <Dropdown menu={{ items }} placement="bottomRight">
                  {userDetail.imagePassenger == null ? (
                    <UserOutlined style={{ fontSize: "25px", margin: 10 }} />
                  ) : (
                    <Avatar
                      src={image}
                      style={{ fontSize: "25px", margin: 10 }}
                    />
                  )}
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
      <Footer style={{backgroundColor: "#4F6F52" }}>
        {system.map((item: any) => {
          const imagelogo = PathImage.logo + item?.logo;
          return (
            <Row>
              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <Row>
                  <Col>
                    <Image src={imagelogo} style={{ width: 200 }} />
                    <Typography style={{ fontSize: "25px", color: "#E8DFCA" }}>
                      {item.nameWeb}
                    </Typography>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <Row>
                  <Typography style={{ fontSize: "25px", color: "#E8DFCA" }}>
                    ติดต่อ
                  </Typography>
                </Row>
                <Row>
                  <PhoneOutlined
                    style={{ fontSize: "18px", color: "#E8DFCA" }}
                  />
                  <Typography
                    style={{ margin: 5, fontSize: "20px", color: "#E8DFCA" }}
                  >
                    {item?.phoneNumber}
                  </Typography>
                </Row>
                <Row>
                  <FacebookOutlined
                    style={{ fontSize: "18px", color: "#E8DFCA" }}
                  />
                  <a
                    href={item?.contactFB}
                    style={{ margin: 5, fontSize: "20px", color: "#E8DFCA" }}
                  >
                    BookingKan
                  </a>
                </Row>
                <Row>
                  <InstagramOutlined
                    style={{ fontSize: "18px", color: "#E8DFCA" }}
                  />
                  <a
                    href={item?.contactIG}
                    style={{ margin: 5, fontSize: "20px", color: "#E8DFCA" }}
                  >
                    BookingKan
                  </a>
                </Row>
              </Col>

              <Col xs={24} sm={18} md={12} xl={8} xxl={8}>
                <Typography style={{ fontSize: "25px", color: "#E8DFCA" }}>
                  ที่อยู่
                </Typography>
              
                  <Typography style={{ fontSize: "20px", color: "#E8DFCA" }}>
                    {item?.address}
                  </Typography>
              </Col>
            </Row>
          );
        })}
      </Footer>
    </Layout>
  );
};
