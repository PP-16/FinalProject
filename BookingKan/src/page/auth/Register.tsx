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
          message.success("Submit success!");
          history("/");
        }
        if (registerUser.rejected.match(action)) {
          notification.error({
            message: `Submit failed!`,
            description: "Please Check you anser agian!!",
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
    console.log("value", values);
    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={!submittable}
        block
        onClick={() => register(values)}
      >
        Submit
      </Button>
    );
  };

  return (
    <div className="loginBg">
      <Form
        className="loginForm animate__animated animate__bounceInDown"
        form={form}
      >
        <Typography.Title>Welcome to Bookingkan</Typography.Title>
        <Form.Item label="passengerName" name="passengerName">
          <Input placeholder="Enter your name"></Input>
        </Form.Item>
        <Form.Item label="idCardNumber" name="idCardNumber">
          <Input placeholder="Enter your ID Cardnumber"></Input>
        </Form.Item>
        <Form.Item label="phone" name="phone">
          <Input placeholder="Enter your Phone Number"></Input>
        </Form.Item>
        <Form.Item label="email" name="email">
          <Input placeholder="Enter your email"></Input>
        </Form.Item>
        <Form.Item label="password" name="password">
          <Input.Password
            placeholder="Enter your password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <SubmitButton form={form} />
        <div className="regis">
          <Link to="/">
            <Typography>Do you have an account?</Typography>
          </Link>
        </div>
        <Divider style={{ borderColor: "black" }}>or Login with</Divider>
        <div className="socialLogin">
          <GoogleOutlined className="socialIcon" style={{ color: "red" }} />
          <FacebookFilled className="socialIcon" style={{ color: "blue" }} />
          <TwitterOutlined className="socialIcon" style={{ color: "cyan" }} />
        </div>
      </Form>
    </div>
  );
};
