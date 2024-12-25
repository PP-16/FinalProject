const Host = import.meta.env.VITE_HOST ?? "/";

export const PathPublicRouter = {
  home: `${Host}`,
  bookingDetail: `${Host}BookingDetail/`,
  paymentPage: `${Host}PaymentPage/`,
  accountPage: `${Host}accountPage/`,
  changeDateBooking: `${Host}ChangeDateBooking/`,
};

export const PathAccountRouter = {
  home: `${Host}`,
  bookingDetail: `${Host}BookingDetail/`,
  register: `${Host}register/`,
  login: `${Host}login/`,
};

export const PathPrivateRouter = {
  home: `${Host}`,
  driver: `${Host}Driver/`,
  routeCars: `${Host}RouteCars/`,
  itinerarys: `${Host}Itinerarys/`,
  orders: `${Host}Orders/`,
  bookingManage: `${Host}BookingManage/`,
  userManage: `${Host}UserManage/`,
  cars: `${Host}Cars/`,
  newsManage: `${Host}NewsManage/`,
  systemSettingManage: `${Host}SystemSettingManage/`,
  classCarsManage: `${Host}ClassCarsManage/`,
  roleUserManage: `${Host}RoleUserManage/`,
  test: `${Host}test/`,
};

