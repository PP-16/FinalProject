import {
  CaretLeftOutlined,
  CaretRightOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Carousel,
  Col,
  DatePicker,
  Empty,
  Modal,
  Row,
  Select,
  Statistic,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import agent from "../../api/agent";
import moment from "moment";
import dayjs from "dayjs";
import { GraphLine } from "./components/GraphLine";
import { GraphSingleBar } from "./components/GraphSingleBar";
import { GraphArea } from "./components/GraphArea";
import { GraphTwoBar } from "./components/GraphTwoBar";
import { GraphTwoLine } from "./components/GraphTwoLine";
import { GraphTwoArea } from "./components/GraphTwoArea";
import html2pdf from "html2pdf.js";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { fetchTotalPriceOrder } from "../../api/redux/Slice/OrderRentSlice";

export const HomeAdmin = () => {
  const [rentedCar, setRentedCar] = useState([]);
  const [cars, setCars] = useState([]);
  const [itinerary, setItinerary] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [user, setUser] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [modalTwoGraph, setModalTwoGraph] = useState(false);
  const [modalGraph, setModalGraph] = useState(false);
  const [modalGraphRentCar, setModalGraphRentCar] = useState(false);

  const [totalPriceDataBooking, setTotalPriceDataBooking] = useState<any>([]);
  const [totalPriceDataOrder, setTotalPriceDataOrder] = useState<any>([]);
  const [titleCard, setTitleCard] = useState("กราฟสรุปรายได้ทั้งหมด");
  const dispatch = useAppDispatch();

  useEffect(() => {
    agent.Cars.getCarForRents().then((rented) => setRentedCar(rented));
    agent.Cars.getCars().then((car) => setCars(car));
    agent.Itinerarys.getItinarery().then((itinerary) =>
      setItinerary(itinerary)
    );
    agent.Drivers.getDriver().then((dri) => setDrivers(dri));
    agent.RoustCars.getRoute().then((route) => setRoutes(route));
    agent.Account.getAllUser().then((user) => setUser(user));
    agent.Bookings.getBooking().then((booking) => setAllBookings(booking));
    agent.OrderRent.getOrder().then((order) => setAllOrders(order));

    agent.Bookings.getTotalPriceBookings().then((item) => {
      formattedDataBooking(item);
    });

    dispatch(fetchTotalPriceOrder()).then((item) => {
      console.log("getOrderTotalByReturn", item);
      formattedDataOrder(item.payload);
    });
    // agent.OrderRent.getOrderTotalByReturn().then((item) =>
    //   {console.log("getOrderTotalByReturn",item)

    //   formattedDataOrder(item)}
    // );
  }, []);

  console.log("totalPriceDataOrder", totalPriceDataOrder);
  console.log("totalPriceDataBooking", totalPriceDataBooking);
  //#region manageGraph

  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setChartWidth(window.innerWidth * 0.9); // Adjust width dynamically
    };

    handleResize(); // Initial call to set initial width

    window.addEventListener("resize", handleResize); // Add event listener for window resize

    return () => {
      window.removeEventListener("resize", handleResize); // Remove event listener on component unmount
    };
  }, []);

  const formattedDataBooking = (item: any) => {
    const format: any = Object.entries(item).map(([date, value]) => ({
      // date: new Date(date),
      date: moment(date).format("Do MMM"),
      price: value,
    }));
    console.log("itemBooking", item);
    setTotalPriceDataBooking(format);
  };

  const formattedDataOrder = (item: any) => {
    const format: any = Object.entries(item).map(([date, value]) => ({
      // date: new Date(date),
      date: moment(date).format("Do MMM"),
      price: value,
    }));
    console.log("item", item);

    setTotalPriceDataOrder(format);
  };
  const currentDate = dayjs().format();

  const [selectedMonth, setSelectedMonth] = useState<any>(currentDate);
  const [selectedYear, setSelectedYear] = useState<any>(currentDate);

  const onChangeMount = (event: any) => {
    // console.log("mount", event.format("MM"));

    setSelectedMonth(event.format("MM")); // เก็บค่าเดือนที่ถูกเลือกใน state
    SelectMountForGraphBooking(event.format("MM"), event.format("YYYY"));
    SelectMountForGraphOrder(event.format("MM"), event.format("YYYY"));
    setTitleCard(`กราฟสรุปเดือน ${event.format("MMMM")}`);
  };
  // console.log("selectedMonth", selectedMonth);

  const onChangeYear = (event: any) => {
    // console.log("year", event.format("YYYY"));
    setSelectedYear(event.format("YYYY")); // เก็บค่าเดือนที่ถูกเลือกใน state
    SelectYearForGraphBooking(event.format("YYYY"));
    SelectYearForGraphOrder(event.format("YYYY"));
    setTitleCard(`กราฟสรุปปี ${event.format("YYYY")}`);
  };
  // console.log("selectedYear", selectedYear);

  const SelectMountForGraphBooking = async (mount: any, year: any) => {
    await agent.Bookings.getTotalPriceBookingsByMount(mount, year).then(
      (item) => formattedDataBooking(item)
    );
  };

  const SelectYearForGraphBooking = async (year: any) => {
    await agent.Bookings.getTotalPriceBookingsByYear(year).then((item) =>
      formattedDataBooking(item)
    );
  };

  const SelectMountForGraphOrder = async (mount: any, year: any) => {
    await agent.OrderRent.getOrderTotalByMount(mount, year).then((item) =>
      formattedDataOrder(item)
    );
  };

  const SelectYearForGraphOrder = async (year: any) => {
    await agent.OrderRent.getOrderTotalByYear(year).then((item) =>
      formattedDataOrder(item)
    );
  };

  const dataBar = totalPriceDataBooking.map((item: any, index: any) => ({
    วันที่: item.date,
    จองที่นั่ง: item.price,
    เช่ารถ: totalPriceDataOrder[index] ? totalPriceDataOrder[index].price : 0,
  }));

  const [selectGraph, setSelectGraph] = useState(1);

  const handleChange = (e: number) => {
    // console.log("e", e);

    setSelectGraph(e);
  };

  const [selectGraphCompare, setSelectGraphCompare] = useState(1);

  const handleChangeGraphCompare = (e: number) => {
    // console.log("e", e);

    setSelectGraphCompare(e);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "กราฟสรุปรายได้จากการจองที่นั่ง",
      children: (
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Select
                placeholder="เลือกประเภทแผนภูมิ"
                style={{ width: 170, margin: 10 }}
                onChange={handleChange}
                options={[
                  { value: "1", label: "แผนภูมิเส้น" },
                  { value: "2", label: "แผนภูมิแท่ง" },
                  { value: "3", label: "แผนภูมิพื้นที่" },
                ]}
              />
            </Col>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Button
                type="primary"
                onClick={() => setModalGraph(true)}
                style={{ margin: 10, backgroundColor: "#ff4d4f" }}
                icon={<FilePdfOutlined />}
                block
              >
                พิมพ์สรุปรายได้จองที่นั่ง
              </Button>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: 5 }}>
            <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
              <Card hoverable title={titleCard}>
                {totalPriceDataBooking.length == 0 ? (
                  <>
                    <Empty />
                  </>
                ) : selectGraph == 1 ? (
                  <GraphLine total={totalPriceDataBooking} widthGraph={1200} />
                ) : selectGraph == 2 ? (
                  <GraphSingleBar
                    data={totalPriceDataBooking}
                    widthGraph={1200}
                  />
                ) : (
                  <GraphArea data={totalPriceDataBooking} widthGraph={1200} />
                )}
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      label: "กราฟสรุปรายได้จากการเช่ารถ",
      children: (
        <>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Select
                placeholder="เลือกประเภทแผนภูมิ"
                style={{ width: 170, margin: 10 }}
                onChange={handleChange}
                options={[
                  { value: "1", label: "แผนภูมิเส้น" },
                  { value: "2", label: "แผนภูมิแท่ง" },
                  { value: "3", label: "แผนภูมิพื้นที่" },
                ]}
              />
            </Col>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Button
                type="primary"
                onClick={() => setModalGraphRentCar(true)}
                style={{ margin: 10, backgroundColor: "#ff4d4f" }}
                icon={<FilePdfOutlined />}
                block
              >
                พิมพ์สรุปรายได้เช่ารถ
              </Button>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
              <Card hoverable title={titleCard}>
                {totalPriceDataOrder.length == 0 ? (
                  <>
                    <Empty />
                  </>
                ) : selectGraph == 1 ? (
                  <GraphLine total={totalPriceDataOrder} widthGraph={1200} />
                ) : selectGraph == 2 ? (
                  <GraphSingleBar
                    data={totalPriceDataOrder}
                    widthGraph={1200}
                  />
                ) : (
                  <GraphArea data={totalPriceDataOrder} widthGraph={1200} />
                )}
              </Card>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  //#endregion

  //#region  manageCardCarousel
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: "550px",
    color: "red",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const CustomLeftArrow = ({ onClick }: any) => {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          left: "0",
          transform: "translateY(-50%)", // ให้ปุ่มอยู่ตรงกลางด้านบน
          cursor: "pointer",
          zIndex: 10, // ให้ปุ่มอยู่ข้างหน้าเนื้อหา
        }}
      >
        <CaretLeftOutlined style={{ fontSize: "24px" }} />
      </div>
    );
  };

  const CustomRightArrow = ({ onClick }: any) => {
    return (
      <div
        onClick={onClick}
        style={{
          position: "absolute",
          top: "50%",
          right: "0",
          transform: "translateY(-50%)", // ให้ปุ่มอยู่ตรงกลางด้านบน
          cursor: "pointer",
          zIndex: 10, // ให้ปุ่มอยู่ข้างหน้าเนื้อหา
        }}
      >
        <CaretRightOutlined style={{ fontSize: "24px" }} />
      </div>
    );
  };
  //#endregion

  const generateGraphTwoPDF = () => {
    const element = document.getElementById("html-element-id-to-GraphTwopdf"); // เปลี่ยน 'your-html-element-id' เป็น ID ขององค์ประกอบ HTML ที่คุณต้องการแปลงเป็น PDF
    html2pdf()
      .from(element)
      .save("Graph" + ".pdf");
  };
  const generateGraphPDF = () => {
    const element = document.getElementById("html-element-id-to-Graphpdf"); // เปลี่ยน 'your-html-element-id' เป็น ID ขององค์ประกอบ HTML ที่คุณต้องการแปลงเป็น PDF
    html2pdf()
      .from(element)
      .save("Graph" + ".pdf");
  };
  return (
    <>
      <Carousel
        dotPosition="bottom"
        arrows={true}
        prevArrow={<CustomLeftArrow />}
        nextArrow={<CustomRightArrow />}
      >
        <div style={contentStyle}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="ประวัติการจองที่นั่งทั้งหมด"
                  value={allBookings.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>

            <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="ประวัติการเช่ารถทั้งหมด"
                  value={allOrders.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div style={contentStyle}>
          <Row style={{ justifyContent: "space-between" }}>
            <Col xs={8} sm={8} md={8} xl={8} xxl={8}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="รถสำหรับเช่า"
                  value={rentedCar.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowUpOutlined />}
                />
              </Card>
            </Col>

            <Col xs={8} sm={8} md={8} xl={8} xxl={8}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="จำนวณรถโดยสาร"
                  value={cars.length - rentedCar.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowUpOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>

            <Col xs={8} sm={8} md={8} xl={8} xxl={8}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="จำนวณรอบการเดินรถ"
                  value={itinerary.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </div>

        <div style={contentStyle}>
          <Row style={{ justifyContent: "space-between" }}>
            <Col xs={8} sm={8} md={8} xl={8} xxl={8}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="จำนวณคนขับรถทั้งหมด"
                  value={drivers.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>

            <Col xs={8} sm={8} md={8} xl={8} xxl={8}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="จำนวณเส้นทางทั้งหมด"
                  value={routes.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>

            <Col xs={8} sm={8} md={8} xl={8} xxl={8}>
              <Card style={{ margin: 3 }}>
                <Statistic
                  title="จำนวณผู้ใช้ในระบบทั้งหมด"
                  value={user.length}
                  // precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  // prefix={<ArrowDownOutlined />}
                  // suffix="%"
                />
              </Card>
            </Col>
          </Row>
        </div>
      </Carousel>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ margin: 5 }}>
        <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
          <Row style={{ alignItems: "center" }}>
            <Typography style={{ fontSize: 15, margin: 10 }}>
              เลือกเดือนในปีที่ต้องการดู :
            </Typography>
            <DatePicker
              onChange={onChangeMount}
              picker="month"
              defaultValue={dayjs(selectedMonth)}
              format={"MM/YYYY"}
            />
          </Row>
        </Col>

        <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
          <Row style={{ alignItems: "center" }}>
            <Typography style={{ fontSize: 15, margin: 10 }}>
              เลือกปีที่ต้องการดู :
            </Typography>
            <DatePicker
              onChange={onChangeYear}
              picker="year"
              defaultValue={dayjs(selectedYear)}
              format={"YYYY"}
            />
          </Row>
        </Col>

        <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
          <Card>
            <Tabs
              defaultActiveKey="1"
              items={items}
              style={{ marginTop: 10 }}
            />
          </Card>
        </Col>

        <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
          <Select
            placeholder="เลือกประเภทแผนภูมิ"
            style={{
              width: 170,
              margin: 10,
              backgroundColor: "#F3F8FF",
              color: "#F3F8FF",
            }}
            onChange={handleChangeGraphCompare}
            options={[
              { value: "1", label: "แผนภูมิแท่ง" },
              { value: "2", label: "แผนภูมิเส้น" },
              { value: "3", label: "แผนภูมิพื้นที่" },
            ]}
          />
        </Col>

        <Col xs={12} sm={12} md={12} xl={12} xxl={12}>
          <Button
            type="primary"
            onClick={() => setModalTwoGraph(true)}
            style={{ margin: 10, backgroundColor: "#ff4d4f" }}
            icon={<FilePdfOutlined />}
            block
          >
            พิมพ์แผนภูมิเปรียบเทียบรายได้
          </Button>
        </Col>

        <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
          <Card
            hoverable
            title={"ตารางการเปรียบเทียบรายได้ระหว่างการเช่าและการจองที่นั่ง"}
          >
            {totalPriceDataBooking.length == 0 &&
            totalPriceDataOrder.length == 0 ? (
              <>
                <Empty />
              </>
            ) : selectGraphCompare == 1 ? (
              <GraphTwoBar dataBar={dataBar} widthGraph={1500} />
            ) : selectGraphCompare == 2 ? (
              <GraphTwoLine dataBar={dataBar} widthGraph={1500} />
            ) : (
              <GraphTwoArea dataBar={dataBar} widthGraph={1500} />
            )}
          </Card>
        </Col>

        <Modal
          width={1000}
          open={modalTwoGraph}
          onCancel={() => setModalTwoGraph(false)}
          footer={null}
        >
          <>
            <div id="html-element-id-to-GraphTwopdf">
              <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                <Card
                  hoverable
                  title={
                    "ตารางการเปรียบเทียบรายได้ระหว่างการเช่าและการจองที่นั่ง"
                  }
                >
                  {totalPriceDataBooking.length == 0 &&
                  totalPriceDataOrder.length == 0 ? (
                    <>
                      <Empty />
                    </>
                  ) : selectGraphCompare == 1 ? (
                    <GraphTwoBar dataBar={dataBar} widthGraph={700} />
                  ) : selectGraphCompare == 2 ? (
                    <GraphTwoLine dataBar={dataBar} widthGraph={700} />
                  ) : (
                    <GraphTwoArea dataBar={dataBar} widthGraph={700} />
                  )}
                </Card>
              </Col>
            </div>
            <Button
              type="primary"
              onClick={generateGraphTwoPDF}
              style={{ margin: 10, backgroundColor: "#ff4d4f" }}
              icon={<FilePdfOutlined />}
              block
            >
              พิมพ์เปรียบเทียบรายได้(PDF)
            </Button>
          </>
        </Modal>

        <Modal
          width={1000}
          open={modalGraph}
          onCancel={() => setModalGraph(false)}
          footer={null}
        >
          <>
            <div style={{ margin: 20 }} id="html-element-id-to-Graphpdf">
              <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ margin: 5 }}
              >
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                  <Card hoverable title="แผนภูมิสรุปรายได้จากการจองที่นั่ง">
                    {totalPriceDataBooking.length == 0 ? (
                      <>
                        <Empty />
                      </>
                    ) : selectGraph == 1 ? (
                      <GraphLine
                        total={totalPriceDataBooking}
                        widthGraph={700}
                      />
                    ) : selectGraph == 2 ? (
                      <GraphSingleBar
                        data={totalPriceDataBooking}
                        widthGraph={700}
                      />
                    ) : (
                      <GraphArea
                        data={totalPriceDataBooking}
                        widthGraph={700}
                      />
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
            <Button
              type="primary"
              onClick={generateGraphPDF}
              style={{ margin: 10, backgroundColor: "#ff4d4f" }}
              icon={<FilePdfOutlined />}
              block
            >
              พิมพ์แผนภูมิสรุปรายได้จากการจองที่นั่ง(PDF)
            </Button>
          </>
        </Modal>
        <Modal
          width={1000}
          open={modalGraphRentCar}
          onCancel={() => setModalGraphRentCar(false)}
          footer={null}
        >
          <>
            <div style={{ margin: 20 }} id="html-element-id-to-Graphpdf">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={24} xl={24} xxl={24}>
                  <Card hoverable title="แผนภูมิสรุปรายได้จากการเช่ารถ">
                    {totalPriceDataOrder.length == 0 ? (
                      <>
                        <Empty />
                      </>
                    ) : selectGraph == 1 ? (
                      <GraphLine total={totalPriceDataOrder} widthGraph={700} />
                    ) : selectGraph == 2 ? (
                      <GraphSingleBar
                        data={totalPriceDataOrder}
                        widthGraph={700}
                      />
                    ) : (
                      <GraphArea data={totalPriceDataOrder} widthGraph={700} />
                    )}
                  </Card>
                </Col>
              </Row>
            </div>
            <Button
              type="primary"
              onClick={generateGraphPDF}
              style={{ margin: 10, backgroundColor: "#ff4d4f" }}
              icon={<FilePdfOutlined />}
              block
            >
              พิมพ์แผนภูมิสรุปรายได้จากการเช่ารถ(PDF)
            </Button>
          </>
        </Modal>
      </Row>
    </>
  );
};
