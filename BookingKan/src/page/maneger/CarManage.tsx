import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  message,
  notification,
} from "antd";
import { Car, ClassCar } from "../../api/models/Cars";
import agent from "../../api/agent";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  createCarsAsync,
  updateClassCarAsync,
  updateStatusCarAsync,
} from "../../api/redux/Slice/CarsSlice";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { FieldValues } from "react-hook-form";
import { UploadImgs } from "./components/upload";
import { OrderRentItem } from "../../api/models/Order";
import { log } from "console";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const Cars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [Classcars, setClasscars] = useState<ClassCar[]>([]);
  const { confirm } = Modal;
  const [modals, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statuscar, setStatusCar] = useState("");
  const [categoryCar, setCategoryCar] = useState("");
  const [form] = Form.useForm();
  const [imageCar, setImageCars] = useState(null);
  const dispatch = useAppDispatch();

  //#region  editCars
  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "Are you sure to delete this car?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        agent.Cars.delete(record.key);
        message.success("Delete success!");
        window.location.reload();
        console.log("OK", record.key);
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
      );
      await dispatch(updateClassCarAsync({ ID: carsId, ClassID: Classcars }));
      // window.location.reload();
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleChangeStatus = (value: any) => {
    console.log(`selectedStatus ${value}`);
    setStatusCar(value);
  };

  const handleChangeClass = (value: any) => {
    console.log(`selectedClass ${value}`);
    setClasscars([value]);
  };
  const [orderItem, setorderItem] = useState<OrderRentItem[]>([]);

  // const updateStatusRent = async (carsId: number) => {
  //   const order = orderItem.find((order) => order.carsId == carsId);
  //   const currentDate = new Date();
  //   console.log("order", orderItem);

  //   if (
  //     order &&
  //     currentDate >= new Date(order.dateTimePickup) &&
  //     currentDate <= new Date(order.dateTimeReturn)
  //   ) {
  //     console.log("order", order);
  //     try {

  //     } catch (error) {
  //       console.error("Error updating status:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   // Iterate through all cars and update their status
  //   cars.forEach((car) => {
  //     agent.Cars.updateStatusRent(car.carsId);
  //   });
  // }, [cars]);

  console.log("modal", modals);
  //#endregion

  //#region Table
  const expandedRowRender = (record: Car) => {
    console.log("Record", record);

    let columns = [
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

    columns.push({
      title: "สถานรถ",
      dataIndex: "statusCar",
      key: "statusCar",
      render: () => record.statusCar == "ว่าง" ? (<Badge status="success" text={record.statusCar} />):<Badge status="error" text={record.statusCar} /> ,
    });

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

    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  const columns = [
    // { title: "carsId", dataIndex: "carsId", key: "carsId", width: 100 },
    {
      title: "หมายเลขป้ายทะเบียน",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
    },
    { title: "ยี่ห้อรถ", dataIndex: "carBrand", key: "carBrand" },
    { title: "รุ่นรถ", dataIndex: "carModel", key: "carModel" },
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
    },
    {
      title: "แก้ไข",
      key: "operation",
      render: (text: any, record: any) => (
        <Button type="dashed" onClick={() => setModal(record)}>
          แก้ไข
        </Button>
      ),
      width: 100,
    },
    {
      title: "ลบ",
      key: "operation",
      render: (text: any, record: any) => (
        <Button
          style={{ color: "whitesmoke", backgroundColor: "red" }}
          onClick={() => showDeleteConfirm(record)}
        >
          ลบ
        </Button>
      ),
      width: 100,
    },
  ];
  const dataSource = cars.map((item) => {
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
    };

    return formattedItem;
  });
  const SubmitButton = ({
    form,
    carsId,
  }: {
    form: FormInstance;
    carsId: number;
  }) => {
    const [submittable, setSubmittable] = React.useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    React.useEffect(() => {
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
        onClick={() => updateCar(carsId)}
      >
        Submit
      </Button>
    );
  };
  //#endregion

  //#region createCars
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleChangecategory = (value: any) => {
    console.log(`selectedClass ${value}`);
    setCategoryCar([value]);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = ({
    carRegistrationNumber,
    carModel,
    carBrand,
    detailCar,
    categoryCar,
    statusCar,
    Classcars,
    imageCar,
    quantitySeat,
    priceSeat,
  }: FieldValues) => {
    try {
      // dispatch(
      //   createCarsAsync({
      //     carRegistrationNumber,
      //     carModel,
      //     carBrand,
      //     detailCar,
      //     categoryCar,
      //     statusCar,
      //     Classcars,
      //     imageCar,
      //     quantitySeat,
      //     priceSeat,
      //   })
      // );
      console.log({
        carRegistrationNumber,
        carModel,
        carBrand,
        detailCar,
        categoryCar,
        statusCar,
        Classcars,
        imageCar,
        quantitySeat,
        priceSeat,
      });
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const onReset = () => {
    form.resetFields();
  };
  //#endregion

  useEffect(() => {
    agent.Cars.getCars().then((car) => setCars(car));
    agent.Cars.getClass().then((classcar) => setClasscars(classcar));
    agent.OrderRent.getOrderItem().then((order) => setorderItem(order));
  }, []);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Creat Cars
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1000}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="carRegistrationNumber"
            label="carRegistrationNumber"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carModel"
            label="carModel"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="carBrand"
            label="carBrand"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="detailCar"
            label="detailCar"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryCar"
            label="categoryCar"
            rules={[{ required: true }]}
          >
            <Select
              value={{ key: categoryCar }}
              style={{ width: 200 }}
              onChange={handleChangecategory}
              size="large"
              options={[
                { value: 0, label: "For Rent" },
                { value: 1, label: "For Booking" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="classCarsId"
            label="classCarsId"
            rules={[{ required: true }]}
          >
            <Select
              value={{ key: Classcars }} // Set the value as an object with key
              style={{ width: 200 }}
              onChange={handleChangeClass} // Extract the key from the selected value
              size="large"
              options={Classcars.map((iclass) => ({
                value: iclass.classCarsId,
                label: iclass.className,
              }))}
              labelInValue // Enable labelInValue to work with an object value
            />
          </Form.Item>
          <Form.Item
            name="statusCar"
            label="statusCar"
            rules={[{ required: true }]}
          >
            <Select
              value={{ key: statuscar }}
              style={{ width: 200 }}
              onChange={handleChangeStatus}
              size="large"
              options={[
                { value: 0, label: "Empty" },
                { value: 1, label: "Rented" },
                { value: 2, label: "Has Left The Station" },
                { value: 3, label: "Seats Are Full" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="quantitySeat"
            label="quantitySeat"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="priceSeat"
            label="priceSeat"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} defaultValue={3} />
          </Form.Item>
          <Form.Item
            name="imageCars"
            label="imageCars"
            rules={[{ required: true }]}
          >
           
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
      </Modal>

      <Table
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        dataSource={dataSource}
      />
      {modals && (
        <Modal
          title="Edit Cars"
          centered
          visible={modals}
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
              label="Class Cars"
              rules={[{ required: true }]}
            >
              <Select
                value={{ key: Classcars }} // Set the value as an object with key
                style={{ width: 200 }}
                defaultValue={{ key: modals.classCars }} // Set the initial selected value
                onChange={(value) =>
                  handleChangeClass(value.key, modals.carsId)
                } // Extract the key from the selected value
                size="large"
                options={Classcars.map((iclass) => ({
                  value: iclass.classCarsId,
                  label: iclass.className,
                }))}
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
                  onChange={(value) => handleChangeStatus(value, modals.carsId)}
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
                  onChange={(value) => handleChangeStatus(value, modals.carsId)}
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
        </Modal>
      )}
    </>
  );
};
