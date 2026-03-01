import {
  UserOutlined,
  WalletOutlined,
  BookOutlined,
  IdcardOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useData } from "../../datacontect";

const Profilim = () => {
  const { user } = useData();
  console.log(user);
  
  const phone = user?.phone || "N/A";
  const firstName = user?.first_name || "N/A";
  const lastName = user?.last_name || "N/A";
  const username = user?.username || "N/A";
  const balance = user?.balance ?? 0;

  return (
    <div className="w-[90%] m-auto mt-[50px] bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-gray-800 border border-gray-200">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center">
          <div className="bg-gray-100 p-6 rounded-full mr-4">
            <UserOutlined className="text-gray-600 text-3xl" />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-gray-900">{phone}</h3>
            <p className="text-gray-500">{firstName} {lastName}</p>
            <p className="text-gray-500">Username: {username}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <WalletOutlined className="text-gray-700 text-2xl mr-3" />
            <div>
              <p className="text-gray-500 text-sm">Joriy balans</p>
              <p className="font-bold text-2xl text-gray-900">
                {balance.toLocaleString()} so'm
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to={"/my-courses"}
          className="bg-gray-50 p-5 rounded-xl border border-gray-200"
        >
          <div className="flex items-center mb-3">
            <BookOutlined className="text-gray-700 text-xl mr-2" />
            <h4 className="font-semibold text-lg text-gray-900">
              Mening kurslarim
            </h4>
          </div>
        </Link>

        <Link
          to={"/sertificatlarim"}
          className="bg-gray-50 p-5 rounded-xl border border-gray-200"
        >
          <div className="flex items-center mb-3">
            <IdcardOutlined className="text-gray-700 text-xl mr-2" />
            <h4 className="font-semibold text-lg text-gray-900">
              Sertifikatlarim
            </h4>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Profilim;