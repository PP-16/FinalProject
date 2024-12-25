import {
  Avatar,
  Button,
  Card,
  Descriptions,
  List,
  Modal,
  Pagination,
  Row,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../api/redux/Store/configureStore";
import {
  fetchOrderPast,
  fetchUserOrders,
} from "../../../api/redux/Slice/OrderRentSlice";
import { it } from "node:test";
import dayjs from "dayjs";
import { PathImage } from "../../../routers/PathImage";
import { OrderPastPaymentPage } from "../../details/OrderPastPaymentPage";
import agent from "../../../api/agent";

export const HistoryOrder = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust the number of items per page as needed
  const { confirm } = Modal;
  const [modals, setModals] = useState(false);
  const [dataMo, setDataMo] = useState<any>();
  const [paymodal, setPaymodal] = useState(false);
  const userOrder = useAppSelector((t) => t.order.userOrders);
  const orderPast = useAppSelector((t) => t.order.orderPastList);
  const [userDetail, setUser] = useState<any>([]);
  const [modalChangPro, setModalChangPro] = useState(false);
  const user = useAppSelector((t) => t.account.user);

  useEffect(() => {
    agent.Account.getUser(user?.token).then((user) => setUser(user));
  }, [userDetail]);

  console.log("userD", userDetail);
  console.log("userOrder", userOrder);
  console.log("orderPast", orderPast);
  console.log("dataMo", dataMo);

  const imageUser = PathImage.imageUser + userDetail.imagePassenger;
  const dispatch = useAppDispatch();
  const handlePageChange = (page: any) => {
    setCurrentPage(page);
  };
  const handleModals = (item: any) => {
    setModals(true);
    setDataMo(item);
  };

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchOrderPast());
    agent.OrderRent.checkOrderPast();
  }, []);

  const generateListAndPagination = (
    filteredItems: any,
    currentPage: any,
    itemsPerPage: any
  ) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;
    console.log("filt", filteredItems);

    return (
      <>
        <List
          dataSource={filteredItems.slice(startIndex, endIndex)}
          renderItem={(item: any) => {
            const getButtonText = () => {
              if (item?.orderSatus === 5) {
                const matchingOrder = orderPast.find(
                  (order) => order.orderRentId === item?.orderRentId
                );
                return matchingOrder && !matchingOrder.paied
                  ? "ชำระส่วนต่าง"
                  : "เพิ่มเติม";
              }
              // return item?.orderSatus === 0 || item?.orderSatus === 5
              //  ;
            };

            const getButtonColor = () => {
              if (item?.orderSatus === 5) {
                const matchingOrder = orderPast.find(
                  (order) => order.orderRentId === item?.orderRentId
                );
                return matchingOrder && !matchingOrder.paied
                  ? "yellowgreen"
                  : "#4F6F52";
              }
            };
            //   return item?.orderSatus === 0 || item?.orderSatus === 5
            //     ? "yellowgreen"
            //     : "#4F6F52";
            // };
            return (
              <List.Item
                key={item?.orderRentId}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  item?.orderRentId === 0 ? null : handleModals(item)
                }
                // actions={[
                //   <>
                //     <Button
                //       type="primary"
                //       style={{
                //         backgroundColor: getButtonColor(),
                //       }}
                //       onClick={() =>
                //         item?.orderRentId === 0 ? null : handleModals(item)
                //       }
                //     >
                //       {getButtonText()}
                //     </Button>
                //   </>,
                // ]}
              >
                {item.orderRentItems.length > 1 ? (
                  <List.Item.Meta
                    key={item.orderRentItems.orderRentItemId} // เพิ่ม key เพื่อระบุความแตกต่างของแต่ละ ListItemMeta
                    title={`จำนวนรถที่เช่าทั้งหมด ${item.orderRentItems.length} คัน`}
                    description={
                      <>
                        <Typography>วันที่รับรถ - วันที่คืนรถ :</Typography>
                        <Typography>
                          {`${moment(
                            item.orderRentItems.length.dateTimePickup
                          ).format("Do MM YYYY")} - ${moment(
                            item.orderRentItems.length.dateTimeReturn
                          ).format("Do MM YYYY")}`}
                        </Typography>
                      </>
                    }
                  />
                ) : (
                  <List.Item.Meta
                    key={item.orderRentItems.orderRentItemId} // เพิ่ม key เพื่อระบุความแตกต่างของแต่ละ ListItemMeta
                    title={item.orderRentItems.map(
                      (item: any) => item.cars.carRegistrationNumber
                    )}
                    description={
                      <>
                        <Typography>วันที่รับรถ - วันที่คืนรถ :</Typography>
                        <Typography>
                          {`${moment(item.orderRentItems.dateTimePickup).format(
                            "Do MM YYYY"
                          )} - ${moment(
                            item.orderRentItems.dateTimeReturn
                          ).format("Do MM YYYY")}`}
                        </Typography>
                      </>
                    }
                  />
                )}
              </List.Item>
            );
          }}
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
      label: "ต้องชำระ",
      children: generateListAndPagination(
        Array.isArray(userOrder)
          ? userOrder.filter((item: any) =>
              // item?.orderSatus === 5 &&
              // item?.confirmReturn === false &&
              // item?.orderRentItems.find(
              //   (_: any) => (rentItem: any) =>
              //     dayjs(rentItem.dateTimeReturn) <= dayjs() ||

              orderPast.find(
                (i: any) => i.orderRentId === item?.orderRentId && !i.paied
              )
            )
          : [],
        currentPage,
        itemsPerPage
      ),
    },
    {
      key: "2",
      label: "กำลังเช่า",
      children: generateListAndPagination(
        Array.isArray(userOrder)
          ? userOrder.filter(
              (item: any) =>
                item?.orderSatus === 2 &&
                item?.confirmReturn == false &&
                item?.orderRentItems.find(
                  (_: any) => (rentItem: any) =>
                    dayjs(rentItem.dateTimeReturn) <= dayjs()
                )
            )
          : [],
        currentPage,
        itemsPerPage
      ),
    },

    {
      key: "3",
      label: "คืนรถแล้ว",
      children: generateListAndPagination(
        Array.isArray(userOrder)
          ? userOrder.filter(
              (item: any) =>
                item?.orderSatus === 2 && item?.confirmReturn == true
            )
          : [],
        currentPage,
        itemsPerPage
      ),
    },
    {
      key: "4",
      label: "คืนรถล่าช้า",
      children: generateListAndPagination(
        Array.isArray(userOrder)
          ? userOrder.filter(
              (item: any) =>
                item?.orderSatus === 5 && item?.confirmReturn == true
            )
          : [],
        currentPage,
        itemsPerPage
      ),
    },
  ];

  return (
    <>
      <Card>
        <Tabs defaultActiveKey="1" items={items} />
        <Modal
          open={modals}
          onCancel={() => setModals(false)}
          width={1000}
          footer={null}
          wrapClassName="vertical-center-modal"
          title={`วันที่รับรถ - วันที่คืนรถ : ${moment(
            dataMo?.dateTimePickup
          ).format("Do MM YYYY")} - ${moment(dataMo?.dateTimeReturn).format(
            "Do MM YYYY"
          )}`}
        >
          <List
            itemLayout="vertical"
            size="large"
            pagination={{
              onChange: (page) => {
                console.log(page);
              },
              pageSize: 2,
            }}
            dataSource={dataMo?.orderRentItems}
            renderItem={(item: any) => {
              const image = PathImage.image + item.cars.imageCars[0].image;
              return (
                <>
                  <Card>
                    <List.Item
                      key={item.orderRentItemId}
                      extra={<img width={150} alt="รูปรถ" src={image} />}
                    >
                      <List.Item.Meta
                        key={item.orderRentItemId} // เพิ่ม key เพื่อระบุความแตกต่างของแต่ละ ListItemMeta
                      />
                      <Descriptions
                        title={`รถหมายเลขทะเบียน : ${item.cars.carRegistrationNumber}`}
                      >
                        <Descriptions.Item label="สถานที่รับรถ">
                          {item.placePickup}
                        </Descriptions.Item>
                        <Descriptions.Item label="สถานที่คืนรถ">
                          {item.placeReturn}
                        </Descriptions.Item>

                        <Descriptions.Item label="ยี่ห้อรถ">
                          {item.cars.carBrand}
                        </Descriptions.Item>
                        <Descriptions.Item label="ราคารถ">
                          {item.carsPrice} / วัน
                        </Descriptions.Item>

                        <Descriptions.Item label="คนขับรถ">
                          {item.driver.driverName}
                        </Descriptions.Item>
                      </Descriptions>
                    </List.Item>
                  </Card>
                </>
              );
            }}
          />
          {!orderPast?.find(
            (past: any) => past.orderRentId === dataMo?.orderRentId
          )?.paied &&
            !dataMo?.confirmReturn ? (
              <Row>
                <Button block type="primary" onClick={() => setPaymodal(true)}>
                  ชำระเงิน
                </Button>
              </Row>
            ):dataMo?.orderSatus === 2 && null}
        </Modal>
        {paymodal == true && (
          <OrderPastPaymentPage
            orderRentId={dataMo.orderRentId}
            visible={paymodal}
            cancel={setPaymodal}
          />
        )}
      </Card>
    </>
  );
};
