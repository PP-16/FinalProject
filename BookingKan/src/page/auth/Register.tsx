import {
  EyeTwoTone,
  FacebookFilled,
  GoogleOutlined,
  TwitterOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../api/redux/Slice/AccountSlice";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { Passentger } from "../../api/models/Passentger";
import { PathAccountRouter } from "../../routers/PathAllRoute";

export const Register = () => {
  const [passent, setPassent] = useState<Passentger[]>([]);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const history = useNavigate();

  const register = async ({
    email,
    password,
    passengerName,
    phone,
    idCardNumber,
  }: {
    passengerName: string;
    idCardNumber: string;
    email: string;
    password: string;
    phone: string;
  }) => {
    try {
      //console.log("Email and Password before dispatch:", email, password);
      await dispatch(
        registerUser({ email, password, passengerName, phone, idCardNumber })
      ).then((action: any) => {
        if (registerUser.fulfilled.match(action)) {
          history(PathAccountRouter.login);
          notification.success({
            message: `สำเร็จ!`,
            description: "กรุณาเข้าสู่ระบบอีกครั้ง!!",
            placement: "top",
          });
        }
        if (registerUser.rejected.match(action)) {
          notification.error({
            message: `เกิดข้อผิดพลาด!`,
            description: "กรุณาตรวจสอบอีกครั้ง!!",
            placement: "top",
          });
        }
      });
      // Rest of the code remains unchanged
    } catch (error: any) {
      console.log("Error during login:", error);
    }
  };

  const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
      form.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        }
      );
    }, [values]);
    // console.log("value", values);
    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={!submittable}
        block
        onClick={() => register(values)}
      >
        เข้าสู่ระบบ
      </Button>
    );
  };

  return (
    <div className="loginBg">
      <Form
        className="loginForm animate__animated animate__bounceInDown"
        form={form}
      >
        <Typography.Title>ยินดีต้อนรับเข้าสู่ Bookingkan</Typography.Title>
        <Form.Item label="ชื่อ" name="passengerName">
          <Input placeholder="นายใจดี ดีใจ"></Input>
        </Form.Item>
        <Form.Item label="หมายเลขบัตรประชาชน" name="idCardNumber">
          <Input placeholder="123-456789-129-9"></Input>
        </Form.Item>
        <Form.Item label="เบอร์โทรศัพท์" name="phone">
          <Input placeholder="080-****-***"></Input>
        </Form.Item>
        <Form.Item label="อีเมล์" name="email">
          <Input placeholder="ใจดี@gmaill.com"></Input>
        </Form.Item>
        <Form.Item label="รหัสผ่าน" name="password">
          <Input.Password
            placeholder="gidee123"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <SubmitButton form={form} />
        {/* <div className="regis">
          <Link to="/login">
            <Typography>Do you have an account?</Typography>
          </Link>
        </div> */}
        {/* <Divider style={{ borderColor: "black" }}>or Login with</Divider>
        <div className="socialLogin">
          <GoogleOutlined className="socialIcon" style={{ color: "red" }} />
          <FacebookFilled className="socialIcon" style={{ color: "blue" }} />
          <TwitterOutlined className="socialIcon" style={{ color: "cyan" }} />
        </div> */}
      </Form>
    </div>
  );
};
