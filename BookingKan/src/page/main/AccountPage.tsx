import {
  DesktopOutlined,
  FileOutlined,
  HistoryOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Card,
  Layout,
  Menu,
  MenuProps,
  Modal,
  Typography,
  theme,
} from "antd";
import { useState } from "react";
import { Userpage } from "./components/Userpage";
import { ChangPassword } from "./components/ChangPassword";
import { HistoryBooking } from "./components/HistoryBooking";

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
  const [collapsed, setCollapsed] = useState(false);
  const [select, setSelect] = useState("1");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const items: MenuItem[] = [
    getItem("ข้อมูลผู้ใช้", "sub1", <UserOutlined />, [
      getItem("ข้อมูลส่วนตัว", "1"),
      getItem("เปลี่ยนรหัสผ่าน", "2"),
    ]),
    getItem("รายการจอง", "3", <HistoryOutlined />),
  ];

  const Contentmenu: any = {
    "1": <Userpage />,
    "2": <ChangPassword />,
    "3": <HistoryBooking />,
  };
  console.log(select);

  const handleMenuItemClick = (item:any) => {
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
        <p>Are you sure you want to change your password?</p>
      </Modal>
      <Card>
        <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
          <Sider
            // collapsible
            // collapsed={collapsed}
            // onCollapse={(value) => setCollapsed(value)}
            theme="light"
          >
            <div
              className="demo-logo-vertical"
              style={{ backgroundColor: "#fff" }}
            />
            <Menu
              theme="light"
              defaultSelectedKeys={[select]}
              mode="inline"
              items={items}
              onClick={(item) => setSelect(item.key)}
            />
          </Sider>
          <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
            <Content style={{ margin: 16, flex: 1, backgroundColor: "#fff" }}>
              <Card style={{ backgroundColor: "#f0f0f0" }}>
                {Contentmenu[select]}
              </Card>
            </Content>
          </Layout>
        </Layout>
      </Card>
    </>
  );
};
