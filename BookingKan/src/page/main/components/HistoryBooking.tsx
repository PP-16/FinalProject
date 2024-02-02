import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  List,
  Modal,
  Pagination,
  PaginationProps,
  Row,
  Tabs,
  TabsProps,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Booking } from "../../../api/models/Booking";
import agent from "../../../api/agent";
import moment from "moment";
import Lottie from "lottie-react";
import notfound from "../../../assets/lotti/Empty.json";
import { PaymentForm } from "../../details/PaymentPage";
import { useAppDispatch } from "../../../api/redux/Store/configureStore";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { updateStatusBookingAsync } from "../../../api/redux/Slice/BookingSlice";
import { NavLink } from "react-router-dom";

export const HistoryBooking = () => {
  const [booking, setBooking] = useState<Booking[]>([]);
  const [paymodal, setPaymodal] = useState(false);

  useEffect(() => {
    agent.Bookings.getByPassentger().then((data) => setBooking(data));
  }, []);
  // console.log("book", booking);
  const currentDate = new Date();
  // console.log("date", currentDate);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of items per page as needed
  const { confirm } = Modal;
  const [modals, setModals] = useState(false);
  const [dataMo, setDataMo] = useState<any>();

  const dispatch = useAppDispatch();
  const handleModals = (item: any) => {
    setModals(true);
    setDataMo(item);
  };

  console.log("itemsMo", dataMo);

  const handlePayment = (bookingId: number) => {
    setPaymodal(true);
  };

  // เปลี่ยนหน้า
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };

  const generateListAndPagination = (
    filteredItems: any,
    currentPage: any,
    itemsPerPage: any
  ) => {
    // if (!Array.isArray(filteredItems)) {
    //   // Handle the case where filteredItems is not an array
    //   return (
    //     <Lottie
    //       loop={true}
    //       autoPlay={true}
    //       animationData={notfound}
    //       height={"100%"}
    //       width={"100%"}
    //     />
    //   );
    // }
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    console.log("filt", filteredItems);

    return (
      <>
        <List
          dataSource={filteredItems.slice(startIndex, endIndex)}
          renderItem={(item: any) => (
            <List.Item
              key={item.bookingId}
              onClick={() => (item.bookingId === 0 ? null : handleModals(item))}
              style={{ cursor: "pointer" }}
            >
              <List.Item.Meta
                title={`${item.itinerary.routeCars.originName}-${item.itinerary.routeCars.destinationName}`}
                // description={moment(item.dateAtBooking).format("Do MM YYYY")}
                description={
                  <>
                    <Typography>
                      วันที่เดินทาง :
                      {moment(item.dateAtBooking).format("Do MM YYYY")}
                    </Typography>
                    <Typography>
                      หมายเลขที่นั่ง: {item.seatsSerialized}
                    </Typography>
                  </>
                }
              />
              <Row>
                {item.bookingStatus === 0 ? (
                  <Button
                    onClick={() => handlePayment(item.bookingId)}
                    type="primary"
                    style={{ backgroundColor: "yellowgreen" }}
                  >
                    ชำระเงิน
                  </Button>
                ) : null}
              </Row>
            </List.Item>
          )}
        />
        <Pagination
          current={currentPage}
          total={filteredItems.length}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
        />
      </>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "ที่ต้องชำระ",
      children: generateListAndPagination(
        Array.isArray(booking)
          ? booking.filter((item) => item?.bookingStatus === 0)
          : [],
        currentPage,
        itemsPerPage
      ),
    },
    // {
    //   key: "2",
    //   label: "รอดำเนินการ",
    //   children: generateListAndPagination(
    //     Array.isArray(booking)
    //       ? booking.filter((item) => item?.bookingStatus === 1)
    //       : [],
    //     currentPage,
    //     itemsPerPage
    //   ),
    // },
    {
      key: "3",
      label: "ตั๋วรถ",
      children: generateListAndPagination(
        Array.isArray(booking)
          ? booking.filter((item) => item?.bookingStatus === 2)
          : [],
        currentPage,
        itemsPerPage
      ),
    },
    {
      key: "4",
      label: "ยกเลิก",
      children: generateListAndPagination(
        Array.isArray(booking)
          ? booking.filter((item) => item?.bookingStatus === 3)
          : [],
        currentPage,
        itemsPerPage
      ),
    },
  ];

  const showDeleteConfirm = (dataMo: any) => {
    confirm({
      title: "Are you sure to delete this car?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        updateBooking(dataMo);
        console.log("OK", dataMo);
        // Add your delete logic here using the record object
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const updateBooking = async (bookingId: number) => {
    console.log("book", bookingId);

    const status = 3;
    try {
      await dispatch(
        updateStatusBookingAsync({ ID: bookingId, statusBooking: status })
      );
      notification.success({
        message: "สำร็จ",
        description: "ยกเลิกการจองสำเร็จ.",
      });
      setModals(false);
    } catch (error) {
      console.log("Error updating car:", error);
    }
  };
  return (
    <>
      {paymodal == true && (
        <PaymentForm
          bookingData={dataMo.bookingId}
          visible={paymodal}
          cancel={setPaymodal}
        />
      )}
      {dataMo && (
        <Modal
          open={modals}
          onCancel={() => setModals(false)}
          width={900}
          footer={
            dataMo.bookingStatus !== 3 && (
              <Row style={{ justifyContent: "space-around" }}>
                <Col span={10}>
                  <NavLink to="/ChangeDateBooking" state={dataMo}>
                    <Button
                      type="primary"
                      block
                      style={{ backgroundColor: "#fadb14", color: "black" }}
                      // onClick={() => showDeleteConfirm(dataMo.bookingId)}
                    >
                      เลื่อนวันที่จอง
                    </Button>
                  </NavLink>
                </Col>
                <Col span={10}>
                  <Button
                    block
                    type="primary"
                    style={{ backgroundColor: "#f5222d" }}
                    onClick={() => showDeleteConfirm(dataMo.bookingId)}
                  >
                    ยกเลิกการจอง
                  </Button>
                </Col>
              </Row>
            )
          }
          wrapClassName="vertical-center-modal"
        >
          <Card title="ข้อมูลการจอง" style={{ margin: 20 }}>
            <Descriptions>
              <>
                <Descriptions.Item label="วันที่เดินทาง">
                  {moment(dataMo.dateAtBooking).format("Do MMM YY")}
                </Descriptions.Item>
                <Descriptions.Item label="เวลาที่รถออก">
                  {moment(dataMo.itinerary.issueTime).format("LT")}
                </Descriptions.Item>
                <Descriptions.Item label="เวลาที่ไปถึง">
                  {moment(dataMo.itinerary.arrivalTime).format("LT")}
                </Descriptions.Item>
                <Descriptions.Item label="หมายเลขรถ">
                  {dataMo.itinerary.cars.carRegistrationNumber}
                </Descriptions.Item>
                <Descriptions.Item label="สถานีต้นทาง">
                  {dataMo.itinerary.routeCars.originName}
                </Descriptions.Item>
                <Descriptions.Item label="สถานีปลายทาง">
                  {dataMo.itinerary.routeCars.destinationName}
                </Descriptions.Item>
                <Descriptions.Item label="หมายเลขที่นั่ง">
                  {dataMo.seatsSerialized}
                </Descriptions.Item>
                <Descriptions.Item label="ราคารวม">
                  {dataMo.totalPrice}
                </Descriptions.Item>
              </>
            </Descriptions>
          </Card>
        </Modal>
      )}
      <Card>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </>
  );
};
