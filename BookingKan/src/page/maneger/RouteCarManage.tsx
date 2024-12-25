import { useEffect, useRef, useState } from "react";
import agent from "../../api/agent";
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  Row,
  Space,
  Switch,
  Table,
  message,
  notification,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { RouteCar } from "../../api/models/RouetCar";
import { ColumnType } from "antd/es/table";
import { FieldValues } from "react-hook-form";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import {
  createRouteAsync,
  updateIsUseRouteAsync,
  updateRouteAsync,
} from "../../api/redux/Slice/RouteCarSlice";
import { FilterConfirmProps } from "antd/es/table/interface";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

export const RouteCars = () => {
  const [routeCar, setRouteCar] = useState<RouteCar[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof RouteCar;
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [modals, setModal] = useState<any>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState<any>([]);
  useEffect(() => {
    agent.RoustCars.getRoute().then((route) => setRouteCar(route));
  }, []);

  console.log("dataEdit", dataEdit);

  useEffect(() => {
    if (modals || isModalOpen) {
      if (dataEdit.key === undefined) {
        form.setFieldsValue({
          routeCarsId: null,
          originName: null,
          destinationName: null,
          isUse: null,
        });
      } else {
        form.setFieldsValue({
          routeCarsId: dataEdit.key,
          originName: dataEdit.originName,
          destinationName: dataEdit.destinationName,
          isUse: dataEdit.isUse,
        });
      }
    }
  }, [modals, form, dataEdit, isModalOpen]);

  //#region  createDriver
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleEdit = (data: any) => {
    setDataEdit(data);
    setModal(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModal(false);
    setDataEdit([]);
  };
  const onFinish = async ({ originName, destinationName }: FieldValues) => {
    try {
      await dispatch(
        createRouteAsync({
          originName,
          destinationName,
        })
      ).then(() => {
        agent.RoustCars.getRoute().then((route) => setRouteCar(route));
        setIsModalOpen(false);
        setDataEdit([]);
        form.resetFields();
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

  //#region updateAnddelete

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการลบเส้นทางนี้?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบให้แน่ใจว่าคุณต้องการลบเส้นทางนี้",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่ ขอบคุณ",
      onOk() {
        agent.RoustCars.delete(record.key).then(() => {
          agent.RoustCars.getRoute().then((route) => setRouteCar(route));
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const update = async ({
    // routeCarsId,
    originName,
    destinationName,
  }: FieldValues) => {
    try {
      const routeCarsId = dataEdit.key
      console.log("routs", routeCarsId, originName, destinationName);

      await dispatch(
        updateRouteAsync({
          routeCarsId,
          originName,
          destinationName,
        })
      ).then(() => {
        agent.RoustCars.getRoute().then((route) => setRouteCar(route));
        setModal(false);
        setDataEdit([]);
        form.resetFields();
      });
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
        onClick={() => update(form)}
      >
        ตกลง
      </Button>
    );
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
    window.location.reload();
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): ColumnType<RouteCar> => ({
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
      title: "สถานีต้นทาง",
      dataIndex: "originName",
      key: "originName",
      width: "30%",
      ...getColumnSearchProps("originName"),
    },
    {
      title: "สถานีปลายทาง",
      dataIndex: "destinationName",
      key: "destinationName",
      width: "20%",
      ...getColumnSearchProps("destinationName"),
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
          dispatch(updateIsUseRouteAsync({ Id, isUse }));
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
          onClick={() => handleEdit(record)}
        >
          แก้ไข
        </Button>
      ),
      width: "10%",
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
      width: "10%",
    },
  ];

  const onCancleModal = () => {
    setModal(false);
    form.resetFields();
  };
  const data = routeCar.map((item) => {
    // console.log("item",item)
    return {
      key: item.routeCarsId,
      originName: item.originName,
      destinationName: item.destinationName,
      isUse: item.isUse,
    };
  });
  //#endregion

  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={showModal}
        >
          เพิ่มเส้นทาง
        </Button>
      </Row>

      <Modal
        title="เพิ่มเส้นทาง"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="originName" label="สถานที่ต้นทาง">
            <Input />
          </Form.Item>

          <Form.Item name="destinationName" label="สถานที่ปลายทาง">
            <Input />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              ตกลง
            </Button>
            <Button htmlType="button" onClick={onReset}>
              ล้าง
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {dataEdit && (
        <Modal
          title="แก้ไขเส้นทาง"
          centered
          open={modals}
          footer={false}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            name="validateOnly"
            layout="vertical"
            autoComplete="off"
            onFinish={update}
          >
            {/* <Form.Item initialValue={dataEdit?.key} name="key" label="รหัสเส้นทาง">
              <Input disabled />
            </Form.Item> */}
            <Form.Item
              initialValue={dataEdit?.originName}
              name="originName"
              label="สถานที่ต้นทาง"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={dataEdit?.destinationName}
              name="destinationName"
              label="สถานที่ปลายทาง"
            >
              <Input />
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

      <Table scroll={{ x: 1300 }} columns={columns} dataSource={data} />
    </>
  );
};
