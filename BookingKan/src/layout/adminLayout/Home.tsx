import React, { ReactNode, useEffect, useState } from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  BookOutlined,
  CarOutlined,
  CloudOutlined,
  ContactsOutlined,
  ContainerOutlined,
  DesktopOutlined,
  EnvironmentOutlined,
  FacebookOutlined,
  FieldTimeOutlined,
  FileOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  HomeOutlined,
  InstagramOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  OrderedListOutlined,
  PhoneOutlined,
  PieChartOutlined,
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
  Avatar,
  Drawer,
} from "antd";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Header } from "antd/es/layout/layout";
import { signOut } from "../../api/redux/Slice/AccountSlice";
import {
  store,
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { fetchSystem } from "../../api/redux/Slice/SystemSlice";
import { PathImage } from "../../routers/PathImage";
import { PathPrivateRouter, PathPublicRouter } from "../../routers/PathAllRoute";
import { fetchBookingForCanCle } from "../../api/redux/Slice/BookingSlice";

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// Define the custom MenuItem type
interface MenuItem {
  label: React.ReactNode;
  key: React.Key;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

// Update the getItem function to use the custom type
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  path?: string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    path,
  };

}

export const HomeAdmin : React.FC<{ children: ReactNode }> = ({ children }: any) => {
  const dispatch = useAppDispatch();
  const history = useNavigate();
  const system = useAppSelector((t) => t.system.system);
  const isAuthenticated = store.getState().account.user;

  const isEmployee = isAuthenticated?.roleId == 4;
  // console.log("isAuthenticated", isEmployee);
  const src =
    "https://static.thairath.co.th/media/dFQROr7oWzulq5FZUEj7TioeGNeKliUqUdIEC8Y53bhJ99D6QoXumj2DH4ktUjWjOU5.jpg";
  const [collapsed, setCollapsed] = useState(true);
  const [openDrawer, setOpenDrawer] = useState(false);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleClick = (path: any) => {
    const navigate = useNavigate();
    navigate(path);
    setCollapsed(false);
  };

  const items: MenuItem[] = [
    {
      key: "1",
      label: "หน้าแรก",
      icon: <HomeOutlined />,
      path: PathPrivateRouter.home,
    },
    {
      key: "2",
      label: "จัดการรถ",
      icon: <CarOutlined />,
      children: [
        {
          key: "2.1",
          label: "รถ",
          path: PathPrivateRouter.cars,
        },
        {
          key: "2.2",
          label: "คลาสรถ",
          path: PathPrivateRouter.classCarsManage,
        },
      ],
    },
    {
      key: "3",
      label: "จัดการคนขับรถ",
      icon: <ContactsOutlined />,
      path: PathPrivateRouter.driver,
    },
    {
      key: "4",
      label: "จัดการการเดินทาง",
      icon: <EnvironmentOutlined />,
      children: [
        {
          key: "4.1",
          label: "เส้นทาง",
          path: PathPrivateRouter.routeCars,
        },
        {
          key: "4.2",
          label: "รอบรถ",
          path: PathPrivateRouter.itinerarys,
        },
      ],
    },
    {
      key: "6",
      label: "จัดการการเช่ารถ",
      icon: <OrderedListOutlined />,
      path: PathPrivateRouter.orders,
    },
    {
      key: "7",
      label: "จัดการการจองที่นั่ง",
      icon: <BookOutlined />,
      path: PathPrivateRouter.bookingManage,
    },
    {
      key: "8",
      label: "จัดการผู้ใช้งาน",
      icon: <UserOutlined />,
      children: [
        {
          key: "8.1",
          label: "ผู้ใช้งาน",
          path: PathPrivateRouter.userManage,
        },
        {
          key: "8.2",
          label: "บทบาท",
          path: PathPrivateRouter.roleUserManage,
        },
      ],
    },
    {
      key: "9",
      label: "จัดการระบบ",
      icon: <FileTextOutlined />,
      children: [
        {
          key: "9.1",
          label: "ข่าวและการประชาสัมพันธ์",
          path: PathPrivateRouter.newsManage,
        },
        {
          key: "9.2",
          label: "ตั้งค่าระบบ",
          path: PathPrivateRouter.systemSettingManage,
        },
      ],
    },
  ];

  useEffect(() => {
    dispatch(fetchSystem());
    dispatch(fetchBookingForCanCle())
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <Sider trigger={null}  theme="light" className="headerMenu" >
        <Menu >
          {items.map((item:any) =>
            item.children ? (
              <SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child:any) => (
                  <Menu.Item
                    key={child.key}
                    onClick={() => handleClick(child.path)}
                  >
                    <NavLink to={child.path}>{child.label}</NavLink>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => handleClick(item.path)}
              >
                <NavLink to={item.path}>{item.label}</NavLink>
              </Menu.Item>
            )
          )}
        </Menu>
      </Sider>
      <Drawer
        title={
          <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                xs={19}
                sm={18}
                md={20}
                xl={22}
                xxl={22}
                style={{ marginTop: 10 }}
              >
                <Link to={PathPrivateRouter.home}>
                  <Row>
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
                        color: "#4F6F52",
                        textAlign: "center",
                      }}
                    >
                      {system.map((i) => i.nameWeb)}
                    </Typography>
                  </Row>
                </Link>
              </Col>
            </Row>
          </>
        }
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        placement="left"
        size="default"
      >
        <Menu>
          {items.map((item:any) =>
            item.children ? (
              <SubMenu key={item.key} icon={item.icon} title={item.label}>
                {item.children.map((child:any) => (
                  <Menu.Item
                    key={child.key}
                    onClick={() => handleClick(child.path)}
                  >
                    <NavLink to={child.path}>{child.label}</NavLink>
                  </Menu.Item>
                ))}
              </SubMenu>
            ) : (
              <Menu.Item
                key={item.key}
                icon={item.icon}
                onClick={() => handleClick(item.path)}
              >
                <NavLink to={item.path}>{item.label}</NavLink>
              </Menu.Item>
            )
          )}
        </Menu>
        <Button
          onClick={() => {
            dispatch(signOut());
            history(PathPublicRouter.home);
            window.location.reload();
          }}
          type="primary"
          style={{ backgroundColor: "red" }}
          block
        >
          <LogoutOutlined />
          ออกจากระบบ
        </Button>
      </Drawer>
      <Layout>
        <Header style={{ backgroundColor: "#4F6F52" }}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={2} sm={2} md={2} xl={8} xxl={8} className="menuIcon">
              <Button
                type="text"
                icon={
                  collapsed ? (
                    <MenuUnfoldOutlined style={{ color: "#fff" }} />
                  ) : (
                    <MenuFoldOutlined style={{ color: "#fff" }} />
                  )
                }
                onClick={() => setOpenDrawer(true)}
                style={{
                  fontSize: "16px",
                }}
              />
            </Col>
            <Col xs={22} sm={22} md={22} xl={22} xxl={22}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col
                  xs={19}
                  sm={18}
                  md={20}
                  xl={22}
                  xxl={22}
                  style={{ marginTop: 10 }}
                >
                  <Link to={PathPrivateRouter.home}>
                    <Row>
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
              </Row>
            </Col>
            <Col xs={2} sm={2} md={2} xl={2} xxl={2} className="headerMenu">
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
                    history(PathPublicRouter.home);
                    window.location.reload();
                  }}
                  type="primary"
                  style={{ backgroundColor: "red" }}
                >
                  <LogoutOutlined />
                  ออกจากระบบ
                </Button>
              </Row>
            </Col>
          </Row>
        </Header>
        <Carousel autoplay>
          {system.map((sys: any) =>
            sys?.imageSlide?.map((imageS: any) => {
              // console.log("imageS", imageS);
              const mapImg = PathImage.imageSlide + imageS.imageSlides;
              return (
                <div>
                  <img
                    style={{ width: "100%", height: "350px" }}
                    src={mapImg}
                  ></img>
                </div>
              );
            })
          )}
        </Carousel>

        <Content>
          <main id="main" style={{ margin: 20, flex: 1 }}>{children}</main>
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


