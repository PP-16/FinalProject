import { useEffect, useRef, useState } from "react";
import { Booking } from "../../api/models/Booking";
import agent from "../../api/agent";
import {
  Badge,
  Button,
  Col,
  Input,
  InputRef,
  Modal,
  Popconfirm,
  Row,
  Space,
  Switch,
  Table,
  Tag,
  Tooltip,
  notification,
} from "antd";
import {
  useAppDispatch,
  useAppSelector,
} from "../../api/redux/Store/configureStore";
import {
  CheckCircleOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import {
  CheckInBookingAsync,
  fetchBooking,
  fetchBookingById,
  updateStatusBookingAsync,
} from "../../api/redux/Slice/BookingSlice";
import moment from "moment";
import { createRefundPaymentAsync } from "../../api/redux/Slice/PaymentSlice";
import html2pdf from "html2pdf.js";
import { BookingDetalisModal } from "./components/BookingDetalisModal";
import { fetchItinarery } from "../../api/redux/Slice/ItinerarySlice";
import { PDFBookingByItinerarys } from "./components/PDFBookingByItinerarys";
import { FilterDropdownProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { NavLink } from "react-router-dom";
import { PathPrivateRouter } from "../../routers/PathAllRoute";

export const BookingManage = () => {
  // const [booking, setBooking] = useState<Booking[]>([]);
  const [modals, setModal] = useState(false);
  const { confirm } = Modal;
  const [statuscar, setStatusCar] = useState("");
  const [switchButt, setswitchButt] = useState(false);
  const [modalDetails, setModalDetails] = useState(false);
  const [dataDetails, setdataDetails] = useState<any>();
  const itinerarys = useAppSelector((t) => t.itinerary.itinerary);
  const booking = useAppSelector((t) => t.booking.bookings);
  const [modalSelect, setmodalSelect] = useState(false);
  const [userDetail, setUser] = useState<any>([]);
  const user = useAppSelector((t) => t.account.user);

  const [bookingId, setBookingId] = useState<any>();

  const dispatch = useAppDispatch();

  // console.log("userDetail", userDetail);

  const handelDetails = (data: any) => {
    setModalDetails(true);
    setdataDetails(data);
  };
  useEffect(() => {
    agent.Account.getUser(user?.token).then((user) => setUser(user));
    dispatch(fetchBooking());

    dispatch(fetchItinarery());

    getQueryString();
  }, []);

  const getQueryString = async() => {
    const params = new URLSearchParams(location.search);

    const bookingId = params.get("bookingId");
    const details = params.get("details");

    setBookingId(Number(bookingId));
    setModalDetails(String(details).toLowerCase() === "true");
   await dispatch(fetchBookingById(Number(bookingId)));
  };

  const generatePDF = () => {
    const element = document.getElementById("html-element-id-to-pdf"); // เปลี่ยน 'your-html-element-id' เป็น ID ขององค์ประกอบ HTML ที่คุณต้องการแปลงเป็น PDF
    html2pdf()
      .from(element)
      .save(dataDetails?.key + ".pdf");
  };
  // console.log("booking", booking);

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
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passengerName",
      key: "passengerName",
      ...getColumnSearchProps("passengerName", "ชื่อผู้โดยสาร"),
    },
    {
      title: "หมายเลขทะเบียนรถ",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
      ...getColumnSearchProps("carRegistrationNumber", "หมายเลขทะเบียนรถ"),
    },
    {
      title: "หมายเลขที่นั่ง",
      dataIndex: "seatsSerialized",
      key: "seatsSerialized",
      ...getColumnSearchProps("seatsSerialized", "หมายเลขที่นั่ง"),
    },

    {
      title: "ราคารวม",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a: any, b: any) => a.totalPrice - b.totalPrice,
    },
    {
      title: "วันที่เดินทาง",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
      key: "note",
      ...getColumnSearchProps("note", "หมายเหตุ"),
    },
    {
      title: "สถานะ",
      dataIndex: "statusText",
      key: "statusText",
      filters: [
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
          text: "คืนเงินแล้ว",
          value: "คืนเงินแล้ว",
        },
      ],
      onFilter: (value: string, record: any) =>
        record.statusText.startsWith(value),
      filterSearch: true,
      render: (dataIndex: any, id: any) => {
        // console.log("dataIndex", id);
        const isPaied = id.bookingStatus == 2;
        const iscancle = id.bookingStatus == 3;
        const isrefund = id.bookingStatus == 4;
        const isNotPaied = id.bookingStatus == 0;
        return isNotPaied ? (
          <Badge status="warning" text={dataIndex} />
        ) : isPaied ? (
          <Badge status="success" text={dataIndex} />
        ) : iscancle ? (
          <Badge status="error" text={dataIndex} />
        ) : (
          <Badge status="default" text={dataIndex} />
        );
      },
    },
    {
      title: "ยืนยันการเดินทาง",
      key: "checkIn",
      dataIndex: "checkIn",
      filters: [
        {
          text: "ยืนยันแล้ว",
          value: true,
        },
        {
          text: "ยังไม่ได้ยืนยัน",
          value: false,
        },
        {
          text: "ยกเลิก",
          value: "ยกเลิก",
        },
        {
          text: "คืนเงินแล้ว",
          value: "คืนเงินแล้ว",
        },
      ],
      onFilter: (value: string | boolean, record: any) => {
        if (value === true || value === false) {
          return record.checkIn === value;
        } else if (value === "ยกเลิก") {
          return record.bookingStatus === 3; // assuming 3 represents canceled status
        } else if (value === "คืนเงินแล้ว") {
          return record.bookingStatus === 4; // assuming 4 represents refunded status
        }
        return false;
      },
      filterSearch: true,
      // fixed: "right",
      render: (record: boolean, data: any) => {
        const Id = data.key;
        const onChange = (checked: boolean) => {
          // console.log("เปลี่ยนแปลงแล้ว:", checked, "Record Key:", data.key);
          const checkIn = checked;
          dispatch(CheckInBookingAsync({ Id, checkIn })).then(() =>
            dispatch(fetchBooking())
          );
        };
        const cancelCheckin = () => {
          // message.success("Click on Yes");
          const checkIn = false;
          dispatch(CheckInBookingAsync({ Id, checkIn })).then(() =>
            dispatch(fetchBooking())
          );
        };
        const isPaied = data.bookingStatus == 2;
        const isCheck = data.checkIn == true;
        const isrefund = data.bookingStatus == 4;
        const isPastOrerPay = data.bookingStatus == 5;
        return (
          <>
            {isCheck ? (
              <Space wrap>
                <Tooltip title="กดเพื่อยกเลิก" color={"#f50"}>
                  <Tag
                    icon={<CheckCircleOutlined />}
                    color="success"
                    onClick={() => cancelCheckin()}
                  >
                    สำเร็จ
                  </Tag>
                </Tooltip>
              </Space>
            ) : isPaied ? (
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                onChange={onChange}
                defaultChecked={record}
              />
            ) : isrefund ? (
              <Tag icon={<CloseCircleOutlined />} color="error">
                ยกเลิกการจองสำเร็จ
              </Tag>
            ) : isPastOrerPay ? (
              <Tag icon={<CloseCircleOutlined />} color="warning">
                เลยกำหนดชำระเงิน
              </Tag>
            ) : (
              <Tag icon={<SyncOutlined />} color="processing">
                กำลังดำเนินการ
              </Tag>
            )}
          </>
        );
      },
      // width: 150,
    },
    {
      title: "ยกเลิกการจอง",
      key: "operation",
      // fixed: "right",
      render: (_: any, record: any) => {
        // console.log("cancelRecord", record);
        const isCheckin = record.checkIn == true;
        const iscancle = record.bookingStatus == 3;
        const isrefund = record.bookingStatus == 4;
        const isNotPaied = record.bookingStatus == 0;
        const isPastOrerPay = record.bookingStatus == 5;
        if (isCheckin) {
          return null;
        }
    
        return (
          <>
            {iscancle ? (
              <Popconfirm
                title="ชำระเงิน"
                description="ต้องการชำระเงินเลยใช่หรือไม่"
                onConfirm={() => handlerefund(record.key)}
                onOpenChange={() => console.log("open change")}
              >
                <Button
                  type="primary"
                  disabled={isrefund}
                  onClick={() => Sethandlerefund(record.key)}
                  style={{ color: "#fff", backgroundColor: "green" }}
                >
                  คืนเงิน
                </Button>
              </Popconfirm>
            ) : (
              <Button
                onClick={() => showDeleteConfirm(record)}
                type={switchButt ? "default" : "primary"}
                disabled={isNotPaied || isrefund}
                style={
                  isNotPaied ? {} : { color: "#fff", backgroundColor: "red" }
                }
              >
                ยกเลิก
              </Button>
            )}
          </>
        );
      },
    },
    {
      title: "รายละเอียดการจอง",
      key: "operation",
      render: (_: any, record: any) => {
        // console.log("PDFRecord", record);
        return (
          <>
            <Button
              type="primary"
              style={{ backgroundColor: "#4F6F52" }}
              onClick={() => {
                handelDetails(record);
                setQueryString(record.key, true);
              }}
            >
              รายละเอียด
            </Button>
          </>
        );
      },
    },
  ];
  const dataSource = booking.map((item: any) => {
    const {
      bookingId,
      totalPrice,
      seatsSerialized,
      passenger,
      itinerary,
      dateAtBooking,
      bookingStatus,
      checkIn,
      note,
    } = item;
    const { cars, arrivalTime, issueTime, routeCars, itineraryId } = itinerary;
    const { carRegistrationNumber, carsId } = cars;
    const { destinationName, originName, routeCarsId } = routeCars;
    const { passengerName, idCardNumber, email } = passenger;

    const date = moment(dateAtBooking).format("Do MMM YY");
    note == null ? "-" : note;
    let statusText;

    switch (bookingStatus) {
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
        statusText = "คืนเงินแล้ว";
        break;
        case 5:
          statusText = "เลยกำหนดชำระ";
          break;
      default:
        statusText = "Unknown Status";
    }
    const formattedItem = {
      key: bookingId,
      totalPrice,
      seatsSerialized,
      passenger,
      checkIn,
      date,
      carRegistrationNumber,
      arrivalTime,
      issueTime,
      destinationName,
      originName,
      statusText,
      passengerName,
      idCardNumber,
      email,
      itineraryId,
      carsId,
      routeCarsId,
      bookingStatus,
      note,
    };

    return formattedItem;
  });

  // console.log("datasou", dataSource);

  const expandedRowRender = (record: any) => {
    const columns = [
      {
        title: "หมายเลขบัตรประจำตัวประชาชนผู้โดยสาร",
        dataIndex: "idCardNumber",
        key: "idCardNumber",
      },
      { title: "อีเมล์ผู้โดยสาร", dataIndex: "email", key: "email" },
      {
        title: "เวลาออกเดินทาง",
        dataIndex: "issueTime",
        key: "issueTime",
      },
      {
        title: "เวลาที่ไปถึง",
        dataIndex: "arrivalTime",
        key: "arrivalTime",
      },

      {
        title: "สถานที่ต้นทาง",
        dataIndex: "originName",
        key: "originName",
      },

      {
        title: "สถานที่ปลายทาง",
        dataIndex: "destinationName",
        key: "destinationName",
      },
    ];
    // console.log("record", record);

    const data = [
      {
        key: record.key,
        idCardNumber: record.idCardNumber,
        email: record.email,
        issueTime: moment(record.issueTime).format("LT"),
        arrivalTime: moment(record.arrivalTime).format("LT"),
        originName: record.originName,
        destinationName: record.destinationName,
        bookingStatus: record.bookingStatus,
        note: record.note,
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

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการยกเลิกการจองนี้ ?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบความถูกต้องการยกเลิก",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่",
      onOk() {
        updateBooking(record.key);
        // console.log("OK", record.key);
        // Add your delete logic here using the record object
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const setQueryString = (key: string | null, details: boolean) => {
    if (key) {
      const params = new URLSearchParams();
      params.set("bookingId", key);
      // เปลี่ยน URL โดยไม่รีโหลดหน้า
      window.history.replaceState(
        {},
        "",
        `${location.pathname}?${params.toString()}&details=${details}`
      );
    } else {
      window.history.replaceState({}, "", `${location.pathname}`);
    }
    // เปลี่ยน URL parameters เมื่อมีการเลือกเมนูใหม่

    getQueryString()
  };

  const updateBooking = async (bookingId: number) => {
    const status = 3;
    try {
      await dispatch(
        updateStatusBookingAsync({ ID: bookingId, statusBooking: status })
      ).then(async () => {
        await dispatch(fetchBooking());
        notification.success({
          message: "สำร็จ",
          description: "ยกเลิกการจองสำเร็จ.",
        });
        await dispatch(fetchBooking());
        setswitchButt(true);
      });
    } catch (error) {
      console.log("Error updating car:", error);
    }
  };
  const [payment, setPayment] = useState<any>();

  const Sethandlerefund = async (bookingId: any) => {
    // console.log("bookingId", bookingId);
    agent.Bookings.getBookingPaymentById(bookingId).then((item) =>
      setPayment(item)
    );
    // dispatch( updateStatusBookingAsync({ ID: bookingId, statusBooking: 4 }));
  };

  const handlerefund = async (bookingId: any) => {
    try {
      await dispatch(createRefundPaymentAsync(payment?.paymentIntentId));
      dispatch(updateStatusBookingAsync({ ID: bookingId, statusBooking: 4 }));
      setswitchButt(true);
    } catch (error) {
      console.log("Error updating car:", error);
    }
  };
  // console.log("payment", payment);
  return (
    <>
      {modalDetails ? (
        <>
          <div
            style={{ display: "flex", justifyContent: "end", marginRight: 20 }}
          >
            {(userDetail.roleId == 0 || userDetail.roleId == 3 || userDetail.roleId != undefined) && (
              <Button
                type="primary"
                style={{ backgroundColor: "#4F6F52" }}
                onClick={() => {
                  setModalDetails(false);
                  setdataDetails([]);
                  setQueryString(null, false);
                }}
              >
                กลับ
              </Button>
            )}
          </div>
          <BookingDetalisModal bookingId={bookingId} />
        </>
      ) : (
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
            <Row>
              <Button
                type="primary"
                style={{ backgroundColor: "#4F6F52" }}
                onClick={() => setmodalSelect(true)}
              >
                พิมพ์รายละเอียดรอบการเดินทาง
              </Button>
            </Row>
          </Col>
          <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
            <Table
              columns={columns}
              expandable={{ expandedRowRender }}
              dataSource={dataSource}
              scroll={{ x: 1000 }}
            />
          </Col>
        </Row>
      )}

      {/* // <Modal
      //   open={modalDetails}
      //   onCancel={() => setModalDetails(false)}
      //   width={1000}
      //   footer={
      //     <>
      //       <Button
      //         type="primary"
      //         style={{ backgroundColor: "#1A4D2E" }}
      //         onClick={generatePDF}
      //       >
      //         พิมพ์ตั๋ว
      //       </Button>
      //     </>
      //   }
      //   wrapClassName="vertical-center-modal"
      // >
      //   <BookingDetalisModal bookingData={dataDetails} />
      // </Modal> */}
      <Modal
        open={modalSelect}
        onCancel={() => setmodalSelect(false)}
        width={1000}
        footer={null}
        wrapClassName="vertical-center-modal"
      >
        <PDFBookingByItinerarys />
      </Modal>
    </>
  );
};
