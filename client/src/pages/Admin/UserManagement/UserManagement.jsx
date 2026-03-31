import React, { useState } from "react";
import { Tabs, Input, Button } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import MasterUsers from "./MasterUsers/MasterUsers";
import HotelUsers from "./HotelUsers/HotelUsers";
import PendingStaff from "./PendingStaff/PendingStaff";
import BlockedUsers from "./BlockedUsers/BlockedUsers";
const { Search } = Input;

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState(
    localStorage.getItem("activeTab") || "1",
  );

  const [searchText, setSearchText] = useState("");
  const [searchValue, setSearchValue] = useState(""); //**actual applied search

  const navigate = useNavigate();

  const getButtonText = () => {
    if (activeTab === "1") return "Master User";
    if (activeTab === "2") return "Hotel User Create";
    return "";
  };

  return (
    <div style={{ background: "#fff", padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2>User Management</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <Search
            placeholder="Search user"
            allowClear
            enterButton
            autoFocus
            style={{ width: 250, height: 33 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={(value) => setSearchValue(value)}
          />
          {(activeTab === "1" || activeTab === "2") && (
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() =>
                navigate(
                  activeTab === "1"
                    ? "/admin/create-master"
                    : "/admin/create-hotel",
                )
              }
            >
              {getButtonText()}
            </Button>
          )}
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
          localStorage.setItem("activeTab", key);
        }}
        items={[
          {
            key: "1",
            label: "Master Users",
            children: <MasterUsers searchText={searchValue} />, //**FIX
          },
          {
            key: "2",
            label: "Hotel Users",
            children: <HotelUsers searchText={searchValue} />, //**FIX
          },
          {
            key: "3",
            label: "Pending Staff",
            children: <PendingStaff searchText={searchValue} />, //**FIX
          },
          {
            key: "4",
            label: "Blocked Users",
            children: <BlockedUsers searchText={searchValue} />, //**FIX
          },
        ]}
      />
    </div>
  );
};

export default UserManagement;
