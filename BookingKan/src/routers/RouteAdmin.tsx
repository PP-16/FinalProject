import { Login } from "../page/auth/Login";
import { Register } from "../page/auth/Register";
import { RegisterAdmin } from "../page/auth/RegisterAdmin";
import { HomeEmployee } from "../page/main/HomeEmployee";
import { NotFoundPage } from "../page/main/NotFoundPage";
import { BookingManage } from "../page/maneger/BookingManage";
import { Cars } from "../page/maneger/CarManage";
import { ClassCarsManage } from "../page/maneger/ClassCarsManage";
import { Driver } from "../page/maneger/DriverManage";
import { HomeAdmin } from "../page/maneger/HomeAdmin";
import { Itinerarys } from "../page/maneger/ItineraryManage";
import { NewsManage } from "../page/maneger/NewsManage";
import { OrderMange } from "../page/maneger/OrderMange";
import { RoleUserManage } from "../page/maneger/RoleUserManage";
import { RouteCars } from "../page/maneger/RouteCarManage";
import { SystemSettingManage } from "../page/maneger/SystemSettingManage";
import { UserManage } from "../page/maneger/UserManage";
import { PathPrivateRouter } from "./PathAllRoute";

export const PrivateRouter = [
  {
    id: 0,
    path: PathPrivateRouter.home,
    element: <HomeAdmin />,
  },
  {
    id: 1,
    path: PathPrivateRouter.driver,
    element: <Driver />,
  },
  {
    id: 2,
    path: PathPrivateRouter.routeCars,
    element: <RouteCars />,
  },
  {
    id: 3,
    path: PathPrivateRouter.itinerarys,
    element: <Itinerarys />,
  },
  {
    id: 4,
    path: PathPrivateRouter.orders,
    element: <OrderMange />,
  },
  {
    id: 4,
    path: PathPrivateRouter.bookingManage,
    element: <BookingManage />,
  },
  {
    id: 5,
    path: PathPrivateRouter.userManage,
    element: <UserManage />,
  },
  {
    id: 6,
    path: PathPrivateRouter.cars,
    element: <Cars />,
  },
  {
    id: 7,
    path: PathPrivateRouter.newsManage,
    element: <NewsManage />,
  },
  {
    id: 8,
    path: PathPrivateRouter.systemSettingManage,
    element: <SystemSettingManage />,
  },
  {
    id: 9,
    path: PathPrivateRouter.classCarsManage,
    element: <ClassCarsManage />,
  },
  {
    id: 10,
    path: PathPrivateRouter.roleUserManage,
    element: <RoleUserManage />,
  },
  {
    id: 11,
    path: "*",
    element: <NotFoundPage />,
  },
];

export const EmpolyeeRouter = [
  {
    id: 0,
    path: PathPrivateRouter.home,
    element: <HomeEmployee />,
  }, 
  {
    id: 2,
    path: "*",
    element: <NotFoundPage />,
  },
];

export const NoAdmin = [
  {
    id: 0,
    path: PathPrivateRouter.home,
    element: <RegisterAdmin />,
  },
  {
    id: 1,
    path: "*",
    element: <NotFoundPage />,
  },
];
