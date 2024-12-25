import { HomePageUser } from "../page/main/HomePage";
import { Login } from "../page/auth/Login";
import { Register } from "../page/auth/Register";
import { BookingDetail } from "../page/details/BookingDetail";
import { RentDetail } from "../page/details/RentDetails";
import { HomeUnloginUser } from "../page/main/HomeUnlogin";
import { PaymentForm } from "../page/details/PaymentPage";
import { AccountPage } from "../page/main/AccountPage";
import { ChangeDateBooking } from "../page/main/components/ChangeDateBooking";
import { NotFoundPage } from "../page/main/NotFoundPage";
import { PathAccountRouter, PathPrivateRouter, PathPublicRouter } from "./PathAllRoute";
import { BookingManage } from "../page/maneger/BookingManage";

export const PublicRouter = [
  {
    id: 0,
    path: PathPublicRouter.home,
    element: <HomePageUser />,
  },
  {
    id: 1,
    path: PathPublicRouter.bookingDetail,
    element: <BookingDetail />,
  },
  {
    id: 2,
    path: PathPublicRouter.paymentPage,
    element: <PaymentForm />,
  },
  {
    id: 3,
    path: PathPublicRouter.accountPage,
    element: <AccountPage />,
  },
  {
    id: 4,
    path: PathPublicRouter.changeDateBooking,
    element: <ChangeDateBooking />,
  },
  {
    id: 5,
    path: "*",
    element: <NotFoundPage />,
  },
  {
    id: 6,
    path: PathPrivateRouter.bookingManage,
    element: <BookingManage />,
  },
];

export const accountRouter = [
  {
    id: 0,
    path: PathAccountRouter.home,
    element: <HomeUnloginUser />,
  },
  {
    id: 1,
    path: PathAccountRouter.register,
    element: <Register />,
  },
  {
    id: 2,
    path: PathAccountRouter.login,
    element: <Login />,
  },
  {
    id: 3,
    path: PathAccountRouter.bookingDetail,
    element: <BookingDetail />,
  },
  {
    id: 5,
    path: PathPrivateRouter.bookingManage,
    element: <BookingManage />,
  },
  {
    id: 4,
    path: "*",
    element: <NotFoundPage />,
  },
];
