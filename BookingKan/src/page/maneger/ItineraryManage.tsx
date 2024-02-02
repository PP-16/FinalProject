import { ColumnType, FilterConfirmProps } from "antd/es/table/interface";
import { Itinerary } from "../../api/models/Itinerary";
import {
  Badge,
  Button,
  Dropdown,
  Form,
  FormInstance,
  Input,
  InputRef,
  Modal,
  Space,
  Switch,
  Table,
  TableColumnsType,
  message,
  notification,
} from "antd";
import { CheckOutlined, CloseOutlined, DownOutlined, SearchOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import Highlighter from "react-highlight-words";
import agent from "../../api/agent";
import moment from "moment";
import {
  createItineraryAsync,
  updateIsUseItinararyAsync,
  updateItineraryAsync,
} from "../../api/redux/Slice/ItinerarySlice";
import { FieldValues } from "react-hook-form";

export const Itinerarys = () => {
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof Itinerary;
  const { confirm } = Modal;
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [modals, setModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //#region  createDriver
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onFinish = async ({
    itineraryId,
    issueTime,
    arrivalTime,
    routeCarsId,
    carsId,
  }: FieldValues) => {
    try {
      await dispatch(
        createItineraryAsync({
          itineraryId,
          issueTime,
          arrivalTime,
          routeCarsId,
          carsId,
        })
      ).then((action: any) => {
        if (createItineraryAsync.fulfilled.match(action)) {
          message.success("Submit success!");
          window.location.reload();
          setModal(false);
        }
        if (createItineraryAsync.rejected.match(action)) {
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
    itineraryId,
    issueTime,
    arrivalTime,
    routeCarsId,
    carsId,
  }: FieldValues) => {
    try {
      console.log(
        "itinerarydata",
        itineraryId,
        issueTime,
        arrivalTime,
        routeCarsId,
        carsId
      );
      await dispatch(
        updateItineraryAsync({
          itineraryId,
          issueTime,
          arrivalTime,
          routeCarsId,
          carsId,
        })
      ).then((action: any) => {
        if (updateItineraryAsync.fulfilled.match(action)) {
          message.success("Submit success!");
        }
        if (updateItineraryAsync.rejected.match(action)) {
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

  //#region table
  const expandedRowRender = (record: any) => {
    console.log("re", record);

    const columns: TableColumnsType<Itinerary> = [
      {
        title: "เวลาที่ออกเดินทาง",
        dataIndex: "arrivalTime",
        key: "arrivalTime",
        width: "30%",
        ...getColumnSearchProps("arrivalTime"),
      },
      {
        title: "เวลาที่ไปถึง",
        dataIndex: "issueTime",
        key: "issueTime",
        width: "20%",
        ...getColumnSearchProps("issueTime"),
      },
      {
        title: "จำนวณที่นั่ง",
        dataIndex: "quantitySeat",
        key: "quantitySeat",
        width: "30%",
      },
    ];

    const dataexpan = [
      {
        key: record.key,
        carRegistrationNumber: record.carRegistrationNumber,
        priceSeat: record.priceSeat,
        quantitySeat: record.quantitySeat,
        arrivalTime: record.arrivalTime,
        issueTime: record.issueTime,
        originName: record.originName,
        destinationName: record.destinationName,
      },
    ];

    return (
      <Table columns={columns} dataSource={dataexpan} pagination={false} />
    );
  };

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
  ): ColumnType<Itinerary> => ({
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
      ...getColumnSearchProps("originName"),
    },
    {
      title: "สถานีปลายทาง",
      dataIndex: "destinationName",
      key: "destinationName",
      ...getColumnSearchProps("destinationName"),
    },
    {
      title: "หมายเลขทะเบียนรถ",
      dataIndex: "carRegistrationNumber",
      key: "carRegistrationNumber",
      ...getColumnSearchProps("carRegistrationNumber"),
    },
    {
      title: "ราคาต่อที่นั่ง",
      dataIndex: "priceSeat",
      key: "priceSeat",

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
           dispatch(updateIsUseItinararyAsync({ Id, isUse }));
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

  const data = itinerary.map((item) => {
    const dateArrival = moment(item.arrivalTime).format("LT");
    const dateIssuel = moment(item.issueTime).format("LT");

    return {
      key: item.itineraryId,
      carRegistrationNumber: item.cars.carRegistrationNumber,
      priceSeat: item.cars.priceSeat,
      quantitySeat: item.cars.quantitySeat,
      arrivalTime: dateArrival,
      issueTime: dateIssuel,
      originName: item.routeCars.originName,
      destinationName: item.routeCars.destinationName,
      isUse:item.isUse
    };
  });
  //#endregion

  useEffect(() => {
    agent.Itinerarys.getItinarery().then((itinerary) =>
      setItinerary(itinerary)
    );
  }, []);

  console.log("itinerary", itinerary);
  console.log("modals", modals);
  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{ expandedRowRender }}
      />

      {modals && (
        <Modal
          title="Edit Itinerary"
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
              name="itineraryId"
              label="itineraryId"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              initialValue={modals.issueTime}
              name="issueTime"
              label="issueTime"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={modals.arrivalTime}
              name="arrivalTime"
              label="arrivalTime"
            >
              <Input />
            </Form.Item>

            <Form.Item
              initialValue={modals.routeCarsId}
              name="routeCarsId"
              label="routeCarsId"
            >
              <Input />
            </Form.Item>
            <Form.Item
              initialValue={modals.carsId}
              name="carsId"
              label="carsId"
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
    </>
  );
};
