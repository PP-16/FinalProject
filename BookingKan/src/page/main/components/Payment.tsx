import {
  Card,
  Col,
  QRCode,
  Row,
  Image,
  Descriptions,
  Button,
  message,
  Upload,
  UploadProps,
  UploadFile,
  Modal,
  Form,
  notification,
} from "antd";
import React, { useState } from "react";
import {
  ExclamationCircleFilled,
  InboxOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { updateStatusBookingAsync } from "../../../api/redux/Slice/BookingSlice";
import { useAppDispatch, useAppSelector } from "../../../api/redux/Store/configureStore";
import { Booking } from "../../../api/models/Booking";
import { RcFile } from "antd/es/upload";
import { PathImage, imageLocal } from "../../../routers/PathImage";
import { SystemSetting } from "../../../api/models/SystemSetting";

// export const Payment = () => {
//   const [swapLayout, setSwapLayout] = useState(false);
//   const [paymentmethod, setPaymentmethod] = useState(1);
//   const { confirm } = Modal;
//   const system: any = useAppSelector((t) => t.system.system);

//   const handelonSelect = (number: any) => {
//     setPaymentmethod(number);
//     setSwapLayout(true);
//   };

//   const handdleSelect2 = (number: any) => {
//     confirm({
//       title: "ต้องการชำระด้วยเงินสด ?",
//       icon: <ExclamationCircleFilled />,
//       content: "กรุณาตรวจสอบยอดเงินให้ถูกต้อง",
//       onOk() {
//         setPaymentmethod(number);
//         return new Promise((resolve, reject) => {
//           setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
//         }).catch(() => console.log("Oops errors!"));
//       },
//       onCancel() {},
//     });
//   };
//   console.log("paymentmethod", paymentmethod);

//   //#region upload
//   // type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

//   // const getBase64 = (file: FileType): Promise<string> =>
//   //   new Promise((resolve, reject) => {
//   //     const reader = new FileReader();
//   //     reader.readAsDataURL(file);
//   //     reader.onload = () => resolve(reader.result as string);
//   //     reader.onerror = (error) => reject(error);
//   //   });

//   const getBase64 = (file: RcFile): Promise<string> =>
//     new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result as string);
//       reader.onerror = (error) => reject(error);
//     });

//   const [previewImage, setPreviewImage] = useState("");
//   const [fileList, setFileList] = useState<any[]>([]);

//   const handlePreview = async (file: any) => {
//     if (!file.url && !file.preview) {
//       file.preview = await getBase64(file.originFileObj);
//     }
//     setPreviewImage(file.url || (file.preview as string));
//   };

//   const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
//     setFileList(newFileList);
//   const { Dragger } = Upload;
//   //#endregion

//   //#region stripe
//   const stripe = useStripe();
//   const elements = useElements();
//   const [errorMessage, setErrorMessage] = useState(null);
//   const [detalis, setDetalis] = useState<Booking[]>([]);
//   const [payment, setPayment] = useState();
//   const dispatch = useAppDispatch();
//   console.log("payment", payment);

//   // const handleSubmit = async (event: any) => {
//   //   if (event && event.preventDefault) {
//   //     event.preventDefault();
//   //   }

//   //   if (elements == null) {
//   //     return;
//   //   }

//   //   // Trigger form validation and wallet collection
//   //   const { error: submitError } = await elements.submit();
//   //   if (submitError) {
//   //     // Show error to your customer
//   //     setErrorMessage(submitError.message);
//   //     console.log("submitError.message", submitError.message);
//   //     return;
//   //   }

//   //   const clientSecret = payment.clientSecret;

//   //   try {
//   //     // ทำการ confirmPayment
//   //     dispatch(updateStatusBookingAsync({ ID: bookingData, statusBooking: 2 }));
//   //     const result = await stripe.confirmPayment({
//   //       elements,
//   //       clientSecret: clientSecret,
//   //       confirmParams: {
//   //         return_url: "http://127.0.0.1:5173/AccountPage",
//   //       },
//   //     });

//   //     // แสดง notification สำเร็จ
//   //     notification.success({
//   //       message: "สำเร็จ",
//   //       description: "ขอบคุณที่จองรถกับเรา.",
//   //     });
//   //   } catch (error) {
//   //     // กรณีเกิด error ในการ confirmPayment
//   //     console.error(error);

//   //     // ทำการแสดง notification ข้อผิดพลาด (ถ้าต้องการ)
//   //     notification.error({
//   //       message: "เกิดข้อผิดพลาด",
//   //       description: "ไม่สามารถทำการจองรถได้ กรุณาลองใหม่อีกครั้ง.",
//   //     });
//   //   }

//   //   if (error) {
//   //     message.error(error.message);
//   //     // setErrorMessage(error.message);
//   //     console.log("error.message", error.message);
//   //   }
//   //   message.success("Payment successful!");
//   // };
//   //#endregion

//   console.log("fileList", fileList);
//   console.log("previewImage", previewImage);

//   return (
//     <>
//       {swapLayout == true ? (
//         <>
//           <Card title="Paymentmethod">
//             {paymentmethod == 1 && (
//               <Card>
//                 <Row>
//                   <Col span={8}>
//                   {system.map((itemSys: SystemSetting) => {
//                 const imgQr = PathImage.imagePayment + itemSys.imagePrompay;
//                 return <Image src={imgQr} width={"100%"} />;
//               })}
//                   </Col>
//                   <Col span={16}>
//                     <Card title="รายละเอียด" style={{ width: "100%" }}>
//                       <Descriptions>
//                         <Descriptions.Item label="UserName">
//                           Zhou Maomao
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Telephone">
//                           1810000000
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Live">
//                           Hangzhou, Zhejiang
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Remark">
//                           empty
//                         </Descriptions.Item>
//                         <Descriptions.Item label="Address">
//                           No. 18, Wantang Road, Xihu District, Hangzhou,
//                           Zhejiang, China
//                         </Descriptions.Item>
//                       </Descriptions>
//                       {fileList.length != 0 ? (
//                         <>
//                           <img
//                             alt="example"
//                             style={{ width: "100%" }}
//                             src={previewImage}
//                           />
//                         </>
//                       ) : (
//                         <Dragger
//                           action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
//                           listType="picture"
//                           maxCount={1}
//                           fileList={fileList}
//                           onPreview={handlePreview}
//                           onChange={handleChange}
//                         >
//                           <>
//                             <p className="ant-upload-drag-icon">
//                               <InboxOutlined />
//                             </p>
//                             <p className="ant-upload-text">อัพโหลด</p>
//                             <p className="ant-upload-hint">
//                               คลิกหรือลากไฟล์มาที่นี่เพื่ออัพโหลด
//                             </p>
//                           </>
//                         </Dragger>
//                       )}
//                     </Card>
//                   </Col>
//                 </Row>
//               </Card>
//             )}
//             {paymentmethod == 3 && (
//               <>
//                 <Card style={{ margin: 20 }}>
//                   <Form  >
//                     <Form.Item>
//                       <PaymentElement />
//                     </Form.Item>
//                     <Form.Item>
//                       <Button
//                         type="primary"
//                         htmlType="submit"
//                         block
//                         disabled={!stripe || !elements}
//                       >
//                         Pay
//                       </Button>
//                     </Form.Item>
//                   </Form>
//                 </Card>
//               </>
//             )}
//           </Card>
//         </>
//       ) : (
//         <>
//           <Row style={{ justifyContent: "space-evenly" }}>
//             <Col span={6}>
//               <Card title="สแกนจ่าย" onClick={() => handelonSelect(1)}>
//                 <img src={imageLocal.tarnfer} width={100} />
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card title="เงินสด" onClick={() => handdleSelect2(2)}>
//                 <img src={imageLocal.cash} width={100} />
//               </Card>
//             </Col>
//             <Col span={6}>
//               <Card
//                 title="จ่ายผ่านบัตรเครดิต"
//                 onClick={() => handelonSelect(3)}
//               >
//                 <img src={imageLocal.card} width={100} />
//               </Card>
//             </Col>
//           </Row>
//         </>
//       )}
//     </>
//   );
// };
