import { useEffect, useRef, useState } from "react";
import agent from "../../api/agent";
import {
  Button,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  Space,
  Table,
  message,
  notification,
} from "antd";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { RouteCar } from "../../api/models/RouetCar";
import { ColumnType } from "antd/es/table";
import { FieldValues } from "react-hook-form";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import {
  createRouteAsync,
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
  const [modals, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    agent.RoustCars.getRoute().then((route) => setRouteCar(route));
  }, []);

  //#region  createDriver
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async ({ originName, destinationName }: FieldValues) => {
    try {
      await dispatch(
        createRouteAsync({
          originName,
          destinationName,
        })
      ).then((action: any) => {
        if (createRouteAsync.fulfilled.match(action)) {
          message.success("Submit success!");
          window.location.reload();
          setModal(false);
        }
        if (createRouteAsync.rejected.match(action)) {
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

  //#region updateAnddelete

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "Are you sure delete this task?",
      icon: <ExclamationCircleFilled />,
      content: "Some descriptions",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        agent.RoustCars.delete(record.key);
        window.location.reload();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const update = async ({
    routeCarsId,
    originName,
    destinationName,
  }: FieldValues) => {
    try {
      console.log("routs", routeCarsId, originName, destinationName);
      await dispatch(
        updateRouteAsync({
          routeCarsId,
          originName,
          destinationName,
        })
      ).then((action: any) => {
        if (updateRouteAsync.fulfilled.match(action)) {
          message.success("Submit success!");
        }
        if (updateRouteAsync.rejected.match(action)) {
          notification.error({
            message: `Submit failed!`,
            description: "Please Check you anser agian!!",
            placement: "top",
          });
        }
      });
      window.location.reload();
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
      title: "แก้ไข",
      key: "operation",
      render: (text: any, record: any) => (
        <Button type="dashed" onClick={() => setModal(record)}>
          แก้ไข
        </Button>
      ),
      width: "10%",
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
      width: "10%",
    },
  ];

  const data = routeCar.map((item) => {
    // console.log("item",item)
    return {
      key: item.routeCarsId,
      originName: item.originName,
      destinationName: item.destinationName,
    };
  });
  //#endregion

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
          <Form.Item name="originName" label="originName">
            <Input />
          </Form.Item>

          <Form.Item name="destinationName" label="destinationName">
            <Input />
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
          title="Edit RouteCar"
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
              name="routeCarsId"
              label="routeCarsId"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              initialValue={modals.originName}
              name="originName"
              label="originName"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={modals.destinationName}
              name="destinationName"
              label="destinationName"
            >
              <Input />
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
