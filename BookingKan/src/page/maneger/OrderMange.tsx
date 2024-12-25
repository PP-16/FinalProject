import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Divider,
  Modal,
  Table,
  Image,
  Typography,
  Row,
  Col,
  Tag,
  message,
  Upload,
  notification,
  UploadProps,
  Space,
  Input,
  InputRef,
} from "antd";
import { OrderRent } from "../../api/models/Order";
import agent from "../../api/agent";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import { updateStatusCarAsync } from "../../api/redux/Slice/CarsSlice";
import {
  confirmReturnCarOrderAsync,
  fetchOrder,
  fetchOrderItem,
  fetchOrderPast,
  updateStatusOrderAsync,
} from "../../api/redux/Slice/OrderRentSlice";
import moment from "moment";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { createPaymentAsync } from "../../api/redux/Slice/PaymentSlice";
import { useElements, useStripe } from "@stripe/react-stripe-js";
import { OrderPastPaymentPage } from "../details/OrderPastPaymentPage";
import { PathImage } from "../../routers/PathImage";
import html2pdf from "html2pdf.js";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import Item from "antd/es/list/Item";

export const OrderMange = () => {
  const [modalsDetails, setModalDetails] = useState(false);
  const [detailsOrder, setDetails] = useState<any>([]);
  const [paymentmethod, setPaymentmethod] = useState<any>(0);
  const [modalSlipe, setModalSlipe] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageSlipeUrl, setImageSlipeUrl] = useState<string>();
  const [modalStripe, setModalStripe] = useState(false);

  const [paymodal, setPaymodal] = useState(false);
  const [orderRentId, setOrderRentId] = useState(Number);

  const dispatch = useAppDispatch();
  const { confirm } = Modal;
  const system = useAppSelector((t) => t.system.system);
  const orders = useAppSelector((t) => t.order.orders);
  const orderItems = useAppSelector((t) => t.order.orderItem);
  const orderPast = useAppSelector((t) => t.order.orderPastList);
  // console.log("orders", orders);
  console.log("orderPast", orderPast);

  useEffect(() => {
    dispatch(fetchOrder());
    dispatch(fetchOrderItem());
    // agent.OrderRent.checkOrderPast();
    dispatch(fetchOrderPast());
  }, []);

  useEffect(() => {
    orderItems.forEach(async (item: any) => {
      if (
        item.orderRentItem &&
        item.orderRentItem.orderRentId === item.orderRentId &&
        item.orderStatus !== 5 &&
        !item.confirmReturn &&
        moment(item.dateTimeReturn).isBefore(moment())
      ) {
        await dispatch(
          updateStatusOrderAsync({
            ID: item.orderRentId,
            Status: 5,
          })
        );
      }
    });
  }, [orderItems]);
  // const handleStatusOverDue = async(record: any)=>{

  // const currentDate = moment.now

  //   const ID = record.orderRentId;
  //   await dispatch(confirmReturnCarOrderAsync({ ID: ID }));

  // }ผ

  const handleConfirmReturn = async (record: any) => {
    const ID = record.orderRentId;
    const confirm = true;
    const carsId = record.carsId;
    const statuscar = "0";
    const driverId = record.driverId;
    const statusDriver = 0;
    await dispatch(confirmReturnCarOrderAsync({ ID: ID })).then(async () => {
      await dispatch(
        updateStatusCarAsync({ ID: carsId, statusCar: statuscar })
      );
      await agent.Drivers.updateStatusDriver(driverId, statusDriver);
      await dispatch(fetchOrder());
      await agent.Cars.getCarForRents();
    });
    await dispatch(fetchOrder());
    // console.log("driverId", driverId);
  };

  const handleModalDetails = (details: any) => {
    setModalDetails(true);
    setDetails(details);
  };
  // console.log("details", detailsOrder);
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
  const columns = [
    {
      title: "ชื่อผู้เช่า",
      dataIndex: "passengerName",
      key: "passengerName",
      ...getColumnSearchProps("passengerName", "ชื่อผู้เช่า"),
    },
    {
      title: "หมายเลขโทรศัพท์ผู้เช่า",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone", "หมายเลขโทรศัพท์ผู้เช่า"),
    },
    {
      title: "หมายเลขบัตรประจำตัวประชาชนผู้เช่า",
      dataIndex: "idCardNumber",
      key: "idCardNumber",
      ...getColumnSearchProps(
        "idCardNumber",
        "หมายเลขบัตรประจำตัวประชาชนผู้เช่า"
      ),
    },
    {
      title: "หมายเลขทะเบียนรถ",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
      ...getColumnSearchProps("carRegistrationNumber", "หมายเลขทะเบียนรถ"),
    },

    {
      title: "ชื่อคนขับ",
      dataIndex: "driverName",
      key: "driverName",
      ...getColumnSearchProps("driverName", "ชื่อคนขับ"),
    },
    {
      title: "สถานะ",
      dataIndex: "statusText",
      key: "statusText",
      filters: [
        {
          text: "ต้องชำระ",
          value: "ต้องชำระ",
        },
        {
          text: "กำลังดำเนินการ",
          value: "กำลังดำเนินการ",
        },
        {
          text: "จ่ายเงินสำเร็จ",
          value: "จ่ายเงินสำเร็จ",
        },
        {
          text: "ยกเลิก",
          value: "ยกเลิก",
        },
        {
          text: "คืนเงินสำเร็จ",
          value: "คืนเงินสำเร็จ",
        },
        {
          text: "เลยกำหนดคืนรถ",
          value: "เลยกำหนดคืนรถ",
        },
      ],
      width: 120,
      onFilter: (value: string, record: any) =>
        record.statusText.startsWith(value),
      filterSearch: true,
      render: (dataIndex: any, record: any) => {
        // console.log("record", record.orderSatus);
        const isPaied = record.orderSatus == 2;
        const isOverDue = record.orderSatus == 5;
        const isOverDueButRetruned =
          record.orderSatus == 5 && record.confirmReturn == true;
        return (
          <>
            {isPaied ? (
              <Tag icon={<CheckCircleOutlined />} color="success">
                {dataIndex}
              </Tag>
            ) : isOverDueButRetruned ? (
              <Tag icon={<ExclamationCircleOutlined />} color="warning">
                {dataIndex}
              </Tag>
            ) : isOverDue ? (
              <Tag icon={<CloseCircleOutlined />} color="error">
                {dataIndex}
              </Tag>
            ) : (
              <Tag icon={<SyncOutlined spin />} color="processing">
                {dataIndex}
              </Tag>
            )}
          </>
        );
      },
    },
    {
      title: "ยืนยันการคืนรถ",
      key: "confirmReturn",
      dataIndex: "confirmReturn",
      render: (_: any, record: any) => {
        const PastDue = record.orderSatus == 5 && record.confirmReturn == false;
        const isconfirm = record.confirmReturn == true;
        const dateNow = moment().format();
        // console.log("dateNow", dateNow);
        const inrented = dateNow >= record.dateTimeReturn;
        return (
          <Button
            disabled={isconfirm}
            type="dashed"
            onClick={() => handleConfirmReturn(record)}
          >
            {isconfirm ? "ยืนยันแล้ว" : "ยืนยัน"}
          </Button>
        );
      },
    },
    {
      title: "รายละเอียด",
      render: (_: any, record: any) => {
        return (
          <Button type="dashed" onClick={() => handleModalDetails(record)}>
            รายละเอียด
          </Button>
        );
      },
    },
  ];
  const dataSource = orders.map((item: any) => {
    const {
      orderRentId,
      paymentDate,
      passengerId,
      passenger,
      orderSatus,
      orderRentItems,
      confirmReturn,
    } = item;

    const {
      cars,
      carsId,
      dateTimePickup,
      dateTimeReturn,
      driver,
      driverId,
      orderRentItemId,
      placePickup,
      placeReturn,
      quantity,
      carsPrice,
    } =
      orderItems.find(
        (orderItems: any) => orderItems.orderRentId === item.orderRentId
      ) || {};

    const { email, idCardNumber, passengerName, phone, imagePassenger } =
      passenger || {};
    const { carBrand, carModel, carRegistrationNumber, classCars } = cars || {};
    const { className, classCarsId, price } = classCars || {};
    const { driverName, charges } = driver || {};

    let statusText;

    switch (orderSatus) {
      case 0:
        statusText = "ต้องชำระ";
        break;
      case 1:
        statusText = "กำลังดำเนินการ";
        break;
      case 2:
        statusText = "จ่ายเงินสำเร็จ";
        break;
      case 3:
        statusText = "ยกเลิก";
        break;
      case 4:
        statusText = "คืนเงินสำเร็จ";
        break;
      case 5:
        statusText = "เลยกำหนดคืนรถ";
        break;
      default:
        statusText = "Unknown Status";
    }

    const formattedItem = {
      key: orderRentId,
      carsId,
      dateTimePickup,
      dateTimeReturn,
      driverId,
      driverName,
      carsPrice, // เพิ่ม carsPrice เข้าไปใน object formattedItem เนื่องจากเป็นค่าที่ส่งกลับมาจาก backend
      orderRentItemId,
      placePickup,
      placeReturn,
      quantity,
      orderRentId,
      orderSatus,
      imagePassenger,
      paymentDate,
      passengerId,
      phone,
      email,
      idCardNumber,
      passengerName,
      carBrand,
      carModel,
      carRegistrationNumber,
      className,
      classCarsId,
      price,
      statusText,
      charges,
      confirmReturn,
    };

    return formattedItem;
  });
  const imageUser = PathImage.imageUser + detailsOrder.imagePassenger;

  const generatePDF = () => {
    const element = document.getElementById("html-elementOrder-id-to-pdf"); // เปลี่ยน 'your-html-element-id' เป็น ID ขององค์ประกอบ HTML ที่คุณต้องการแปลงเป็น PDF
    html2pdf()
      .from(element)
      .save(detailsOrder.orderRentId + ".pdf");
  };

  console.log(
    "test" + detailsOrder.orderRentId,
    orderPast.find((past: any) => past.orderRentId === detailsOrder.orderRentId)
      ?.paied
  );

  // console.log(
  //   "Hahhahahahahah" + detailsOrder.orderRentId,
  //   detailsOrder.confirmReturn === false
  // );

  return (
    <>
      {paymodal == true && (
        <OrderPastPaymentPage
          orderRentId={detailsOrder.orderRentId}
          visible={paymodal}
          cancel={setPaymodal}
        />
      )}

      <Modal
        open={modalsDetails}
        onCancel={() => setModalDetails(false)}
        footer={
          (detailsOrder.orderSatus !== 0 && detailsOrder.orderSatus !== 5) ||
          detailsOrder.confirmReturn ? (
            <Row>
              <Button
                type="primary"
                onClick={generatePDF}
                style={{ margin: 10 }}
              >
                พิมพ์รายละเอียดการเช่ารถ
              </Button>
            </Row>
          ) : null
        }
        width={1000}
        wrapClassName="vertical-center-modal"
      >
        <div id="html-elementOrder-id-to-pdf">
          <Card
            headStyle={{ backgroundColor: "#4F6F52" }}
            title={
              <>
                <Row>
                  {system.map((i) => {
                    const imgLogo = PathImage.logo + i.logo;
                    return (
                      <>
                        <Avatar
                          size="large"
                          shape="square"
                          src={<img src={imgLogo} alt="avatar" />}
                        />
                        <Typography
                          style={{
                            fontSize: "25px",
                            color: "#fff",
                            textAlign: "center",
                          }}
                        >
                          {i.nameWeb}
                        </Typography>
                      </>
                    );
                  })}
                </Row>
              </>
            }
          >
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
              style={{ margin: 10 }}
            >
              <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                <>
                  {orderItems
                    .filter(
                      (item: any) =>
                        item.orderRentId === detailsOrder.orderRentId
                    )
                    .map((item: any, index: number, array: any[]) => {
                      return (
                        <>
                          <Descriptions title="รายละเอียดการเช่า">
                            <Descriptions.Item label="หมายเลขทะเบียนรถ">
                              {item.cars.carRegistrationNumber}
                            </Descriptions.Item>
                            <Descriptions.Item label="ราคาค่าเช่าต่อวัน">
                              {item.carsPrice}
                            </Descriptions.Item>
                            <Descriptions.Item label="วันที่รับรถ">
                              {moment(item.dateTimePickup).format("Do MMM YY")}
                            </Descriptions.Item>
                            <Descriptions.Item label="วันที่คืนรถ">
                              {moment(item.dateTimeReturn).format("Do MMM YY")}
                            </Descriptions.Item>
                            <Descriptions.Item label="ชื่อคนขับรถ">
                              {item.driver.driverName}
                            </Descriptions.Item>
                            <Descriptions.Item label="ค่าแรงต่อวัน">
                              {item.driver.charges}
                            </Descriptions.Item>
                          </Descriptions>
                          {index !== array.length - 1 && (
                            <div style={{ flex: 1 }}>
                              <Divider />
                            </div>
                          )}
                        </>
                      );
                    })}
                  {!orderPast.find(
                    (past: any) => past.orderRentId === detailsOrder.orderRentId
                  )?.paied &&
                    !detailsOrder.confirmReturn && (
                      <Row>
                        <Button
                          block
                          type="primary"
                          onClick={() => setPaymodal(true)}
                        >
                          ชำระเงิน
                        </Button>
                      </Row>
                    )}
                </>
              </Col>
              <Divider />
              <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                  <Descriptions title="รายละเอียดผู้เช่า">
                    <Descriptions.Item label="ชื่อผู้เช่า">
                      {detailsOrder.passengerName}
                    </Descriptions.Item>
                    <Descriptions.Item label="เบอร์โทรศัพท์ผู้เช่า">
                      {detailsOrder.phone}
                    </Descriptions.Item>
                    <Descriptions.Item>
                      <></>
                    </Descriptions.Item>
                    <Descriptions.Item label="อีเมล์ติดต่อผู้เช่า">
                      {detailsOrder.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="หมายเลขบัตรประจำตัวประชาชน">
                      {detailsOrder.idCardNumber}
                    </Descriptions.Item>
                  </Descriptions>
                </Col>
                {/* </Row> */}
              </Col>
            </Row>
          </Card>
        </div>
      </Modal>

      <Table
        columns={columns}
        // expandable={{ expandedRowRender }}
        dataSource={dataSource}
        scroll={{ x: 1300 }}
      />
    </>
  );
};
