import {
  Button,
  Form,
  Input,
  InputNumber,
  InputRef,
  Modal,
  Row,
  Space,
  Table,
  TableProps,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import agent from "../../api/agent";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { FieldValues } from "react-hook-form";
import {
  createAndUpdateClassCarsAsync,
  fetchClassCars,
} from "../../api/redux/Slice/CarsSlice";
import Highlighter from "react-highlight-words";
import { FilterDropdownProps } from "antd/es/table/interface";

export const ClassCarsManage = () => {
  const [classCar, setClassCar] = useState([]);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>([]);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { confirm } = Modal;
  useEffect(() => {
    agent.Cars.getClass().then((item) => setClassCar(item));
  }, []);

  // console.log("dataEdit", dataEdit);

  const handleEdit = (data: any) => {
    setModalEdit(true);
    setDataEdit(data);
  };
console.log("dataEdit",dataEdit?.key);

  useEffect(() => {
    if (modalEdit || modalCreate) {
      if (dataEdit.key != undefined) {
        form.setFieldsValue({
          classCarsId: dataEdit.key,
          className: dataEdit.className,
          price: dataEdit.price,
        });
      } else {
        form.setFieldsValue({
          classCarsId: null,
          className: null,
          price: null,
        });
      }
    }
  }, [modalEdit,dataEdit, modalEdit,modalCreate]);

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการลบคลาสรถนี้ ?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบให้แน่ใจว่าคุณต้องการลบคลาสรถนี้",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่ ขอบคุณ",
      onOk() {
        agent.Cars.deleteClass(record.key).then(() => {
          agent.Cars.getClass().then((item) => setClassCar(item));
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const onFinishCreate = async ({ className, price }: FieldValues) => {
    try {
      // console.log("className", className, "price", price, "key", key);
      const classCarsId = dataEdit?.key;
      if (classCarsId === undefined) {
        classCarsId == 0;
      }
      await dispatch(
        createAndUpdateClassCarsAsync({ classCarsId, className, price })
      ).then(() => {
        // form.resetFields();
    
        setModalCreate(false);
        setModalEdit(false);
        setDataEdit([])
        agent.Cars.getClass().then((item) => setClassCar(item));
        // setModalCreate(false)
      });
    } catch (error: any) {
      console.log("e", error);
    }
  };

  //#region tables

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
              dispatch(fetchClassCars());
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

  const dataSource = classCar.map((iClass: any) => {
    return {
      key: iClass.classCarsId,
      className: iClass.className,
      price: iClass.price,
    };
  });

  const columns = [
    {
      title: "ชื่อคลาส",
      dataIndex: "className",
      key: "className",
      ...getColumnSearchProps("className", "ชื่อคลาส"),
    },
    {
      title: "ราคา",
      dataIndex: "price",
      key: "price",
      sorter: (a: any, b: any) => a.price - b.price,
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

  //#endregion

  const onCancleModal = () => {
    setModalCreate(false);
    setModalEdit(false);
    setDataEdit([])
    // form.resetFields();
    // setDataEdit(null)
  };

  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={() => setModalCreate(true)}
        >
          เพิ่มคลาสรถ
        </Button>
      </Row>
      <Table scroll={{ x: 1300 }} dataSource={dataSource} columns={columns} />
      <Modal
        open={modalCreate}
        onCancel={onCancleModal}
        footer={false}
        width={900}
        wrapClassName="vertical-center-modal"
      >
        <Form form={form} onFinish={onFinishCreate} style={{ margin: 10 }}>
          <Form.Item name="className" label="ชื่อคลาสรถ">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="ราคา">
            <InputNumber prefix="฿" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                สร้าง
              </Button>
              <Button htmlType="reset">ล้าง</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={modalEdit}
        onCancel={onCancleModal}
        footer={false}
        width={900}
        wrapClassName="vertical-center-modal"
      >
        <Form form={form} onFinish={onFinishCreate} style={{ margin: 10 }}>
          {/* <Form.Item initialValue={dataEdit?.key} name="key" label="รหัสคลาสรถ">
            <Input disabled />
          </Form.Item> */}
          <Form.Item
            initialValue={dataEdit?.className}
            name="className"
            label="ชื่อคลาสรถ"
          >
            <Input />
          </Form.Item>
          <Form.Item initialValue={dataEdit?.price} name="price" label="ราคา">
            <InputNumber prefix="฿" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                แก้ไข
              </Button>
              <Button htmlType="reset">ล้าง</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
