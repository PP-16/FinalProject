import React, { useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  CarOutlined,
  CloudOutlined,
  ContactsOutlined,
  ContainerOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  FieldTimeOutlined,
  FullscreenOutlined,
  HomeOutlined,
  InstagramOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  PhoneOutlined,
  ScheduleOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Carousel,
  Layout,
  Menu,
  Row,
  theme,
  Image,
  Col,
  Typography,
  Button,
  Dropdown,
} from "antd";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { signOut } from "../../api/redux/Slice/AccountSlice";
import { useAppDispatch } from "../../api/redux/Store/configureStore";

const { Content, Footer, Sider } = Layout;

export const HomeAdmin = ({ children }: never) => {
  const dispatch = useAppDispatch();
  const history = useNavigate();

  // const items: MenuProps["items"] = [
  //   {
  //     key: "1",
  //     label: (
  //       <Row>
  //         <UserOutlined />
  //         <Typography>บัญชีของฉัน</Typography>
  //       </Row>
  //     ),
  //   },
  //   {
  //     key: "2",
  //     label: (
  //       <Row>
  //         <LogoutOutlined />
  //         <Typography
  //           onClick={() => {
  //             dispatch(signOut());
  //             history("/");
  //           }}
  //         >
  //           ออกจากระบบ
  //         </Typography>
  //       </Row>
  //     ),
  //   },
  // ];

  const src =
    "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEj7TioeGNeKliUqUdIEC8Y53bhJ99D6QoXumj2DH4ktUjWjOU5.jpg";
  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1" icon={<HomeOutlined />}>
            <NavLink to="/">Home</NavLink>
          </Menu.Item>
          <Menu.Item key="2" icon={<CarOutlined />}>
            <NavLink to="/Cars">CarManage</NavLink>
          </Menu.Item>
          <Menu.Item key="3" icon={<ContactsOutlined />}>
            <NavLink to="/Driver">DriverManage</NavLink>
          </Menu.Item>
          <Menu.Item key="4" icon={<EnvironmentOutlined />}>
            <NavLink to="/RouteCars">RouteCarManage</NavLink>
          </Menu.Item>
          <Menu.Item key="5" icon={<ScheduleOutlined />}>
            <NavLink to="/Itinerarys">ItinerarysManage</NavLink>
          </Menu.Item>
          <Menu.Item key="6" icon={<OrderedListOutlined />}>
            <NavLink to="/Orders">OrdersManage</NavLink>
          </Menu.Item>
          <Menu.Item key="7" icon={<BookOutlined />}>
            <NavLink to="/BookingManage">BookingManage</NavLink>
          </Menu.Item>
          <Menu.Item key="8" icon={<UserOutlined />}>
            <NavLink to="/UserManage">UserManage</NavLink>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            justifyContent: "center",
          }}
        >
          <Row>
            <Col sm={3} md={9} xl={12}>
              <Row>
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: "16px",
                    width: 64,
                    height: 64,
                  }}
                />
                <CarOutlined
                  style={{
                    textAlign: "center",
                    fontSize: "25px",
                    color: "black",
                  }}
                />
                <Typography
                  style={{
                    fontSize: "25px",
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  BookingKan
                </Typography>
              </Row>
            </Col>
            <Col sm={3} md={9} xl={12}>
              <Row
                style={{
                  justifyContent: "right",
                  alignItems: "center",
                  marginTop: 15,
                }}
              >
                <Button
                  onClick={() => {
                    dispatch(signOut());
                    history("/");
                    window.location.reload();
                  }}
                  type="primary"
                >
                  <LogoutOutlined />
                  ออกจากระบบ
                </Button>
              </Row>
            </Col>
          </Row>
        </Header>
        <Carousel autoplay>
          <div>
            <img
              style={{ width: "1600px", height: "400px" }}
              src="https://i.pinimg.com/564x/d8/b5/d1/d8b5d1e5ae7af95a570710b31e9dab3a.jpg"
            ></img>
          </div>
          <div>
            <img
              style={{ width: "1600px", height: "400px" }}
              src="https://i.pinimg.com/564x/6f/7a/7d/6f7a7d940bb5da64bb2b4ff8cc158735.jpg"
            ></img>
          </div>
          <div>
            <img
              style={{ width: "1600px", height: "400px" }}
              src="https://i.pinimg.com/originals/df/46/48/df4648caa4537ff28bb86205f93ddb74.gif"
            ></img>
          </div>
          <div>
            <img
              style={{ width: "1600px", height: "400px" }}
              src="https://i.pinimg.com/originals/c2/39/78/c239781a884d363b6ee17280606b671f.gif"
            ></img>
          </div>
        </Carousel>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            flex: 1,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row>
            <Col sm={18} md={20} xl={24}>
              <main id="main">{children}</main>
            </Col>
          </Row>
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
    </Layout>
  );
};
