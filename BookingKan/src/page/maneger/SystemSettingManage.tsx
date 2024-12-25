import { InboxOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Image,
  Form,
  Input,
  Upload,
  Row,
  Col,
  Descriptions,
  Modal,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import {
  fetchSystem,
  updateSystemAsync,
} from "../../api/redux/Slice/SystemSlice";
import { PathImage } from "../../routers/PathImage";
import { SystemSetting } from "../../api/models/SystemSetting";
import agent from "../../api/agent";

export const SystemSettingManage = () => {
  const [editDisable, setEditDisable] = useState(true);
  const dispatch = useAppDispatch();
  const system: any = useAppSelector((t) => t.system.system);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchSystem());
    if (system?.length == 0) {
      setEditDisable(false);
    }
  }, [dispatch]);

  console.log("system", system?.length);

  useEffect(() => {
    if (editDisable) {
      if (system?.length == 0) {
        form.setFieldsValue({
          systemSettingId: 0,
          logo: null,
          imageSlide: null,
          nameWeb: null,
          phoneNumber: null,
          address: null,
          contactFB: null,
          contactIG: null,
          contactLine: null,
          imagePrompay: null,
        });
        setFileList(null);
        setImageSlipeUrl(null);
        setImageLogo(null);
      } else {
        const fromDataEdit = system[0]?.imageSlide.map((img: any) => ({
          uid: img.imageSlideId,
          name: img.imageSlides,
          status: "done",
          url: `${PathImage.imageSlide}${img.imageSlides}`,
        }));
        console.log("fromDataEdit", fromDataEdit);
        setFileList(fromDataEdit);
        setImageSlipeUrl(system[0]?.imagePrompay);
        setImageLogo(system[0]?.logo);
        form.setFieldsValue({
          systemSettingId: system[0]?.systemSettingId,
          logo: system[0]?.logo,
          imageSlide: system[0]?.imageSlide,
          nameWeb: system[0]?.nameWeb,
          phoneNumber: system[0]?.phoneNumber,
          address: system[0]?.address,
          contactFB: system[0]?.contactFB,
          contactIG: system[0]?.contactIG,
          contactLine: system[0]?.contactLine,
          imagePrompay: system[0]?.imagePrompay,
        });
      }
    }
    setImgRemoveSildes([]);
  }, [system, form, editDisable]);

  const onFinish = async (values: any) => {
    try {
      const {
        logo,
        imageSlide,
        nameWeb,
        phoneNumber,
        address,
        contactFB,
        contactIG,
        contactLine,
        imagePrompay,
      } = values;

      const DTo = {
        systemSettingId: system[0]?.systemSettingId,
        nameWeb: nameWeb,
        phoneNumber: phoneNumber,
        address: address,
        contactFB: contactFB,
        contactIG: contactIG,
        contactLine: contactLine,
        logo: imageLogo ?? null,
        imagePrompay: imageSlipeUrl ?? null,
        imageSlide: fileList,
      };

      console.log("DTo", DTo);

      await dispatch(updateSystemAsync(DTo)).then(() => {
        setEditDisable(true);
        imgRemoveSildes.map((img: any) =>
          agent.SystemSetting.deleteImageSildes(img).then(async () => {
            await dispatch(fetchSystem());
          })
        );
        dispatch(fetchSystem());
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const { Dragger } = Upload;

  //#region logo
  const [imageLogoUrl, setImageLogoUrl] = useState(null);
  const [imageLogo, setImageLogo] = useState<any>(null);

  const propsLogo = {
    name: "file",
    maxCount: 1,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      getBase64(info.file.originFileObj, (url: any) => {
        setImageLogoUrl(url);
      });
      setImageLogo(originFileObj);
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  //#endregion
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<any>([]);

  const [imgRemoveSildes, setImgRemoveSildes] = useState<any>([]);

  const handleRemoveImg = (img: any) => {
    setImgRemoveSildes([...imgRemoveSildes, img.uid]);
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      getBase64(file.originFileObj, (result: any) => {
        file.preview = result;
        setPreviewImage(result);
        setPreviewOpen(true);
        setPreviewTitle(
          file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
      });
    } else {
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
      setPreviewTitle(
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
      );
    }
  };

  const handleChange = ({ fileList: newFileList }: any) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  //#endregion

  //#region prompay
  const [imageUrl, setImageUrl] = useState(null);
  const [imageSlipeUrl, setImageSlipeUrl] = useState<any>(null);

  const propsSlipe = {
    name: "file",
    maxCount: 1,
    action: "https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188",
    onChange(info: any) {
      const { status, originFileObj } = info.file;
      getBase64(info.file.originFileObj, (url: any) => {
        setImageUrl(url);
      });
      setImageSlipeUrl(originFileObj);
    },
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  
  //#endregion
  console.log("setImageLogo", imageLogo);
  console.log("setImageSlipeUrl", imageSlipeUrl);
  
  return (
    <>
      <Card>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
            <Form form={form} onFinish={onFinish}>
              <Descriptions>
                {system?.map((item: SystemSetting) => {
                  // const imagelogo = PathImage.logo + item?.logo;
                  // const imagePayment = PathImage.imagePayment + item?.imagePrompay;
                  return (
                    <React.Fragment key={item?.systemSettingId}>
                      <Descriptions.Item label="โลโก้">
                        <Form.Item name="logo" initialValue={item?.logo}>
                          {editDisable ? (
                            <>
                            {imageLogo ? (
                              <Image
                              src={`${PathImage.logo}${imageLogo}`}
                              alt="avatar"
                              style={{ width: "190px" }}
                            />):null}
     
                          </>
                          ) : (
                            <Dragger {...propsLogo}>
                              {imageLogoUrl ? (
                                <img
                                  src={imageLogoUrl}
                                  alt="avatar"
                                  style={{ width:  "190px" }}
                                />
                              ): (
                                <Row style={{ justifyContent: "center" }}>
                                  <Col xs={12} sm={12} md={16} xl={24} xxl={24}>
                                    <p className="ant-upload-drag-icon">
                                      <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                      อัพโหลดไฟล์
                                    </p>
                                    <p className="ant-upload-hint">
                                      ลากหรือเลือกรูปที่ต้องการ
                                    </p>
                                  </Col>
                                </Row>
                              )}
                            </Dragger>
                          )}
                        </Form.Item>
                      </Descriptions.Item>
                      <Descriptions.Item label="ชื่อเว็บแอปพลิเคชัน">
                        <Form.Item name="nameWeb" initialValue={item?.nameWeb}>
                          <Input
                            defaultValue={item?.nameWeb}
                            disabled={editDisable}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="เบอร์โทรศัพท์">
                        <Form.Item
                          name="phoneNumber"
                          initialValue={item?.phoneNumber}
                        >
                          <Input
                            defaultValue={item?.phoneNumber}
                            disabled={editDisable}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="ที่อยู่">
                        <Form.Item name="address" initialValue={item?.address}>
                          <Input
                            defaultValue={item?.address}
                            disabled={editDisable}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="ลิ้งค์เฟสบุ๊ค">
                        <Form.Item
                          name="contactFB"
                          initialValue={item?.contactFB}
                        >
                          <Input
                            defaultValue={item?.contactFB}
                            disabled={editDisable}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="ลิ้งค์อินสตราแกรม">
                        <Form.Item
                          name="contactIG"
                          initialValue={item?.contactIG}
                        >
                          <Input
                            defaultValue={item?.contactIG}
                            disabled={editDisable}
                          />
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="ไอดีไลน์">
                        <Form.Item
                          name="contactLine"
                          initialValue={item?.contactLine}
                        >
                          <Input
                            defaultValue={item?.contactLine}
                            disabled={editDisable}
                          />
                        </Form.Item>
                      </Descriptions.Item>
                      <Descriptions.Item label="คิวอาร์โค้ดพร้อมเพย์">
                        <Form.Item
                          name="imagePrompay"
                          initialValue={item?.imagePrompay}
                        >
                          {editDisable ? (
                            <>
                              {imageSlipeUrl ? (
                                <Image
                                  src={`${PathImage.imagePayment}${imageSlipeUrl}`}
                                  alt="avatar"
                                  style={{ width: "190px" }}
                                />
                              ) : (
                                <Row style={{ justifyContent: "center" }}>
                                  <Col xs={12} sm={12} md={16} xl={24} xxl={24}>
                                    <p className="ant-upload-drag-icon">
                                      <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                      อัพโหลดไฟล์
                                    </p>
                                    <p className="ant-upload-hint">
                                      ลากหรือเลือกรูปที่ต้องการ
                                    </p>
                                  </Col>
                                </Row>
                              )}
                            </>
                          ) : (
                            <Dragger {...propsSlipe}>
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt="avatar"
                                  style={{ width: "190px" }}
                                />
                              ) : (
                                <Row style={{ justifyContent: "center" }}>
                                  <Col xs={12} sm={12} md={16} xl={24} xxl={24}>
                                    <p className="ant-upload-drag-icon">
                                      <InboxOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                      อัพโหลดไฟล์
                                    </p>
                                    <p className="ant-upload-hint">
                                      ลากหรือเลือกรูปที่ต้องการ
                                    </p>
                                  </Col>
                                </Row>
                              )}
                            </Dragger>
                          )}
                        </Form.Item>
                      </Descriptions.Item>

                      <Descriptions.Item label="รูปสไลด์">
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                          {editDisable ? (
                            item.imageSlide.map((imageS: any, index: any) => {
                              // console.log("imageS",imageS);
                              // console.log("index",index);
                              return (
                                <Col
                                  key={index}
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  xl={12}
                                  xxl={12}
                                >
                                  <Image
                                    alt="example"
                                    src={
                                      PathImage.imageSlide + imageS.imageSlides
                                    }
                                    width={"190px"}
                                  />
                                  <div>{imageS.imageSlides}</div>
                                </Col>
                              );
                            })
                          ) : (
                            <Form.Item
                              name="imageSlide"
                              initialValue={item.imageSlide}
                            >
                              <Upload
                                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={handleChange}
                                onRemove={(img: any) => {
                                  handleRemoveImg(img);
                                }}
                              >
                                {fileList?.length >= 8 ? null : uploadButton}
                              </Upload>
                              <Modal
                                open={previewOpen}
                                title={previewTitle}
                                footer={null}
                                onCancel={() => setPreviewOpen(false)}
                              >
                                <img
                                  alt="example"
                                  style={{ width: "190px" }}
                                  src={previewImage}
                                />
                              </Modal>
                            </Form.Item>
                          )}
                        </Row>
                      </Descriptions.Item>
                    </React.Fragment>
                  );
                })}
              </Descriptions>
              <Form.Item>
                {!editDisable && system?.length !== 0 && (
                  <Row>
                    <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                      <Button
                        block
                        type="primary"
                        style={{ backgroundColor: "red" }}
                        onClick={() => setEditDisable(true)}
                      >
                        กลับ
                      </Button>
                    </Col>
                    <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                      <Button
                        block
                        type="primary"
                        htmlType="submit"
                        style={{ backgroundColor: "#4F6F52" }}
                      >
                        ยืนยันการแก้ไข
                      </Button>
                    </Col>
                  </Row>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
        <Row
          gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
          style={{ justifyContent: "flex-end", margin: 20 }}
        >
          <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
            {editDisable && (
              <>
                <Button
                  block
                  type="primary"
                  onClick={() => setEditDisable(false)}
                  style={{ backgroundColor: "#4F6F52" }}
                >
                  แก้ไข
                </Button>
              </>
            )}
          </Col>
        </Row>
      </Card>
    </>
  );
};
