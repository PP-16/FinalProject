import React, { useEffect, useRef, useState } from "react";
import {
  Badge,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  InputRef,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TableColumnType,
  Tag,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import { Car } from "../../api/models/Cars";
import agent from "../../api/agent";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  createCarsAsync,
  fetchCars,
  fetchClassCars,
  updateClassCarAsync,
  updateIsUseCarsAsync,
  updateStatusCarAsync,
} from "../../api/redux/Slice/CarsSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { FieldValues } from "react-hook-form";
import { OrderRentItem } from "../../api/models/Order";
import { RcFile } from "antd/es/upload";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { PathImage } from "../../routers/PathImage";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const Cars = () => {
  const cars = useAppSelector((t) => t.cars.cars);
  const classCars = useAppSelector((t) => t.cars.classCars);
  const { confirm } = Modal;
  const [modals, setModal] = useState<any>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>();
  const [statuscar, setStatusCar] = useState("");
  const [categoryCar, setCategoryCar] = useState<any>("");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [classCarsId, setclassCarsId] = useState<any>(Number);
  // console.log("statuscar", statuscar);
  const handleEdit = (data: any) => {
    setModal(true);
    setDataEdit(data);
  };
  //#region  editCars
  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการลบรถคันนี้?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบให้แน่ใจว่าคุณต้องการลบรถคันนี้",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่ ขอบคุณ",
      onOk() {
        agent.Cars.delete(record.key);
        message.success("Delete success!").then(() => {
          dispatch(fetchCars());
        });

        // Add your delete logic here using the record object
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const updateCar = async (carsId: number) => {
    try {
      await dispatch(
        updateStatusCarAsync({ ID: carsId, statusCar: statuscar })
      ).then(() => {
        fetchCars();
      });
      await dispatch(
        updateClassCarAsync({ ID: carsId, ClassID: classCarsId })
      ).then(() => {
        fetchCars();
      });
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleChangeStatus = (value: any) => {
    // console.log(`selectedStatus ${value}`);
    setStatusCar(value);
  };

  const handleChangeClass = (value: any) => {
    // console.log(`selectedClass ${value}`);
    setclassCarsId(value);
  };
  const [orderItem, setorderItem] = useState<OrderRentItem[]>([]);

  //#endregion

  //#region Table

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
              dispatch(fetchCars());
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

  const expandedRowRender = (record: any) => {
    // console.log("Record", record);

    type ColumnType = {
      title: string;
      dataIndex: string;
      key: string;
      render?: (text: any, record: any) => JSX.Element;
    };

    let columns: ColumnType[] = [
      { title: "รายละเอียดรถ", dataIndex: "detailCar", key: "detailCar" },
      { title: "ราคา", dataIndex: "price", key: "price" },
    ];
    if (record.categoryCar == "สำหรับจองที่นั่ง") {
      columns = [
        {
          title: "จำนวนที่นั่ง",
          dataIndex: "quantitySeat",
          key: "quantitySeat",
        },
        { title: "ราคาต่อที่นั่ง", dataIndex: "priceSeat", key: "priceSeat" },
      ];
    }
    const data = [
      {
        key: record.carsId,
        detailCar: record.detailCar,
        price: record.prices,
        quantitySeat: record.quantitySeat,
        priceSeat: record.priceSeat,
        statusCar: record.statusCar,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 1300 }}
      />
    );
  };
  const columns: any = [
    {
      title: "หมายเลขป้ายทะเบียน",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
      ...getColumnSearchProps("carRegistrationNumber", "หมายเลขป้ายทะเบียน"),
    },
    {
      title: "ยี่ห้อรถ",
      dataIndex: "carBrand",
      key: "carBrand",
      ...getColumnSearchProps("carBrand", "ยี่ห้อรถ"),
    },
    {
      title: "รุ่นรถ",
      dataIndex: "carModel",
      key: "carModel",
      ...getColumnSearchProps("carModel", "รุ่นรถ"),
    },
    {
      title: "ประเภทรถ",
      dataIndex: "categoryCar",
      key: "categoryCar",
      filters: [
        {
          text: "สำหรับเช่า",
          value: "สำหรับเช่า",
        },
        {
          text: "สำหรับจองที่นั่ง",
          value: "สำหรับจองที่นั่ง",
        },
      ],
      width: 120,
      onFilter: (value: string, record: any) =>
        record.categoryCar.startsWith(value),
      filterSearch: true,
    },
    {
      title: "คลาสรถ",
      dataIndex: "classCarsName",
      key: "classCarsName",
      ...getColumnSearchProps("classCarsName", "คลาสรถ"),
    },
    {
      title: "เปิดใช้งาน",
      dataIndex: "isUse",
      key: "isUse",
      render: (record: boolean, text: any) => {
        const onChange = (checked: boolean) => {
          // console.log("เปลี่ยนแปลงแล้ว:", checked, "Record Key:", text.key);
          const Id = text.key;
          const isUse = checked;
          dispatch(updateIsUseCarsAsync({ Id, isUse }));
        };
        // console.log("record", record);

        return (
          <>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={onChange}
              defaultChecked={record}
            />
          </>
        );
      },
    },
    {
      title: "สถานะรถ",
      dataIndex: "statusCar",
      key: "statusCar",
      render: (record: any) => {
        // console.log("recordstatusCar", record);

        return (
          <>
            {record == "ว่าง" ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                {record}
              </Tag>
            ) : (
              <Tag icon={<CloseCircleOutlined />} color="error">
                {record}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: "แก้ไข",
      key: "operation",
      render: (_: any, record: any) => (
        <Button
          type="dashed"
          style={{ backgroundColor: "#faad14" }}
          onClick={() => handleEdit(record)}
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
          style={{ color: "whitesmoke", backgroundColor: "red" }}
          onClick={() => showDeleteConfirm(record)}
        >
          ลบ
        </Button>
      ),
    },
  ];
  const dataSource =
    cars &&
    cars.map((item: any) => {
      const {
        carsId,
        carBrand,
        carModel,
        classCars,
        quantitySeat,
        priceSeat,
        carRegistrationNumber,
        detailCar,
        statusCar,
        categoryCar,
        isUse,
        imageCars,
      } = item;

      const { className, classCarsId, price } = classCars;

      let statusText;

      switch (statusCar) {
        case 0:
          statusText = "ว่าง";
          break;
        case 1:
          statusText = "เช่าแล้ว";
          break;
        case 2:
          statusText = "รถออกจากสถานีแล้ว";
          break;
        case 3:
          statusText = "ที่นั่งเต็ม";
          break;
        default:
          statusText = "Unknown Status";
      }

      const formattedItem = {
        key: carsId,
        carsId,
        carBrand,
        carModel,
        categoryCar: categoryCar === 0 ? "สำหรับเช่า" : "สำหรับจองที่นั่ง",
        classCarsName: className,
        classCarsId,
        prices: price,
        quantitySeat,
        priceSeat,
        statusCar: statusText,
        carRegistrationNumber,
        detailCar,
        isUse,
        imageCars,
      };

      return formattedItem;
    });
  const [imgRemove, setImgRemove] = useState<any>([]);

  const handleRemoveImg = (img: any) => {
    setImgRemove([...imgRemove, img.uid]);
  };

  useEffect(() => {
    if (modals || isModalOpen) {
      if (dataEdit?.key != undefined) {
        const fromDataEdit = dataEdit?.imageCars.map((img: any) => ({
          uid: img.imageCarsId,
          name: img.image,
          status: "done",
          url: `${PathImage.image}${img.image}`,
        }));
        console.log("fromDataEdit", fromDataEdit);

        setFileList(fromDataEdit);
        form.setFieldsValue({
          carId: dataEdit?.key,
          detailCar: dataEdit?.detailCar,
          carsId: dataEdit?.carsId,
          carRegistrationNumber: dataEdit?.carRegistrationNumber,
          carModel: dataEdit?.carModel,
          carBrand: dataEdit?.carBrand,
          categoryCar: dataEdit?.categoryCar,
          classCarsId: dataEdit?.classCarsId,
          imageCars: dataEdit?.imageCars,
          quantitySeat: dataEdit?.quantitySeat,
          priceSeat: dataEdit?.priceSeat,
        });
        setclassCarsId(dataEdit?.classCarsId);
      } else {
        form.setFieldsValue({
          carId: 0,
          detailCar: null,
          carsId: null,
          carRegistrationNumber: null,
          carModel: null,
          carBrand: null,
          categoryCar: null,
          classCarsId: null,
          imageCars: null,
          quantitySeat: null,
          priceSeat: null,
        });
        setFileList([]);
        setclassCarsId(null);
      }
    }
    setImgRemove([]);
  }, [dataEdit, form, modals, isModalOpen]);

  console.log("imgRemove", imgRemove);

  // const SubmitButton = ({
  //   form,
  //   carsId,
  // }: {
  //   form: FormInstance;
  //   carsId: number;
  // }) => {
  //   const [submittable, setSubmittable] = React.useState(false);

  //   // Watch all values
  //   const values = Form.useWatch([], form);

  //   React.useEffect(() => {
  //     form.validateFields({ validateOnly: true }).then(
  //       () => {
  //         setSubmittable(true);
  //       },
  //       () => {
  //         setSubmittable(false);
  //       }
  //     );
  //   }, [values]);

  //   return (
  //     <Button
  //       type="primary"
  //       htmlType="submit"
  //       disabled={!submittable}
  //       onClick={() => updateCar(carsId)}
  //     >
  //       ตกลง
  //     </Button>
  //   );
  // };
  //#endregion
  // console.log("dataEdit", dataEdit);

  //#region createCars
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleChangecategory = (value: any) => {
    // console.log(`selectedClass ${value}`);
    setCategoryCar(value);
  };
  const handleCancel = () => {
    setDataEdit([]);
    setIsModalOpen(false);
    setModal(false);
  };
  const onFinishCreate = async ({
    carRegistrationNumber,
    carModel,
    carBrand,
    detailCar,
    categoryCar,
    quantitySeat,
    priceSeat,
  }: FieldValues) => {
    // console.log("categoryCar", categoryCar);
    // console.log("classCarsId", classCarsId);
    try {
      const CarDto = {
        carsId: 0,
        carRegistrationNumber: carRegistrationNumber,
        carModel: carModel,
        carBrand: carBrand,
        detailCar: detailCar,
        categoryCar: categoryCar,
        classCarsId: classCarsId?.key,
        imageCars: fileList,
        quantitySeat: quantitySeat == undefined ? 0 : quantitySeat,
        priceSeat: priceSeat == undefined ? 0 : priceSeat,
        isUse: true,
      };
      // console.log("CarDto", CarDto);

      await dispatch(createCarsAsync(CarDto)).then(async () => {
        await dispatch(fetchCars());
        setIsModalOpen(false);

        setFileList([]);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onFinishEdit = async ({
    carRegistrationNumber,
    carModel,
    carBrand,
    detailCar,
    categoryCar,
    quantitySeat,
    priceSeat,
  }: // key,
  FieldValues) => {
    // console.log("categoryCar", categoryCar);
    console.log("classCarsId", classCarsId);
    try {
      const CarDto = {
        carsId: dataEdit.key,
        carRegistrationNumber: carRegistrationNumber,
        carModel: carModel,
        carBrand: carBrand,
        detailCar: detailCar,
        categoryCar: categoryCar === "สำหรับเช่า" ? 0 : 1,
        classCarsId: classCarsId==null?classCarsId.key:classCarsId,
        imageCars: fileList,
        quantitySeat: quantitySeat == undefined ? 0 : quantitySeat,
        priceSeat: priceSeat == undefined ? 0 : priceSeat,
        isUse: true,
      };
      // console.log("CarDto", CarDto);
      await dispatch(createCarsAsync(CarDto)).then(async () => {
        imgRemove.map((img: any) =>
          agent.Cars.deleteImage(img).then(async () => {
            await dispatch(fetchCars());
          })
        );

        await dispatch(fetchCars());

        setModal(false);
        setDataEdit([]);
      });

      setImgRemove([]);
    } catch (error) {
      console.log(error);
    }
  };
  console.log("cars", cars);

  const onReset = () => {
    form.setFieldsValue({
      detailCar: null,
      carsId: null,
      carRegistrationNumber: null,
      carModel: null,
      carBrand: null,
      categoryCar: null,
      classCarsId: null,
      imageCars: null,
      quantitySeat: null,
      priceSeat: null,
    });
  };

  //#endregion

  //#region handleUpload

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

  // console.log("fileList", fileList);

  //#endregion

  useEffect(() => {
    dispatch(fetchCars());
    dispatch(fetchClassCars());
    agent.OrderRent.getOrderItem().then((order) => setorderItem(order));
  }, []);

  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={showModal}
        >
          เพิ่มรถ
        </Button>
      </Row>

      <Modal
        title="เพิ่มรถ "
        open={isModalOpen}
        footer={false}
        onCancel={handleCancel}
        width={1000}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinishCreate}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="carRegistrationNumber"
            label="หมายเลขป้ายทะเบียนรถ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carModel"
            label="รุ่นรถ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carBrand"
            label="แบรนด์รถ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="detailCar"
            label="รายละเอียดรถ"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryCar"
            label="ประเภทรถ"
            rules={[{ required: true }]}
          >
            <Select
              defaultValue="เลือกประเภทรถ"
              style={{ width: 200 }}
              onChange={handleChangecategory}
              size="large"
              options={[
                { value: 0, label: "สำหรับเช่า" },
                { value: 1, label: "สำหรับจองที่นั่ง" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="classCarsId"
            label="คลาสรถ"
            rules={[{ required: true }]}
          >
            <Select
              defaultValue="เลือกคลาส" // Set the value as an object with key
              style={{ width: 200 }}
              onChange={handleChangeClass} // Extract the key from the selected value
              size="large"
              options={
                classCars &&
                classCars.map((iclass: any) => ({
                  value: iclass.classCarsId,
                  label: iclass.className,
                }))
              }
              labelInValue // Enable labelInValue to work with an object value
            />
          </Form.Item>
          {categoryCar == 1 ? (
            <>
              <Form.Item
                name="quantitySeat"
                label="จำนวณที่นั่ง"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="priceSeat" label="ราคาต่อที่นั่ง">
                <InputNumber prefix="฿" style={{ width: "100%" }} />
              </Form.Item>
            </>
          ) : null}

          <Form.Item name="imageCars" label="รูปภาพรถ">
            <Upload
              action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
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
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              style={{ backgroundColor: "#1A4D2E" }}
              htmlType="submit"
            >
              ตกลง
            </Button>
            <Button htmlType="button" onClick={onReset}>
              ล้าง
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="แก้ไข"
        open={modals}
        footer={false}
        onCancel={handleCancel}
        width={1000}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinishEdit}
          style={{ maxWidth: 600 }}
        >
          {/* <Form.Item name="key" label="รหัสรถ" initialValue={dataEdit?.key}>
            <Input disabled />
          </Form.Item> */}
          <Form.Item
            name="carRegistrationNumber"
            label="หมายเลขป้ายทะเบียนรถ"
            initialValue={dataEdit?.carRegistrationNumber}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="carModel"
            label="รุ่นรถ"
            initialValue={dataEdit?.carModel}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="carBrand"
            label="แบรนด์รถ"
            initialValue={dataEdit?.carBrand}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="detailCar"
            label="รายละเอียดรถ"
            initialValue={dataEdit?.detailCar}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryCar"
            label="ประเภทรถ"
            initialValue={dataEdit?.categoryCar}
          >
            <Select
              defaultValue="เลือกประเภทรถ"
              style={{ width: 200 }}
              onChange={handleChangecategory}
              // value={dataEdit?.categoryCar}
              size="large"
              options={[
                { value: 0, label: "สำหรับเช่า" },
                { value: 1, label: "สำหรับจองที่นั่ง" },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="classCarsId"
            label="คลาสรถ"
            initialValue={dataEdit?.classCarsId}
          >
            <Select
              defaultValue="เลือกคลาส" // Set the value as an object with key
              style={{ width: 200 }}
              onChange={handleChangeClass} // Extract the key from the selected value
              size="large"
              options={
                classCars &&
                classCars.map((iclass: any) => ({
                  value: iclass.classCarsId,
                  label: iclass.className,
                }))
              }
              labelInValue // Enable labelInValue to work with an object value
            />
          </Form.Item>
          {dataEdit?.categoryCar == "สำหรับจองที่นั่ง" ? (
            <>
              <Form.Item
                name="quantitySeat"
                label="จำนวณที่นั่ง"
                initialValue={dataEdit?.quantitySeat}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="priceSeat"
                label="ราคาต่อที่นั่ง"
                initialValue={dataEdit?.priceSeat}
              >
                <InputNumber prefix="฿" style={{ width: "100%" }} />
              </Form.Item>
            </>
          ) : null}

          <Form.Item name="imageCars" label="รูปภาพรถ">
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
              <img alt="example" style={{ width: "100%" }} src={previewImage} />
            </Modal>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              style={{ backgroundColor: "#1A4D2E" }}
              htmlType="submit"
            >
              ตกลง
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        dataSource={dataSource}
        scroll={{ x: 1300 }}
      />

      {/* <Modal
        title="Edit Cars"
        centered
        open={modals}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          initialValues={{
            classCars: modals.classCarsId,
            statusCar: modals.statusCar,
          }}
          onFinish={(values) => {
            // Handle form submission here
            console.log(values);
            setModal(false);
          }}
        >
          <Form.Item
            name="classCars"
            label="คลาสรถ"
            rules={[{ required: true }]}
          >
            <Select
              defaultValue={modals.classCars} // Set the value as an object with key
              style={{ width: 200 }}
              onChange={handleChangeClass} // Extract the key from the selected value
              size="large"
              options={
                classCars &&
                classCars.map((iclass: any) => ({
                  value: iclass.classCarsId,
                  label: iclass.className,
                }))
              }
              labelInValue // Enable labelInValue to work with an object value
            />
          </Form.Item>

          <Form.Item
            name="statusCar"
            label="Status Car"
            rules={[{ required: true }]}
          >
            {modals.categoryCar === "สำหรับเช่า" ? (
              <Select
                value={{ key: statuscar }}
                defaultValue={{ key: modals.statusCar }}
                style={{ width: 200 }}
                onChange={(value) => handleChangeStatus(value)}
                size="large"
                options={[
                  { value: 0, label: "่ว่าง" },
                  { value: 1, label: "เช่าแล้ว" },
                ]}
              />
            ) : (
              <Select
                value={{ key: statuscar }}
                defaultValue={{ key: modals.statusCar }}
                style={{ width: 200 }}
                onChange={(value) => handleChangeStatus(value)}
                size="large"
                options={[
                  { value: 0, label: "ว่าง" },
                  { value: 2, label: "รถออกจากสถานีแล้ว" },
                  { value: 3, label: "ที่นั่งเต็มแล้ว" },
                ]}
              />
            )}
          </Form.Item>

          <Form.Item>
            <Space>
              <SubmitButton form={form} carsId={modals.carsId} />
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal> */}
    </>
  );
};
