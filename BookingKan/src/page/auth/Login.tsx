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
import "./Login.css";
import {
  FacebookFilled,
  GoogleOutlined,
  TwitterOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Passentger } from "../../api/models/Passentger";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import Password from "antd/es/input/Password";
import { FieldValues } from "react-hook-form";
import { signInUser } from "../../api/redux/Slice/AccountSlice";

export const Login = () => {
  const [passent, setPassent] = useState<Passentger[]>([]);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const history = useNavigate();

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      //console.log("Email and Password before dispatch:", email, password);
      await dispatch(signInUser({ email, password }))
      history("/")
      // window.location.reload();
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

    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={!submittable}
        block
        onClick={() => login(values)}
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
        <Form.Item
          label="email"
          name="email"
          rules={[{ required: true, message: "Please enter your email" }]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="password"
          name="password"
          rules={[{ required: true, message: "Please enter your password" }]}
        >
          <Input.Password
            placeholder="Enter your password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        
        <SubmitButton form={form} />

        <div className="regis">
          <Link to="/register">
            <Typography>Don't have an account?</Typography>
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
