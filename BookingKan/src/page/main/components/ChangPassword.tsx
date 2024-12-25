import {
  Button,
  Card,
  Form,
  FormInstance,
  Input,
  Space,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import agent from "../../../api/agent";
import { useAppDispatch } from "../../../api/redux/Store/configureStore";
import { ChangePassword } from "../../../api/redux/Slice/AccountSlice";
import { FieldValues } from "react-hook-form";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export const ChangPassword = () => {
  const [form] = Form.useForm();
  const [swapLayout, setSwapLayout] = useState(false);
  //#region  formChangePass
  const dispatch = useAppDispatch();
  const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form);
    console.log("values", values);
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

    const handleSubmit = () => {
      const formValues = form.getFieldsValue(); // Get all form values
      changePass(formValues); // Pass form values to changePass function
    };
    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={!submittable}
        onClick={handleSubmit}
      >
        เปลี่ยนรหัสผ่าน
      </Button>
    );
  };
  const changePass = async ({ newPass, chackNew }: FieldValues) => {
    console.log("newPass", newPass);
    console.log("chackNew", chackNew);

    try {
      await dispatch(
        ChangePassword({
          newPass,
          chackNew,
        })
      );
      //   window.location.reload()
    } catch (error: any) {
      console.log("e", error);
    }
  };
  //#endregion

  //#region fromCheckold
  const SubmitButtonCheckold = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form);
    console.log("values", values);
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

    const handleSubmit = () => {
      const formValues = form.getFieldsValue(); // Get all form values
      checkoldPass(formValues); // Pass form values to changePass function
    };
    return (
      <Button
        type="primary"
        htmlType="submit"
        disabled={!submittable}
        onClick={handleSubmit}
      >
        ตกลง
      </Button>
    );
  };
  const checkoldPass = async ({ oldPass }: FieldValues) => {
    console.log("oldPass", oldPass);

    try {
      const result = await agent.Account.checkPass(oldPass);
      console.log("result", result);
      if (result == "200") {
        setSwapLayout(true);
      }

      //   window.location.reload()
    } catch (error: any) {
      notification.error({
        message: `เกิดข้อผิดพลาด!`,
        description: "กรุณาลองใหม่อีกครั้ง!!",
        placement: "top",
      });
      console.log("e", error);
    }
  };

  //#endregion

  return (
    <Card title="เปลี่ยนรหัสผ่าน">
      {swapLayout == true ? (
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            name="newPass"
            label="รหัสผ่านใหม่"
            rules={[{ required: true }]}
          >
            <Input.Password
              placeholder="กรุณากรอกรหัสผ่าน"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="chackNew"
         
            rules={[{ required: true }]}
          >
            <Input.Password
              placeholder="กรุณาพิมพ์รหัสผ่านใหม่อีกครั้ง"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <SubmitButton form={form} />
              <Button htmlType="reset">ล้าง</Button>
            </Space>
          </Form.Item>
        </Form>
      ) : (
        <>
          <p>เพื่อความปลอดภัยกรุณากรอกรหัสผ่านเดิมของคุณ</p>
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
          >
            <Form.Item
              name="oldPass"
              label="รหัสผ่านเดิม"
              rules={[{ required: true }]}
            >
              <Input.Password
                placeholder="กรุณากรอกรหัสของคุณ"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <SubmitButtonCheckold form={form} />
                <Button htmlType="reset">ล้าง</Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      )}
    </Card>
  );
};
