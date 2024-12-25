import {
  CaretLeftOutlined,
  CaretRightOutlined,
  DesktopOutlined,
  FileOutlined,
  HistoryOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Drawer,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Row,
  Typography,
  theme,
} from "antd";
import { useEffect, useState } from "react";
import { Userpage } from "./components/Userpage";
import { ChangPassword } from "./components/ChangPassword";
import { HistoryBooking } from "./components/HistoryBooking";
import { HistoryOrder } from "./components/HistoryOrder";
import { useAppDispatch, useAppSelector } from "../../api/redux/Store/configureStore";
import agent from "../../api/agent";
import { fetchBookingByPassentger } from "../../api/redux/Slice/BookingSlice";

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

export const AccountPage = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [collapsedDrawer, setCollapsedDrawer] = useState(false);
  const [select, setSelect] = useState("1");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const user = useAppSelector((t) => t.account.user);
  const [userDetail, setUser] = useState<any>([]);
  const dispatch =useAppDispatch()
  const booking: any = useAppSelector((t) => t.booking.bookByPassent);
  useEffect(() => {
    agent.Account.getUser(user?.token).then((user) => setUser(user));
    dispatch(fetchBookingByPassentger())
  }, []);
  // console.log("booking",booking);
  
  const items: MenuItem[] = [
    getItem("บัญชีของฉัน", "sub1", <UserOutlined />, [
      getItem("ข้อมูลส่วนตัว", "1"),
      getItem("เปลี่ยนรหัสผ่าน", "2"),
    ]),
    getItem("รายการจอง", "3", <HistoryOutlined />),
    getItem("รายการเช่า", "4", <HistoryOutlined />),
  ];

  const Contentmenu: any = {
    "1": <Userpage />,
    "2": <ChangPassword />,
    "3": <HistoryBooking />,
    "4": <HistoryOrder />,
  };
  // console.log(select);

  const handleMenuItemClick = (item: any) => {
    if (item.key === "2") {
      // Show the password change modal
      setShowPasswordModal(true);
    } else {
      // Change the selected menu item for other cases
      setSelect(item.key);
    }
  };

  const handleModalOk = () => {
    // Handle modal confirmation, e.g., close modal and show ChangPassword
    setShowPasswordModal(false);
    setSelect("2");
  };

  const handleModalCancel = () => {
    // Handle modal cancellation, e.g., close modal
    setShowPasswordModal(false);
  };

  return (
    <>
      <Modal
        title="Change Password"
        open={showPasswordModal}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        {/* You can customize the content of the modal here */}
        <p>คุณต้องการเปลี่ยนรหัสผ่าน ?</p>
      </Modal>
      <Card>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
          <Sider
            trigger={null}
            collapsible
            theme="light"
            className="headerMenu"
          >
            <div
              className="demo-logo-vertical"
              style={{ backgroundColor: "#fff" }}
            />
            {/* <Button
              type="primary"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: "100%" }}
            /> */}
            <Menu
              theme="light"
              defaultSelectedKeys={[select]}
              mode="inline"
              items={items}
              onClick={(item) => setSelect(item.key)}
            />
          </Sider>
          <Drawer
            title={userDetail.passengerName}
            onClose={() => setCollapsedDrawer(false)}
            open={collapsedDrawer}
            placement="left"
            width={"60%"}
          >
            <Menu
              theme="light"
              defaultSelectedKeys={[select]}
              mode="inline"
              items={items}
              onClick={(item) => {
                setSelect(item.key);
                setCollapsedDrawer(false);
              }}
            />
          </Drawer>
          <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Content style={{ margin: 16, flex: 1, backgroundColor: "#fff" }}>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                  <Button
                    className="menuIcon"
                    type="text"
                    icon={<MenuFoldOutlined />}
                    onClick={() => setCollapsedDrawer(!collapsedDrawer)}
                  />
                  {Contentmenu[select]}
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Card>
    </>
  );
};
