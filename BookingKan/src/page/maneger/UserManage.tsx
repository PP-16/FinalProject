import React, { useEffect, useRef, useState } from "react";
import { Passentger, Role } from "../../api/models/Passentger";
import agent from "../../api/agent";
import {
  Button,
  Dropdown,
  Input,
  InputRef,
  MenuProps,
  Space,
  Switch,
  Table,
  TableColumnType,
  Typography,
  message,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FilterDropdownProps } from "antd/es/table/interface";
import Item from "antd/es/list/Item";
import { it } from "node:test";
import { useAppDispatch } from "../../api/redux/Store/configureStore";
import {
  updateIsUseAsync,
  updateRoleAsync,
} from "../../api/redux/Slice/AccountSlice";

export const UserManage = () => {
  const [passenger, setPassenger] = useState<Passentger[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    agent.Account.getAllUser().then((pass) => setPassenger(pass));
    agent.Account.getRole().then((role) => setRoles(role));
  }, []);

  // console.log("roles", roles);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  type DataIndex = keyof Passentger;
  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
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
    dataIndex: DataIndex
  ): TableColumnType<Passentger> => ({
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

  const generateMenuProps = (record: any) => {
    // console.log("record", record.key);
    const items = roles.map((item) => ({
      label: item.roleNameTH,
      key: item.roleId,
      icon: <UserOutlined />,
    }));

    return {
      items,
      onClick:  (item:any) => handleMenuClick(item, record.key),
    };
  };

  const handleMenuClick = (item: any, passengerKey: any) => {
    // console.log("click", item, "Passenger Key:", passengerKey);
    const roleId = Number(item.key);
    const passentgerId = passengerKey
     dispatch(updateRoleAsync({ roleId,passentgerId })).then(()=>{
      agent.Account.getAllUser().then((pass) => setPassenger(pass));
     });
  };

  const columns = [
    {
      title: "ชื่อผู้โดยสาร",
      dataIndex: "passengerName",
      key: "passengerName",
      ...getColumnSearchProps("passengerName"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    // {
    //   title: "หมายเลขบัตรประชาชน",
    //   dataIndex: "idCardNumber",
    //   key: "idCardNumber",
    //   ...getColumnSearchProps("idCardNumber"),
    // },
    {
      title: "เบอร์โทรศัพท์",
      dataIndex: "phone",
      key: "phone",
      ...getColumnSearchProps("phone"),
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
          dispatch(updateIsUseAsync({ Id, isUse })).then(()=>{ agent.Account.getAllUser().then((pass) => setPassenger(pass));});
        };
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
      title: "บทบาท",
      dataIndex: "roleNameTH",
      key: "roleNameTH",
      render: (text: any, record: any) => {
        return (
          <>
            <Dropdown.Button
              menu={generateMenuProps(record)}
              placement="bottom"
              icon={<EditOutlined />}
            >
              {text}
            </Dropdown.Button>
          </>
        );
      },
    },
  ];

  const data:any = passenger.map((item) => {
    return {
      key: item.passengerId,
      email: item.email,
      idCardNumber: item.idCardNumber,
      isUse: item.isUse,
      passengerName: item.passengerName,
      phone: item.phone,
      roleId: item.roleId,
      roleName: item.roles.roleName,
      roleNameTH: item.roles.roleNameTH,
    };
  });

  return (
    <>
      <Table columns={columns} dataSource={data}  scroll={{ x: 1300 }} />
    </>
  );
};
