import { Button, Drawer, Dropdown, Menu } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/logo3.png";
import {
  MenuOutlined,
  UserOutlined,
  BookOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useData } from "../../datacontect";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  const isActive = (path) => location.pathname === path;
  const {user,fetchUserData} = useData()
  const token = localStorage.getItem("token");
  const phone = localStorage.getItem("phone") || "+998";
  useEffect(() => {
    fetchUserData();
  }, [token]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    localStorage.removeItem("phone");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("refresh");
    localStorage.removeItem("locate");
    navigate("/");
  };

  const userMenu = (
    <Menu>
      <Menu.Item
        key="1"
        icon={<BookOutlined />}
        onClick={() => navigate("/my-courses")}
      >
        Kurslarim
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<UserOutlined />}
        onClick={() => navigate("/profilim")}
      >
        Profilim
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<LogoutOutlined />} onClick={handleLogout}>
        Chiqish
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-[999]">
        <div className="w-full md:w-[90%] m-auto h-16 md:h-20 flex items-center justify-between px-4 md:px-0">
          <Link to="/">
            <img
              className="w-40 md:w-52 hover:opacity-90 transition-opacity"
              src={logo}
              alt="Logo"
            />
          </Link>

          <nav className="hidden sm:flex items-center gap-8 md:gap-16 text-sm md:text-base lg:text-lg font-medium text-gray-600">
            <Link
              to="/"
              className={`relative group ${
                isActive("/") ? "text-blue-500" : ""
              }`}
            >
              Bosh sahifa
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 ${
                  isActive("/") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to="/kurslar"
              className={`relative group ${
                isActive("/kurslar") ? "text-blue-500" : ""
              }`}
            >
              Kurslar
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 ${
                  isActive("/kurslar") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>

            <Link
              to="/blog"
              className={`relative group ${
                isActive("/blog") ? "text-blue-500" : ""
              }`}
            >
              Maqolalar
              <span
                className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 transition-all duration-300 ${
                  isActive("/blog") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Dropdown
                  overlay={userMenu}
                  trigger={["click"]}
                  placement="bottomRight"
                >
                  <Button
                    className="hidden sm:block w-[60px] h-9 hover:bg-blue-400 hover:border-blue-400 transition-colors"
                    type="primary"
                  >
                    <UserOutlined />
                  </Button>
                </Dropdown>

                <button
                  className="sm:hidden text-2xl text-gray-600 hover:text-blue-500 transition-colors"
                  onClick={showDrawer}
                  aria-label="Menu"
                >
                  <MenuOutlined />
                </button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="hidden sm:block h-9 hover:bg-blue-400 hover:border-blue-400 transition-colors"
                type="primary"
              >
                Kirish
              </Button>
            )}

            {!token && (
              <button
                className="sm:hidden text-2xl  text-gray-600 hover:text-blue-500 transition-colors"
                onClick={showDrawer}
                aria-label="Menu"
              >
                <MenuOutlined />
              </button>
            )}
          </div>
        </div>
      </header>

      <Drawer
        title={
          <Link to="/" onClick={onClose}>
            <img
              className="w-44 md:w-52 hover:opacity-90 transition-opacity"
              src={logo}
              alt="Logo"
            />
          </Link>
        }
        placement="left"
        closable={true}
        onClose={onClose}
        open={visible}
        width={window.innerWidth < 640 ? "80%" : "50%"}
        bodyStyle={{ padding: 0 }}
        headerStyle={{ padding: "16px 20px" }}
      >
        <div className="flex flex-col h-full">
          <div className="flex flex-col gap-1 p-2">
            <Link
              to="/"
              onClick={onClose}
              className={`p-3 text-sm md:text-base font-medium ${
                isActive("/") ? "text-blue-500 bg-blue-50" : "text-gray-600"
              } hover:text-blue-500 hover:bg-blue-50 transition-colors rounded`}
            >
              Bosh sahifa
            </Link>
            <Link
              to="/kurslar"
              onClick={onClose}
              className={`p-3 text-sm md:text-base font-medium ${
                isActive("/kurslar")
                  ? "text-blue-500 bg-blue-50"
                  : "text-gray-600"
              } hover:text-blue-500 hover:bg-blue-50 transition-colors rounded`}
            >
              Kurslar
            </Link>

            <Link
              to="/blog"
              onClick={onClose}
              className={`p-3 text-sm md:text-base font-medium ${
                isActive("/blog") ? "text-blue-500 bg-blue-50" : "text-gray-600"
              } hover:text-blue-500 hover:bg-blue-50 transition-colors rounded`}
            >
              Maqolalar
            </Link>

            {token && (
              <>
                <div className="p-4 border-t border-b border-gray-200 my-2">
                  <div className="text-xs md:text-sm font-medium text-gray-500">
                    Balans:
                  </div>
                  <div className="text-base md:text-lg font-bold">{user?.balance?.toLocaleString() || 0} so'm</div>

                  <div className="mt-2 text-xs md:text-sm font-medium text-gray-500">
                    Telefon:
                  </div>
                  <div className="text-base md:text-lg">{phone}</div>
                </div>

                <Link
                  to="/profilim"
                  onClick={onClose}
                  className={`flex items-center p-3 text-sm md:text-base font-medium ${
                    isActive("/profilim")
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600"
                  } hover:text-blue-500 hover:bg-blue-50 transition-colors rounded`}
                >
                  <UserOutlined className="mr-2" />
                  Profilim
                </Link>

                <Link
                  to="/my-courses"
                  onClick={onClose}
                  className={`flex items-center p-3 text-sm md:text-base font-medium ${
                    isActive("/my-courses")
                      ? "text-blue-500 bg-blue-50"
                      : "text-gray-600"
                  } hover:text-blue-500 hover:bg-blue-50 transition-colors rounded`}
                >
                  <BookOutlined className="mr-2" />
                  Kurslarim
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    onClose();
                  }}
                  className="flex items-center p-3 text-sm md:text-base font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50 transition-colors rounded w-full text-left"
                >
                  <LogoutOutlined className="mr-2" />
                  Chiqish
                </button>
              </>
            )}
          </div>

          {!token && (
            <div className="mt-auto p-4">
              <Button
                block
                type="primary"
                onClick={() => {
                  onClose();
                  navigate("/login");
                }}
                className="h-9 hover:bg-blue-400 hover:border-blue-400"
              >
                Kirish
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
