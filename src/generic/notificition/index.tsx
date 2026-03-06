import { notification } from "antd";

const notificationApi = () => {
  const notify = ({ type }) => {
    switch (type) {
      case "buyCourses":
        return notification.error({
          message: "You have already purchased this course!",
        });
        break
      case "success":
        return notification.success({
          message: "Course purchased successfully!",
        });
        break
      case "token":
        return notification.error({
          message: "Ro'yhatdan o'ting",
        });
        break
      case "loginSuccses":
        return notification.success({
          message: "Tizimga kirdingiz",
        });
        break
       case "noMoney":
        return notification.error({
          message: "Mablag' yetarli emas",
        });
        break
        case "Yuborildi":
        return notification.success({
          message: "Izoh qoshildi",
        });
        break
      default:
        return notification.info({
          message: "Noma’lum holat yuz berdi!",
        });
    }
  };
  return notify;
};

export default notificationApi;
