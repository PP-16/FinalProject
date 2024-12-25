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
  message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import agent from "../../api/agent";
import { Role } from "../../api/models/Passentger";
import { ExclamationCircleFilled, SearchOutlined } from "@ant-design/icons";
import { FieldValues } from "react-hook-form";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import { CreateRole } from "../../api/redux/Slice/AccountSlice";
import Highlighter from "react-highlight-words";
import { FilterDropdownProps } from "antd/es/table/interface";

export const RoleUserManage = () => {
  const [role, setRole] = useState<Role[]>([]);
  const [modalCreate, setModalCreate] = useState(false);
  const [modalEdit, setModalEdit] = useState<any>(false);
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { confirm } = Modal;
  useEffect(() => {
    agent.Account.getRole().then((item) => setRole(item));
  }, []);

  // console.log("role", role);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const onFinishCreate = async ({ key, roleName, roleNameTH }: FieldValues) => {
    try {
      // console.log("rolenameTH", roleNameTH, "rolename", roleName, "key", key);
      const roleId = key;
      if (roleId === undefined) {
        roleId == 0;
      }
      await dispatch(CreateRole({ roleId, roleName, roleNameTH })).then(() => {
        form.resetFields();
        agent.Account.getRole().then(
          (item) => setRole(item)
          
        );
        setModalCreate(false)
        setModalEdit(false)
      });
    } catch (error: any) {
      console.log("e", error);
    }
  };
  const showDeleteConfirm = (record: any) => {
    confirm({
      title: "ต้องการลบบทบาทนี้ ?",
      icon: <ExclamationCircleFilled />,
      content: "กรุณาตรวจสอบให้แน่ใจว่าคุณต้องการลบบทบาทนี้",
      okText: "ตกลง",
      okType: "danger",
      cancelText: "ไม่ ขอบคุณ",
      onOk() {
        agent.Account.deleteRole(record.key).then(() => {
          agent.Account.getRole().then((item) => setRole(item));
        });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: any,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: any,textPlaceholder:any): any => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }:any) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`ค้นหา${textPlaceholder}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
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
              close();
             
            }}
          >
            ปิด
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value:any, record:any) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible:any) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text:any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const dataSource = role.map((role) => {
    return {
      key: role.roleId,
      roleNameTH: role.roleNameTH,
      roleName: role.roleName,
    };
  });

  const columns = [
    {
      title: "ชื่อบทบาท",
      dataIndex: "roleNameTH",
      key: "roleNameTH",
      ...getColumnSearchProps('roleNameTH',"ชื่อบทบาท"),
    },
    {
      title: "ชื่อบทบาท(ภาษาอังกฤษ)",
      dataIndex: "roleName",
      key: "roleName",
      ...getColumnSearchProps('roleName',"ชื่อบทบาท(ภาษาอังกฤษ)"),
    },
    {
      title: "แก้ไข",
      key: "operation",
      render: (_: any, record: any) => (
        <Button
          type="dashed"
          style={{ backgroundColor: "#faad14" }}
          onClick={() => {
            form.setFieldsValue({
              key: record.key,
              roleNameTH: record.roleNameTH,
              roleName: record.roleName,
            });
            setModalEdit(true);
          }}
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
    setModalEdit(false);
    form.resetFields();
  };
  return (
    <>
      <Row style={{ justifyContent: "flex-end", margin: 10 }}>
        <Button
          type="primary"
          style={{ backgroundColor: "#4F6F52" }}
          onClick={() => setModalCreate(true)}
        >
          สร้างบทบาท
        </Button>
      </Row>
      <Table scroll={{ x: 1300 }} dataSource={dataSource} columns={columns} />;
      <Modal
        open={modalCreate}
        onCancel={() => setModalCreate(false)}
        footer={false}
        width={900}
        wrapClassName="vertical-center-modal"
      >
        <Form
          {...formItemLayout}
          form={form}
          onFinish={onFinishCreate}
          style={{ margin: 10 }}
        >
          <Form.Item
            // initialValue={modalCreate.roleNameTH}
            label="ชื่อบทบาท"
            name="roleNameTH"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            // initialValue={modalCreate.roleName}
            label="ชื่อบทบาท(ภาษาอังกฤษ)"
            name="roleName"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">Reset</Button>
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
        <Form
          {...formItemLayout}
          form={form}
          onFinish={onFinishCreate}
          style={{ margin: 10 }}
        >
          <Form.Item initialValue={modalEdit.key} name="key" label="รหัสบทบาท">
            <Input disabled />
          </Form.Item>
          <Form.Item
            initialValue={modalEdit.roleNameTH}
            label="ชื่อบทบาท"
            name="roleNameTH"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            initialValue={modalEdit.roleName}
            label="ชื่อบทบาท(ภาษาอังกฤษ)"
            name="roleName"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
