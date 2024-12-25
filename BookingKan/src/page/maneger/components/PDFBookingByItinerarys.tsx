import { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import { fetchItinarery } from "../../../api/redux/Slice/ItinerarySlice";
import {
  Button,
  Card,
  Col,
  DatePicker,
  DatePickerProps,
  Descriptions,
  Empty,
  Row,
  Select,
  Table,
} from "antd";
import moment from "moment";
import { fetchBookingByItineraryAsync } from "../../../api/redux/Slice/BookingSlice";
import html2pdf from "html2pdf.js";
import { CSVLink } from "react-csv";
import { Booking } from "../../../api/models/Booking";
import { FileExcelOutlined, FilePdfOutlined } from "@ant-design/icons";

export const PDFBookingByItinerarys = () => {
  const itinerarys = useAppSelector((t) => t.itinerary.itinerary);
  const bookingItinerarys = useAppSelector((t) => t.booking.bookingItinerary);
  const [tableBooking, setTableBooking] = useState(false);
  const [itineraryId, setitineraryId] = useState<any>();
  const [dateAtBooking, setDateAtBooking] = useState<Date | null>(null);
  const dispatch = useAppDispatch();

  const handleChangeitinerary = (value: any) => {
    // console.log(`selecteditineraryId ${value}`);
    setitineraryId(value.key);
  };
  const onChange: DatePickerProps["onChange"] = (date: any) => {
    // console.log(date);
    setDateAtBooking(date?.$d);
  };
  //   const date = moment(dateAtBooking).format();
  const dateBooking = moment(dateAtBooking).format("YYYY-MM-DDTHH:mm:ss");
  const handleSearch = async () => {
    const formattedDate = dateAtBooking
      ? moment(dateAtBooking).format("YYYY-MM-DDTHH:mm:ss")
      : null;
    await dispatch(
      fetchBookingByItineraryAsync({
        dateBooking: formattedDate,
        itineraryId: itineraryId,
      })
    ).then(() => {
      setTableBooking(true);
    });
  };
  useEffect(() => {
    if (dateAtBooking !== null) {
      console.log("Selected date:", dateAtBooking);
    }
  }, [dateAtBooking]);
  // console.log("bookingItinerarys", bookingItinerarys);
  // console.log("itineraryId", itineraryId);
  //   console.log("date", date);
  useEffect(() => {
    dispatch(fetchItinarery());
  }, []);

  const generatePDF = () => {
    const element = document.getElementById("html-elementbooking-id-to-pdf"); // เปลี่ยน 'your-html-element-id' เป็น ID ขององค์ประกอบ HTML ที่คุณต้องการแปลงเป็น PDF
    html2pdf()
      .from(element)
      .save(bookingItinerarys[0].itineraryId + ".pdf");
  };

  //#region  manageDataExcel
  const headersExcel = [
    { label: "รหัสการจอง", key: "bookingId" },
    { label: "หมายเลขทะเบียนรถ", key: "carRegistrationNumber" },
    { label: "สถานที่ต้นทาง", key: "originName" },
    { label: "สถานที่ปลายทาง", key: "destinationName" },
    { label: "วันที่เดินทาง", key: "date" },
    { label: "เวลาที่ออกเดินทาง", key: "dateissueTime" },
    { label: "เวลาที่ไปถึง", key: "datearrivalTime" },
    { label: "ชื่อผู้โดยสาร", key: "passengerName" },
    { label: "เบอร์โทรศัพท์ผู้โดยสาร", key: "PhoneNumber" },
    { label: "หมายเลขที่นั่ง", key: "seatsSerialized" },
    { label: "หมายเหตุ", key: "note" },
    { label: "ราคา", key: "totalPrice" },
    { label: "ยืนยันการเดินทาง", key: "checkIn" },
    { label: "สถานะการชำระเงิน", key: "statusText" },
  ];

  const dataExcel =
    bookingItinerarys &&
    bookingItinerarys.map((items: Booking) => {
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
      } = items;
      const { cars, arrivalTime, issueTime, routeCars, itineraryId } =
        itinerary;
      const { carRegistrationNumber, carsId } = cars;
      const { destinationName, originName, routeCarsId } = routeCars;
      const { passengerName, idCardNumber, email, phone } = passenger;

      const date = moment(dateAtBooking).format("Do MMM YY");
      const dateissueTime = moment(issueTime).format("h:mm a");
      const datearrivalTime = moment(arrivalTime).format("h:mm a");
      const PhoneNumber = `\t${phone}`;

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
        default:
          statusText = "Unknown Status";
      }
      const formattedItem = {
        bookingId,
        totalPrice,
        seatsSerialized,
        checkIn,
        date,
        carRegistrationNumber,
        datearrivalTime,
        dateissueTime,
        destinationName,
        originName,
        statusText,
        passengerName,
        bookingStatus,
        note,
        PhoneNumber,
      };

      return formattedItem;
    });
  //#endregion

  //#region table
  const dataSource =
    bookingItinerarys &&
    bookingItinerarys.map((item: any) => {
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
      const { cars, arrivalTime, issueTime, routeCars, itineraryId } =
        itinerary;
      const { carRegistrationNumber, carsId } = cars;
      const { destinationName, originName, routeCarsId } = routeCars;
      const { passengerName, idCardNumber, email, phone } = passenger;

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
        phone,
      };

      return formattedItem;
    });

  const columns = [
    {
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passengerName",
      key: "passengerName",
    },
    {
      title: "เบอร์ติดต่อผู้โดยสาร",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "หมายเลขที่นั่ง",
      dataIndex: "seatsSerialized",
      key: "seatsSerialized",
    },
    {
      title: "หมายเหตุ",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "สถานะการจ่ายเงิน",
      dataIndex: "statusText",
      key: "statusText",
    },
    {
      title: "ราคารวม",
      dataIndex: "totalPrice",
      key: "totalPrice",
    },
  ];
  //#endregion

  return (
    <div>
      <div style={{ margin: 20 }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: 5 }}>
          <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
            <Select
              defaultValue="เลือกเส้นทาง" // Set the value as an object with key
              style={{ width: "100%" }}
              onChange={handleChangeitinerary} // Extract the key from the selected value
              size="large"
              options={
                itinerarys &&
                itinerarys.map((item: any) => ({
                  value: item.itineraryId,
                  label: `${item.routeCars.originName} - ${item.routeCars.destinationName}`,
                }))
              }
              labelInValue // Enable labelInValue to work with an object value
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
            <DatePicker
              onChange={onChange}
              size="large"
              style={{ width: "100%" }}
            />
          </Col>
          <Col xs={24} sm={24} md={12} xl={8} xxl={8}>
            <Button
              type="primary"
              style={{ backgroundColor: "#4F6F52" }}
              size="large"
              onClick={handleSearch}
              block
            >
              ค้นหารอบรถ
            </Button>
          </Col>
        </Row>

        {tableBooking == true &&
          (bookingItinerarys.length != 0 || bookingItinerarys != null ? (
            <>
              <div id="html-elementbooking-id-to-pdf">
                <Card
                  title="รายละเอียดการเดินทาง"
                  headStyle={{ backgroundColor: "#4F6F52", color: "#fff" }}
                >
                  {bookingItinerarys.length > 0 && (
                    <Descriptions labelStyle={{ color: "black" }}>
                      <Descriptions.Item label="วันที่เดินทาง">
                        {moment(bookingItinerarys[0].dateAtBooking).format(
                          "Do MMM YY"
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="เวลาออกเดินทาง">
                        {moment(
                          bookingItinerarys[0].itinerary.issueTime
                        ).format("LT")}
                      </Descriptions.Item>
                      <Descriptions.Item label="เวลาที่ไปถึง">
                        {moment(
                          bookingItinerarys[0].itinerary.arrivalTime
                        ).format("LT")}
                      </Descriptions.Item>
                      <Descriptions.Item label="สถานที่ต้นทาง">
                        {bookingItinerarys[0].itinerary.routeCars.originName}
                      </Descriptions.Item>
                      <Descriptions.Item label="สถานที่ปลายทาง">
                        {
                          bookingItinerarys[0].itinerary.routeCars
                            .destinationName
                        }
                      </Descriptions.Item>
                      <Descriptions.Item label="หมายเลขรถ">
                        {
                          bookingItinerarys[0].itinerary.cars
                            .carRegistrationNumber
                        }
                      </Descriptions.Item>
                    </Descriptions>
                  )}

                  <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    bordered={true}
                    className="custom-table"
                  />
                </Card>
              </div>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}> 
                <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                  <Button
                    type="primary"
                    onClick={generatePDF}
                    style={{ margin: 10,backgroundColor:"#ff4d4f" }}
                    icon={<FilePdfOutlined />}
                    block
                  >
                    พิมพ์รายละเอียดรอบการเดินทาง(PDF)
                  </Button>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
                  <Button
                    type="primary"
                    onClick={generatePDF}
                    style={{ margin: 10,backgroundColor:"#52c41a"  }}
                    icon={<FileExcelOutlined />}
                    block
                  >
                    <CSVLink data={dataExcel} headers={headersExcel}>
                      พิมพ์รายละเอียดรอบการเดินทาง(Excel)
                    </CSVLink>
                  </Button>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Empty />
            </>
          ))}
      </div>
    </div>
  );
};
