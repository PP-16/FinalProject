import {
  Button,
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
  message,
  notification,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { FieldValues } from "react-hook-form";
import agent from "../../api/agent";
import { Drivers } from "../../api/models/Drivers";
import {
  createDriverAsync,
  updateDriverAsync,
  updateIsUseDriverAsync,
} from "../../api/redux/Slice/DriverSilce";
import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const Driver = () => {
  const [driver, setDriver] = useState<Drivers[]>([]);
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [statusDriver, setStatusDriver] = useState("");
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof Drivers;
  const [modals, setModal] = useState(false);
  const [dataModals, setDataModals] = useState<any>([]);

  const handleModalEdit = (data: any) => {
    setModal(true);
    setDataModals(data);
  };
  const { confirm } = Modal;
  //#region  createDriver
  const handleChangeStatus = (value: any) => {
    // console.log(`selectedStatus ${value}`);
    setStatusDriver(value);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setModal(false);
    setIsModalOpen(false);
    form.resetFields();
    setDataModals([]);
  };
  const onFinish = async ({
    driverName,
    idCardNumber,
    charges,
    address,
    phone,
    statusDriver,
  }: FieldValues) => {
    try {
      await dispatch(
        createDriverAsync({
          driverName,
          idCardNumber,
          charges,
          address,
          phone,
          statusDriver,
        })
      ).then(() => {
        form.resetFields();
        setDataModals([]);
        agent.Drivers.getDriver().then((driver) => setDriver(driver));
        setIsModalOpen(false);
        setModal(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onReset = () => {
    form.resetFields();
  };
  //#endregion

  //#region  table
  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex,
    textPlaceholder: any
  ): ColumnType<Drivers> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${textPlaceholder}`}
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
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
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
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
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

  const columns: any = [
    {
      title: "ชื่อคนขับ",
      dataIndex: "driverName",
      key: "driverName",
      ...getColumnSearchProps("driverName", "ชื่อคนขับ"),
    },
    {
      title: "หมายเลขบัตรประชาชน",
      dataIndex: "idCardNumber",
      key: "idCardNumber",
      ...getColumnSearchProps("idCardNumber", "หมายเลขบัตรประชาชน"),
    },
    {
      title: "ค่าจ้าง",
      dataIndex: "charges",
      key: "charges",
      // sorter: true,
      sorter: (a: any, b: any) => a.charges - b.charges,
      ...getColumnSearchProps("charges", "ค่าจ้าง"),
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone", "เบอร์โทรศัพท์"),
    },
    {
      title: "ที่อยู่ปัจจุบัน",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address", "ที่อยู่ปัจจุบัน"),
    },
    {
      title: "สถานะ",
      dataIndex: "statusDriver",
      key: "statusDriver",
      filters: [
        {
          text: "ว่าง",
          value: "ว่าง",
        },
        {
          text: "ไม่ว่าง",
          value: "ไม่ว่าง",
        },
      ],
      onFilter: (value: string, record: any) =>
        record.statusDriver.startsWith(value),
      filterSearch: true,
    },
    {
      title: "เปิดใช้งาน",
      dataIndex: "isUse",
      key: "isUse",
      render: (record: boolean, text: any) => {
        const onChange = (checked: boolean) => {
          // console.log("เปลี่ยนแปลงแล้ว:", checked, "Record Key:", text.key);
          const Id = text.key;
          const isUse = checked;
          dispatch(updateIsUseDriverAsync({ Id, isUse }));
        };
        // console.log("record", record);

        return (
          <>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              onChange={onChange}
              defaultChecked={record}
            />
          </>
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
          onClick={() => handleModalEdit(record)}
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

  const data: any = driver.map((item: any) => {
    const status = item.statusDriver;
    // console.log("dristatus",status)
    if (status == 0) {
      return {
        key: item.driverId,
        driverName: item.driverName,
        idCardNumber: item.idCardNumber,
        address: item.address,
        charges: item.charges,
        phone: item.phone,
        statusDriver: "ว่าง",
        isUse: item.isUse,
      };
    }
    if (status == 1) {
      return {
        key: item.driverId,
        driverName: item.driverName,
        idCardNumber: item.idCardNumber,
        address: item.address,
        charges: item.charges,
        phone: item.phone,
        statusDriver: "ไม่ว่าง",
        isUse: item.isUse,
      };
    }
  });

  //#endregion

  console.log("dataModals.key", dataModals.key);

  useEffect(() => {
    if (modals || isModalOpen) {
      if (dataModals.key === undefined) {
        form.setFieldsValue({
          key: "" || null,
          driverName: "" || null,
          idCardNumber: "" || null,
          address: "" || null,
          charges: "" || null,
          phone: "" || null,
          statusDriver: "" || null,
          isUse: "" || null,
        });
      } else {
        form.setFieldsValue({
          key: dataModals?.driverId,
          driverName: dataModals?.driverName,
          idCardNumber: dataModals?.idCardNumber,
          address: dataModals?.address,
          charges: dataModals?.charges,
          phone: dataModals?.phone,
          statusDriver: dataModals?.statusDriver,
          isUse: dataModals?.isUse,
        });
      }
    }
  }, [dataModals, form, modals, isModalOpen]);

  //#region update

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        agent.Drivers.delete(record.key).then(() => {
          agent.Drivers.getDriver().then((driver) => setDriver(driver));
        });

        // window.location.reload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const update = async ({
    // driverId,
    driverName,
    idCardNumber,
    charges,
    address,
    phone,
    statusDriver,
  }: FieldValues) => {
    try {
      const driverId = dataModals?.key;
      if (driverId === undefined) {
        driverId == 0;
      }
      statusDriver = "ว่าง" ? 0 : 1

      await dispatch(
        updateDriverAsync({
          driverId,
          driverName,
          idCardNumber,
          charges,
          address,
          phone,
          statusDriver,
        })
      ).then(async() => {
      await  agent.Drivers.getDriver().then((driver) => setDriver(driver));
        setDataModals([]);
      });
      setModal(false)
      // window.location.reload();
    } catch (error: any) {
      console.log("e", error);
    }
  };
  const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = useState(false);

    // Watch all values
    const values = Form.useWatch([], form);

    useEffect(() => {
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
        // onClick={() => update(form)}
      >
        ตกลง
      </Button>
    );
  };
  //#endregion

  useEffect(() => {
    agent.Drivers.getDriver().then((driver) => setDriver(driver));
  }, []);

  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={showModal}
        >
          เพิ่มคนขับรถ
        </Button>
      </Row>

      <Modal
        title="เพิ่มคนขับรถ"
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
          <Form.Item name="driverName" label="ชื่อคนขับ">
            <Input />
          </Form.Item>

          <Form.Item name="idCardNumber" label="หมายเลขบัตรประชาชน">
            <Input />
          </Form.Item>

          <Form.Item name="charges" label="ค่าจ้าง / วัน">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="ที่อยู่">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="เบอร์โทรศัพท์">
            <Input />
          </Form.Item>

          {/* <Form.Item name="statusDriver" label="statusDriver">
            <Select
              value={{ key: statusDriver }}
              style={{ width: 200 }}
              onChange={handleChangeStatus}
              size="large"
              options={[
                { value: 0, label: "ว่าง" },
                { value: 1, label: "ไม่ว่าง" },
              ]}
            />
          </Form.Item> */}

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

      {dataModals && (
        <Modal
          title="แก้ไขข้อมูลคนขับรถ"
          centered
          open={modals}
          onOk={() => setModal(false)}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            onFinish={update}
          >
            {/* <Form.Item
              initialValue={dataModals.key}
              name="driverId"
              label="รหัสคนขับ"
            >
              <Input disabled />
            </Form.Item> */}
            <Form.Item
              initialValue={dataModals?.driverName}
              name="driverName"
              label="ชื่อคนขับ"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={dataModals?.idCardNumber}
              name="idCardNumber"
              label="หมายเลขบัตรประชาชน"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              initialValue={dataModals?.charges}
              name="charges"
              label="ค่าจ้าง / วัน"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={dataModals?.address}
              name="address"
              label="ที่อยู่"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={dataModals?.phone}
              name="phone"
              label="เบอร์โทรศัพท์"
            >
              <Input />
            </Form.Item>

            <Form.Item name="statusDriver" label="statusDriver">
              <Select
                value={{ key: statusDriver }}
                style={{ width: 200 }}
                onChange={handleChangeStatus}
                size="large"
                options={[
                  { value: 0, label: "ว่าง" },
                  { value: 1, label: "ไม่ว่าง" },
                ]}
              />
            </Form.Item>

            <Form.Item>
              <Space>
                <SubmitButton form={form} />
                <Button htmlType="reset">ล้าง</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} />
    </>
  );
};
