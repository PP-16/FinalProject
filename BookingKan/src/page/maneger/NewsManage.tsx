import {
  CloseOutlined,
  ExclamationCircleFilled,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Image,
  Input,
  Space,
  Button,
  Form,
  Upload,
  message,
  UploadProps,
  UploadFile,
  Card,
  Modal,
  Table,
  Row,
  Carousel,
  InputRef,
} from "antd";

import React, { useEffect, useRef, useState } from "react";
import { FieldValue } from "react-hook-form";
import { News } from "../../api/models/News";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { createNewsAsync, fetchNews } from "../../api/redux/Slice/NewsSlice";
import agent from "../../api/agent";
import moment from "moment";

import { fstat } from "fs";
import { PathImage } from "../../routers/PathImage";
import { RcFile } from "antd/es/upload";
import Highlighter from "react-highlight-words";
import { FilterDropdownProps } from "antd/es/table/interface";

export const NewsManage = () => {
  const [news, setNews] = useState<News[]>([]);
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const { TextArea } = Input;
  const [modalFrom, setModalFrom] = useState(false);
  const [modalFromEdit, setModalFromEdit] = useState<any>(false);
  const [dataEdit, setDataEdit] = useState<any>();
  const [modalImage, setModalImage] = useState<any>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    agent.News.getNews().then((news) => setNews(news));
  }, []);
  const handleEdit = (data: any) => {
    setModalFromEdit(true);
    setDataEdit(data);
  };
  console.log("dataEdit", dataEdit);
  useEffect(() => {
    if (modalFrom || modalFromEdit) {
      if (dataEdit.key != undefined) {
        const fromDataEdit = dataEdit?.imageNews.map((img: any) => ({
          uid: img.imageNewsId,
          name: img.images,
          status: "done",
          url: `${PathImage.imageNews}${img.images}`,
        }));
        console.log("fromDataEdit", fromDataEdit);

        setFileList(fromDataEdit);

        form.setFieldsValue({
          key: dataEdit.key,
          newsName: dataEdit.newsName,
          newsDetails: dataEdit.newsDetails,
          imageNews: dataEdit.imageNews,
        });
      } else {
        form.setFieldsValue({
          key: null,
          newsName: null,
          newsDetails: null,
          imageNews: null,
        });
        setFileList([]);
      }
    }
    setImgRemove([]);
  }, [dataEdit, form, modalFrom, modalFromEdit]);

  const [imgRemove, setImgRemove] = useState<any>([]);

  const handleRemoveImg = (img: any) => {
    setImgRemove([...imgRemove, img.uid]);
  };
  //#region createNews
  const onFinish = ({ newsName, newsDetails }: any) => {
    let newsId = dataEdit.key; // เปลี่ยน const เป็น let
    if (newsId === undefined) {
      newsId = 0; // ใช้ = เพื่อกำหนดค่าให้กับ newsId แทน ==
    }
    try {
      const NewsDTO = {
        newsId: newsId,
        newsName: newsName,
        newsDetails: newsDetails,
        imageNews: fileList,
      };
      // console.log("NewsDTO", NewsDTO);
      dispatch(createNewsAsync(NewsDTO)).then(() => {
        form.resetFields();
        agent.News.getNews().then((news) => setNews(news));
        setModalFrom(false);
        setModalFromEdit(false);
        setFileList([]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const onReset = () => {
    form.resetFields();
  };
  //#endregion

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการลบข่าวประชาสัมพันธ์นี้ ?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบให้แน่ใจว่าคุณต้องการลบข่าวประชาสัมพันธ์นี้",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่ ขอบคุณ",
      onOk() {
        agent.News.deleteNews(record.key).then(() => {
          agent.News.getNews().then((news) => setNews(news));
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  //#region table

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: any
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: any, textPlaceholder: any): any => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`ค้นหา${textPlaceholder}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            ค้นหา
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            ล้าง
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            กรอง
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              dispatch(fetchNews());
              close();
            }}
          >
            ปิด
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible: any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const dataSource = news.map((newsItem) => {
    const date = moment(newsItem.createAt).format("Do MMMM YYYY");
    // let images: any = [];
    // if (Array.isArray(newsItem.imageNews)) {
    //   images = newsItem.imageNews.map(
    //     (image) => PathImage.imageNews + image.images
    //   );
    // }
    return {
      key: newsItem.newsId,
      newsName: newsItem.newsName,
      newsDetails: newsItem.newsDetails,
      imageNews: newsItem.imageNews,
      createAt: date,
    };
  });

  const columns = [
    {
      title: "หัวข้อข่าว",
      dataIndex: "newsName",
      key: "newsName",
      ...getColumnSearchProps("newsName", "หัวข้อข่าว"),
    },
    {
      title: "รายละเอียด",
      dataIndex: "newsDetails",
      key: "newsDetails",
    },
    {
      title: "สร้างเมื่อ",
      dataIndex: "createAt",
      key: "createAt",
      ...getColumnSearchProps("createAt", "สร้างเมื่อ"),
    },
    {
      title: "ภาพประกอบ",
      key: "operation",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={() => setModalImage(record)}
        >
          แสดงรูปภาพ
        </Button>
      ),
    },
    {
      title: "แก้ไข",
      key: "operation",
      render: (_: any, record: any) => (
        <Button
          type="dashed"
          style={{ backgroundColor: "#faad14" }}
          onClick={() => {
            handleEdit(record);
          }}
        >
          แก้ไข
        </Button>
      ),
    },
    {
      title: "ลบ",
      key: "operation",
      render: (_: any, record: any) => (
        <Button
          type="primary"
          style={{ backgroundColor: "red" }}
          onClick={() => showDeleteConfirm(record)}
        >
          ลบ
        </Button>
      ),
    },
  ];

  //#endregion

  //#region handleUpload

  // const getBase64 = (file: any): Promise<string> =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result as string);
  //     reader.onerror = (error) => reject(error);
  //   });

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);
console.log("fileList",fileList);

  // const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1)
    );
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );
  //#endregion

  const onCancleModal = () => {
    setModalFromEdit(false);
    form.resetFields();
  };

  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
  };

  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={() => setModalFrom(true)}
        >
          เพิ่มข่าว / ประชาสัมพันธ์
        </Button>
      </Row>
      <Modal
        open={modalFrom}
        footer={false}
        onCancel={() => setModalFrom(false)}
        width={1000}
      >
        <Card style={{ margin: 15 }}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item label="ชื่อหัวข้อ" name="newsName">
              <Input />
            </Form.Item>
            <Form.Item label="รายละเอียด" name="newsDetails">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="รูปภาพ" name="imageNews">
              <Upload
                action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                listType="picture-card"
                fileList={fileList}
                // onPreview={handlePreview}
                onChange={handleChange}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        open={modalFromEdit}
        footer={false}
        onCancel={onCancleModal}
        width={1000}
      >
        <Card style={{ margin: 15 }}>
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="รหัสข่าว / ประชาสัมพันธ์"
              name="key"
              initialValue={modalFromEdit.key}
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label="ชื่อหัวข้อ"
              name="newsName"
              initialValue={modalFromEdit.newsName}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="รายละเอียด"
              name="newsDetails"
              initialValue={modalFromEdit.newsDetails}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="รูปภาพ"
              name="imageNews"
              // initialValue={modalFromEdit.imageNewsRaw}
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
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewOpen(false)}
              >
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="button" onClick={onReset}>
                Reset
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Modal>
      <Modal
        open={modalImage !== false} // change open to visible
        footer={false}
        onCancel={() => setModalImage(false)}
        width={1000}
      >
        <Card style={{ margin: 15 }}>
          <Carousel draggable>
            {modalImage.imageNews &&
              modalImage.imageNews.map((image: any, index: any) => {
                console.log("imageNew", image);
                // console.log("index", index);

                return (
                  <div key={index} style={contentStyle}>
                    <img src={PathImage.imageNews + image.images} width={"100%"} />
                  </div>
                );
              })}
          </Carousel>
        </Card>
      </Modal>
      <Table dataSource={dataSource} columns={columns} scroll={{ x: 1300 }} />;
    </>
  );
};
