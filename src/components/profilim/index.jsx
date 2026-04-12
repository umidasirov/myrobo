import {
  UserOutlined,
  WalletOutlined,
  BookOutlined,
  IdcardOutlined,
  EditOutlined,
  CheckOutlined,
  LoadingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useData } from "../../datacontect";
import { Helmet } from 'react-helmet-async';

const Profilim = () => {
  const { user, loading, fetchUserData, updateUser } = useData();

  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patchLoading, setPatchLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);
  
  const openModal = () => {
    setFirstName(user?.first_name || "");
    setLastName(user?.last_name || "");
    setSuccess(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSuccess(false);
  };

  const handleUpdate = async () => {
    if (!firstName && !lastName) return;
    setPatchLoading(true);
    setSuccess(false);
    const body = {};
    if (firstName) body.first_name = firstName;
    if (lastName) body.last_name = lastName;
    const res = await updateUser(body);
    if (res?.ok) {
      setSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1200);
    }
    setPatchLoading(false);
  };

  const balance = user?.balance ?? 0;
  
  if (loading || !user) {
    return (
      <div className="w-[90%] m-auto mt-[50px] bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center mb-8">
          <div className="bg-gray-200 animate-pulse rounded-full w-20 h-20 mr-4" />
          <div className="space-y-3">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Profilim - MyRobo</title>
        <meta name="description" content="MyRobo platformasidagi shaxsiy profilingizni ko'ring va tahrirlang." />
        <meta name="keywords" content="profil, shaxsiy, tahrirlash, MyRobo" />
        <meta property="og:title" content="Profilim - MyRobo" />
        <meta property="og:description" content="MyRobo platformasidagi shaxsiy profilingizni ko'ring va tahrirlang." />
        <meta property="og:type" content="profile" />
      </Helmet>
      <div className="w-[90%] m-auto mt-[50px] bg-white rounded-2xl shadow-lg overflow-hidden p-8 text-gray-800 border border-gray-200">

        {/* Profil header */}
        <div className="flex items-start flex-col sm:flex-row justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-gray-100 p-6 rounded-full mr-4">
              <UserOutlined className="text-gray-600 text-3xl" />
            </div>
            <div>
              <h3 className="font-bold text-2xl text-gray-900">{user?.phone}</h3>
              <p className="text-gray-500">
                {user?.first_name || "—"} {user?.last_name || ""}
              </p>
              <p className="text-gray-500">Username: {user?.username}</p>
            </div>
          </div>

          {/* Tahrirlash tugmasi */}
          <button
            onClick={openModal}
            className="flex w-full justify-center mt-5 sm:w-1/4 sm:mt-0 md:w-40 items-center gap-2 border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            <EditOutlined />
            Tahrirlash
          </button>
        </div>

        {/* Balans */}
        <div className="bg-gray-50 p-6 rounded-xl mb-8 border border-gray-200">
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

        {/* Linklar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to={"/my-courses"} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <BookOutlined className="text-gray-700 text-xl mr-2" />
              <h4 className="font-semibold text-lg text-gray-900">Mening kurslarim</h4>
            </div>
          </Link>
          <Link to={"/sertificatlarim"} className="bg-gray-50 p-5 rounded-xl border border-gray-200">
            <div className="flex items-center">
              <IdcardOutlined className="text-gray-700 text-xl mr-2" />
              <h4 className="font-semibold text-lg text-gray-900">Sertifikatlarim</h4>
            </div>
          </Link>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                <EditOutlined className="text-blue-600" />
                Profilni tahrirlash
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <CloseOutlined className="text-lg" />
              </button>
            </div>

            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Ism</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ismingiz"
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 outline-none focus:border-blue-400 transition"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-500">Familiya</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Familiyangiz"
                  className="border border-gray-200 rounded-lg px-4 py-2.5 text-gray-800 outline-none focus:border-blue-400 transition"
                />
              </div>
            </div>

            {success && (
              <p className="text-green-600 text-sm mb-4 flex items-center gap-1">
                <CheckOutlined /> Muvaffaqiyatli saqlandi
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 py-2.5 rounded-lg font-medium transition"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleUpdate}
                disabled={patchLoading || (!firstName && !lastName)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-2.5 rounded-lg font-medium transition"
              >
                {patchLoading ? <LoadingOutlined /> : <CheckOutlined />}
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profilim;