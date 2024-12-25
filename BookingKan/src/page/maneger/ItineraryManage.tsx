import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { Itinerary } from "../../api/models/Itinerary";
import {
  Badge,
  Button,
  ConfigProvider,
  Dropdown,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TableColumnsType,
  TimePicker,
  TimePickerProps,
  message,
  notification,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  DownOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import Highlighter from "react-highlight-words";
import agent from "../../api/agent";
import moment from "moment";
import {
  createItineraryAsync,
  deleteItinararyById,
  fetchItinarery,
  updateIsUseItinararyAsync,
} from "../../api/redux/Slice/ItinerarySlice";
import { FieldValues } from "react-hook-form";
import { fetchCars, fetchClassCars } from "../../api/redux/Slice/CarsSlice";
import { fetchRouteCars } from "../../api/redux/Slice/RouteCarSlice";
import { Car } from "../../api/models/Cars";
import { RouteCar } from "../../api/models/RouetCar";
import { timeLog, trace } from "console";
import dayjs from "dayjs";
import "dayjs/locale/th";
import locale from "antd/lib/locale/th_TH";

export const Itinerarys = () => {
  const cars = useAppSelector((t) => t.cars.cars);
  const itinerary = useAppSelector((t) => t.itinerary.itinerary);
  const routeCars = useAppSelector((t) => t.routes.routeCars);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  const [modalData, setModalData] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>([]);
  const [carId, setCarId] = useState(null);
  const [routeId, setRouteId] = useState(null);
  const [issueTime, setIssueTime] = useState<any>(null);
  const [arrivalTime, setArrivalTime] = useState<any>(null);
  useEffect(() => {
    dispatch(fetchItinarery());
    dispatch(fetchCars());
    dispatch(fetchRouteCars());
  }, [dispatch]);

  //#region  creat/edit

  const onChangeIssueTime = (time: any) => {
    setIssueTime(time);
  };

  const onChangeArrivalTime = (time: any) => {
    setArrivalTime(time);
  };

  const handleEdit = (data: any) => {
    setModalData(true);
    setDataEdit(data);
    console.log("data", data);
  };

  const onCancleModal = () => {
    setModalData(false);
    setDataEdit([]);
  };

  const onFinish = async () => {

    try {
      const id = dataEdit?.key ?? 0;
      const ItinararyDto: any = {
        itineraryId: id,
        issueTime: issueTime,
        arrivalTime: arrivalTime,
        routeCarsId: routeId,
        carsId: carId,
      };
      console.log("ItinararyDto", ItinararyDto);

      await dispatch(createItineraryAsync(ItinararyDto)).then(async () => {
        await dispatch(fetchItinarery());
        setModalData(false);
        setDataEdit([]);
        form.resetFields();
      });
    } catch (error) {
      console.log(error);
    }
  };
  console.log("modalData", modalData);

  useEffect(() => {
    if (modalData) {
      if (dataEdit?.key === undefined) {
        form.setFieldsValue({
          itineraryId: null,
          issueTime: null,
          arrivalTime: null,
          routeCarsId: null,
          carsId: null,
        });
        setCarId(null);
        setRouteId(null);
        setArrivalTime(null);
        setIssueTime(null);
      } else {
        form.setFieldsValue({
          issueTime: dataEdit?.issueTime,
          arrivalTime: dataEdit?.arrivalTime,
          routeCarsId: dataEdit?.routeCarsId,
          carsId: dataEdit?.carsId,
        });
        setCarId(dataEdit?.carsId);
        setRouteId(dataEdit?.routeCarsId);
        setArrivalTime(dataEdit?.arrivalTimeRaw);
        setIssueTime(dataEdit?.issueTimeRaw);
      }
    }
  }, [dataEdit, form, modalData]);
  //#endregion

  //#region  delete
  const { confirm } = Modal;
  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการลบรอบการเดินทางนี้?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบให้แน่ใจว่าต้องการลบรอบการเดินทางนี้",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่ ขอบคุณ",
      onOk() {
        try {
          dispatch(deleteItinararyById(record.key)).then(async () => {
            await dispatch(fetchItinarery());
          });
        } catch (error) {
          console.log("error", error);
        }
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  //#endregion

  //#region  table
  const expandedRowRender = (record: any) => {
    const columns: any = [
      {
        title: "เวลาที่ออกเดินทาง",
        dataIndex: "arrivalTime",
        key: "arrivalTime",
        width: "30%",
        // ...getColumnSearchProps("arrivalTime", "เวลาที่ออกเดินทาง"),
      },
      {
        title: "เวลาที่ไปถึง",
        dataIndex: "issueTime",
        key: "issueTime",
        width: "20%",
        // ...getColumnSearchProps("issueTime", "เวลาที่ไปถึง"),
      },
      {
        title: "จำนวณที่นั่ง",
        dataIndex: "quantitySeat",
        key: "quantitySeat",
        width: "30%",
      },
    ];

    const dataexpan = [
      {
        key: record.key,
        carRegistrationNumber: record.carRegistrationNumber,
        priceSeat: record.priceSeat,
        quantitySeat: record.quantitySeat,
        arrivalTime: record.arrivalTime,
        issueTime: record.issueTime,
        originName: record.originName,
        destinationName: record.destinationName,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={dataexpan}
        pagination={false}
        scroll={{ x: 1300 }}
      />
    );
  };

  const columns = [
    {
      title: "สถานีต้นทาง",
      dataIndex: "originName",
      key: "originName",
      // ...getColumnSearchProps("originName", "สถานีต้นทาง"),
    },
    {
      title: "สถานีปลายทาง",
      dataIndex: "destinationName",
      key: "destinationName",
      // ...getColumnSearchProps("destinationName", "สถานีปลายทาง"),
    },
    {
      title: "หมายเลขทะเบียนรถ",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
      // ...getColumnSearchProps("carRegistrationNumber", "หมายเลขทะเบียนรถ"),
    },
    {
      title: "ราคาต่อที่นั่ง",
      dataIndex: "priceSeat",
      key: "priceSeat",
      sorter: (a: any, b: any) => a.priceSeat - b.priceSeat,
    },
    {
      title: "เปิดใช้งาน",
      dataIndex: "isUse",
      key: "isUse",
      render: (record: any, text: any) => {
        const onChange = (checked: any) => {
          const Id = text.key;
          const isUse = checked;
          dispatch(updateIsUseItinararyAsync({ Id, isUse })).then(() => {
            dispatch(fetchItinarery());
          });
        };

        return (
          <Switch
            checkedChildren={<CheckOutlined />}
            unCheckedChildren={<CloseOutlined />}
            onChange={onChange}
            defaultChecked={record}
          />
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
      width: "10%",
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
      width: "10%",
    },
  ];

  const data = itinerary.map((item: Itinerary) => {
    const dateArrival = dayjs(item.arrivalTime).format("h:mm A");
    const dateIssue = dayjs(item.issueTime).format("h:mm A");

    return {
      key: item.itineraryId,
      carRegistrationNumber: item.cars.carRegistrationNumber,
      priceSeat: item.cars.priceSeat,
      quantitySeat: item.cars.quantitySeat,
      arrivalTime: dateArrival,
      issueTime: dateIssue,
      arrivalTimeRaw: item.arrivalTime,
      issueTimeRaw: item.issueTime,
      originName: item.routeCars.originName,
      destinationName: item.routeCars.destinationName,
      isUse: item.isUse,
      routeCarsId: item.routeCars.routeCarsId,
      carsId: item.cars.carsId,
    };
  });
  //#endregion
  console.log("dataEdit?.carsId", dataEdit?.carsId);

  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={() => setModalData(true)}
        >
          สร้างรอบการเดินรถ
        </Button>
      </Row>
      <Table
        scroll={{ x: 1300 }}
        columns={columns}
        dataSource={data}
        expandable={{ expandedRowRender }}
      />

      <Modal open={modalData} onCancel={onCancleModal} centered footer={null}>
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            name="issueTime"
            label="เวลาที่ออกเดินทาง"
            initialValue={dataEdit?.issueTime}
          >
            <ConfigProvider locale={locale}>
              <TimePicker format={"HH:mm"} onChange={onChangeIssueTime} />
            </ConfigProvider>
          </Form.Item>

          <Form.Item
            name="arrivalTime"
            label="เวลาที่ไปถึง"
            initialValue={dataEdit?.arrivalTime}
          >
            <ConfigProvider locale={locale}>
              <TimePicker format={"HH:mm"} onChange={onChangeArrivalTime} />
            </ConfigProvider>
          </Form.Item>

          <Form.Item
            name="routeCarsId"
            label="เส้นทางการเดินรถ"
            initialValue={dataEdit?.routeCarsId}
          >
            <Select
              placeholder="เลือกเส้นทางการเดินรถ"
              onChange={(value: any) => setRouteId(value)}
              options={
                routeCars &&
                routeCars.map((route: RouteCar) => ({
                  value: route.routeCarsId,
                  label: `${route.originName}-${route.destinationName}`,
                }))
              }
            />
          </Form.Item>
          <Form.Item name="carsId" label="รถ" initialValue={dataEdit?.carsId}>
            <Select
              placeholder="เลือกรถ"
              onChange={(value: any) => {
                console.log("value", value);
                setCarId(value);
              }}
              options={
                cars &&
                cars
                  .filter((car: Car) => car.categoryCar === 1)
                  .map((car: Car) => ({
                    value: car.carsId,
                    label: car.carRegistrationNumber,
                  }))
              }
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                บันทึก
              </Button>
              <Button htmlType="reset">ล้าง</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
