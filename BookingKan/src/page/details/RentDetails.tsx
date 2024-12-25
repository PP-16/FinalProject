import {
  Card,
  Col,
  Descriptions,
  Modal,
  Row,
  DatePicker,
  Carousel,
} from "antd";
import "moment/locale/th";
import { PathImage } from "../../routers/PathImage";

const { Meta } = Card;
const { RangePicker } = DatePicker;

export const RentDetail = ({ visble, cars, cancel }: any) => {
  // console.log("itemimageCars", cars.imageCars);
  let statusText;

  switch (cars.statusCar) {
    case 0:
      statusText = "ว่าง";
      break;
    case 1:
      statusText = "เช่าแล้ว";
      break;
    default:
      statusText = "Unknown Status";
  }

  const images = PathImage.image + cars.imageCars;
  // console.log("imagesCars", images);

  // const onChange = (currentSlide: number) => {
  //   // console.log(currentSlide);
  // };
  const contentStyle: React.CSSProperties = {
    margin: 0,
    height: '200px',
    // color: '#364d79',
    lineHeight: '200px',
    textAlign: 'center',
    // background: '#364d79',
  };
  return (
    <Modal
      open={visble}
      width={1000}
      footer={null}
      onCancel={() => cancel(false)}
    >
      <Card style={{ margin: 30 }} title="รายละเอียดรถ">
        <Row style={{ justifyContent: "center" }}>
          <Col
            span={24}
            // style={{ justifyItems: "center", margin: 10, display: "flex" }}
          >
            <Carousel  draggable >
            {cars.imageCars.map((itemImg: any) => (
                <div style={{width:400,height:200}} >
                  <img
                    src={PathImage.image + itemImg.image}
                  style={{objectFit:'cover',objectPosition:'50% 50%',height:'100%',width:'100%'}}
                  />
                   {/* <Image src={PathImage.image + itemImg.image}/> */}
                </div>
              ))}
           
              
            </Carousel>
           
          </Col>
          <Col span={24}>
            <Descriptions>
              <Descriptions.Item label="แบนด์รถ">
                {cars.carBrand}
              </Descriptions.Item>
              <Descriptions.Item label="รุ่นรถ">
                {cars.carModel}
              </Descriptions.Item>
              <Descriptions.Item label="หมายเลขทะเบียนรถ">
                {cars.carRegistrationNumber}
              </Descriptions.Item>
              <Descriptions.Item label="คลาสรถ">
                {cars.classCars.className}
              </Descriptions.Item>
              <Descriptions.Item label="ราคาต่อวัน">
                {cars.classCars.price}
              </Descriptions.Item>
              <Descriptions.Item label="รายละเอียดรถ">
                {cars.detailCar}
              </Descriptions.Item>
              <Descriptions.Item label="สถานะ">{statusText}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Modal>
  );
};
