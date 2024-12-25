import {
  AntDesignOutlined,
  DownloadOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Row,
  Upload,
  UploadProps,
  message,
} from "antd";
import agent from "../../../api/agent";
import {
  store,
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import { log } from "console";
import { useEffect, useState } from "react";
import { Passentger } from "../../../api/models/Passentger";
import { updateImageuserAsync } from "../../../api/redux/Slice/AccountSlice";
import { PathImage } from "../../../routers/PathImage";
import { RcFile } from "antd/es/upload";

export const Userpage = () => {
  const token = store.getState().account.user?.token;

  const [userDetail, setUser] = useState<any>([]);
  const [modalChangPro, setModalChangPro] = useState(false);
  const user = useAppSelector((t) => t.account.user);
  console.log("user", user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    agent.Account.getUser(user?.token).then((user) => setUser(user));
  }, []);
  console.log("userD", userDetail);

  const PhoneNumberComponent = () => {
    console.log("number", userDetail.phone);

    // Check if user.phone exists before trying to format
    if (userDetail.phone) {
      const phoneNumber = userDetail.phone;

      // Extract the first 3 digits and the last 2 digits
      const prefix = phoneNumber.substring(0, 3);
      const suffix = phoneNumber.substring(phoneNumber.length - 1);

      // If there are more than 5 digits, replace the rest with 'x'
      const maskedMiddle =
        phoneNumber.length > 5
          ? phoneNumber.substring(3, phoneNumber.length - 1).replace(/\d/g, "x")
          : "";

      // Combine the parts to form the masked phone number
      const maskedPhoneNumber = `${prefix}-${maskedMiddle}${suffix}`;

      return <span>{maskedPhoneNumber}</span>;
    }

    // If user.phone is undefined, return a default message or handle it accordingly
    return <span>No phone number available</span>;
  };
  const PartialIdCard = () => {
    // Check if user object and idCardNumber property are defined
    if (!userDetail || !userDetail.idCardNumber) {
      return <div>No ID Card Number available</div>;
    }

    // ตัดบางส่วนของหมายเลขบัตรประชาชนเพื่อไม่ให้แสดงทั้งหมด
    const maskedIdNumber = `${userDetail.idCardNumber.substring(
      0,
      3
    )}-XXXXXXXX-X${userDetail.idCardNumber.substring(12)}`;

    return <span>{maskedIdNumber}</span>;
  };

  const image = PathImage.imageUser + userDetail.imagePassenger;

  //#region uploadProfile

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    setModalChangPro(true);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
  };

  const [imageUrl, setImageUrl] = useState<string>();
  const [imageUserUrl, setImageUserUrl] = useState<string>();
  // type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

  // const getBase64 = (img: FileType, callback: (url: string) => void) => {
  //   const reader = new FileReader();
  //   reader.addEventListener("load", () => callback(reader.result as string));
  //   reader.readAsDataURL(img);
  // };

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const { Dragger } = Upload;

  const props: UploadProps = {
    name: "file",
    maxCount: 1,
    // multiple: true,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      // getBase64(info.file.originFileObj as FileType, (url) => {
      //   setImageUrl(url);
      // });
      getBase64(info.file.originFileObj as RcFile).then((res) => {
        setImageUrl(res);
      });
      setImageUserUrl(originFileObj);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const onOkmodal = async () => {
    try {
      const uploadImageDTO = {
        passengerId: userDetail.passengerId,
        imagePassenger: imageUserUrl || null,
      };
      dispatch(updateImageuserAsync(uploadImageDTO)).then(() => {
        setModalChangPro(false);
        agent.Account.getUser(user?.token).then((user) => setUser(user));
      });
    } catch (error) {
      console.log("imgerror", error);
    }
  };

  //#endregion

  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col xs={24} sm={24} md={24} xl={6} xxl={6}>
          <Popconfirm
            title="เปลี่ยนรูปโปรไฟล์"
            description="เลือกรูปโปรไฟล์ ?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="ตกลง"
            cancelText="ไม่"
          >
            <Avatar
              size={{ xs: 80, sm: 80, md: 90, lg: 150, xl: 170, xxl: 200 }}
              //   icon={<AntDesignOutlined />}
              src={
                userDetail.imagePassenger == null ? (
                  <UserOutlined style={{ color: "black" }} />
                ) : (
                  image
                )
              }
            />
          </Popconfirm>
        </Col>
        <Col xs={24} sm={24} md={24} xl={18} xxl={20} style={{ flex: 1 }}>
          <Card title="ข้อมูลส่วนตัว" style={{ width: "100%" }}>
            <Descriptions>
              <Descriptions.Item label="ชื่อ">
                {userDetail.passengerName}
              </Descriptions.Item>
              <Descriptions.Item label="อีเมล์">
                {userDetail.email}
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขเบอร์โทรศัพท์">
                <PhoneNumberComponent />
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขบัตรประจำตัวประชาชน">
                <PartialIdCard />
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      <Modal
        open={modalChangPro}
        onCancel={() => setModalChangPro(false)}
        onOk={onOkmodal}
      >
        <Dragger {...props}>
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
          ) : (
            <>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">อัพโหลด</p>
              <p className="ant-upload-hint">
                คลิกหรือลากไฟล์มาที่นี่เพื่ออัพโหลด
              </p>
            </>
          )}
        </Dragger>
      </Modal>
    </>
  );
};
