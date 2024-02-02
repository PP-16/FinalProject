import {
  Button,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
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
import {
  ColumnType,
  FilterConfirmProps,
} from "antd/es/table/interface";
import Highlighter from "react-highlight-words";
import { CheckOutlined, CloseOutlined, ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";

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
  const { confirm } = Modal;
  //#region  createDriver
  const handleChangeStatus = (value: any) => {
    console.log(`selectedStatus ${value}`);
    setStatusDriver(value);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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
      ).then((action: any) => {
        if (createDriverAsync.fulfilled.match(action)) {
          message.success("Submit success!");
          window.location.reload();
          setModal(false);
        }
        if (createDriverAsync.rejected.match(action)) {
          notification.error({
            message: `Submit failed!`,
            description: "Please Check you anser agian!!",
            placement: "top",
          });
        }
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

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Drivers> => ({
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
          placeholder={`Search ${dataIndex}`}
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
      ...getColumnSearchProps("driverName"),
    },
    {
      title: "หมายเลขบัตรประชาชน",
      dataIndex: "idCardNumber",
      key: "idCardNumber",
    },
    {
      title: "ค่าจ้าง",
      dataIndex: "charges",
      key: "charges",
      sorter: true,
      // sorter: (a, b) => a.charges.length - b.charges.length,
      ...getColumnSearchProps("charges"),
    },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "ที่อยู่ปัจจุบัน",
      dataIndex: "address",
      key: "address",
      ...getColumnSearchProps("address"),

      sortDirections: ["descend", "ascend"],
    },
    {
      title: "สถานะ",
      dataIndex: "statusDriver",
      key: "statusDriver",
    },
    {
      title: "เปิดใช้งาน",
      dataIndex: "isUse",
      key: "isUse",
      render: (record: boolean, text: any) => {
        const onChange = (checked: boolean) => {
          console.log("เปลี่ยนแปลงแล้ว:", checked, "Record Key:", text.key);
          const Id = text.key;
          const isUse = checked;
           dispatch(updateIsUseDriverAsync({ Id, isUse }));
        };
        console.log("record",record);
        
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
      render: (text: any, record: any) => (
        <Button type="dashed" onClick={() => setModal(record)}>
          แก้ไข
        </Button>
      ),
      width: 100,
    },
    {
      title: "ลบ",
      key: "operation",
      render: (text: any, record: any) => (
        <Button
          style={{ color: "whitesmoke", backgroundColor: "red" }}
          onClick={() => showDeleteConfirm(record)}
        >
          ลบ
        </Button>
      ),
      width: 100,
    },
  ];

  const data = driver.map((item) => {
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
        isUse:item.isUse
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
        isUse:item.isUse
      };
    }
  });

  console.log("modal", modals);
  //#endregion

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
        agent.Drivers.delete(record.key)
        window.location.reload()
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  const update = async ({
    driverId,
    driverName,
    idCardNumber,
    charges,
    address,
    phone,
    statusDriver,
  }: FieldValues) => {
    try {
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
      ).then((action: any) => {
        if (updateDriverAsync.fulfilled.match(action)) {
          message.success("Submit success!")
        }
        if (updateDriverAsync.rejected.match(action)) {
          notification.error({
            message: `Submit failed!`,
            description: "Please Check you anser agian!!",
            placement: "top",
          });
        }
      });
      window.location.reload()
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
        onClick={() => update(form)}
      >
        Submit
      </Button>
    );
  };
  //#endregion

  useEffect(() => {
    agent.Drivers.getDriver().then((driver) => setDriver(driver));
  }, []);

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Driver
      </Button>
      <Modal
        title="Add Driver"
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
          <Form.Item name="driverName" label="driverName">
            <Input />
          </Form.Item>

          <Form.Item name="idCardNumber" label="idCardNumber">
            <Input />
          </Form.Item>

          <Form.Item name="charges" label="charges">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="address">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="phone">
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

      {modals && (
        <Modal
          title="Edit Driver"
          centered
          visible={modals}
          onOk={() => setModal(false)}
          onCancel={() => setModal(false)}
        >
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            onFinish={update}
          >
            <Form.Item
              initialValue={modals.key}
              name="driverId"
              label="driverId"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              initialValue={modals.driverName}
              name="driverName"
              label="driverName"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={modals.idCardNumber}
              name="idCardNumber"
              label="idCardNumber"
            >
              <Input disabled/>
            </Form.Item>

            <Form.Item
              initialValue={modals.charges}
              name="charges"
              label="charges"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={modals.address}
              name="address"
              label="address"
            >
              <Input />
            </Form.Item>

            <Form.Item initialValue={modals.phone} name="phone" label="phone">
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
                <Button htmlType="reset">Reset</Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      )}
      <Table columns={columns} dataSource={data} />
    </>
  );
};
