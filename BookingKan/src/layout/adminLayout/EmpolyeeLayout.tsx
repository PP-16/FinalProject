import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Layout,
  Menu,
  Row,
  Typography,
  theme,
} from "antd";
import React, { ReactNode, useEffect } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { signOut } from "../../api/redux/Slice/AccountSlice";
import { Link, useNavigate } from "react-router-dom";
import { CarOutlined, LogoutOutlined } from "@ant-design/icons";
import { fetchSystem } from "../../api/redux/Slice/SystemSlice";
import { PathImage } from "../../routers/PathImage";
import { PathPrivateRouter } from "../../routers/PathAllRoute";
import { fetchBookingForCanCle } from "../../api/redux/Slice/BookingSlice";
const { Header, Content, Footer } = Layout;

const items = new Array(15).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`,
}));
export const EmpolyeeLayout: React.FC<{ children: ReactNode }> = ({ children }: any) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const dispatch = useAppDispatch();
  const history = useNavigate();

  const system = useAppSelector((t) => t.system.system);
  useEffect(() => {
    dispatch(fetchSystem());
    
    dispatch(fetchBookingForCanCle())
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <Header style={{ backgroundColor: "#4F6F52" }}>
        <div className="demo-logo" />
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={17} sm={18} md={20} xl={20} xxl={20}>
            <Link to={PathPrivateRouter.home}>
              <Row style={{ marginTop: 10 }}>
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
                    color: "black",
                    textAlign: "center",
                  }}
                >
                  {system.map((i) => i.nameWeb)}
                </Typography>
              </Row>
            </Link>
          </Col>

          <Col xs={7} sm={6} md={4} xl={4} xxl={4}>
            <Button
              onClick={() => {
                dispatch(signOut());
                history(PathPrivateRouter.home);
                window.location.reload();
              }}
              type="primary"
              danger
            >
              <LogoutOutlined />
              ออกจากระบบ
            </Button>
          </Col>
        </Row>
      </Header>
      <Content>
        <Card>
          <main id="main">{children}</main>
        </Card>
      </Content>
    </Layout>
  );
};


