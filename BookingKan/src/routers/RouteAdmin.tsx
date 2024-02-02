import { Login } from "../page/auth/Login";
import { Register } from "../page/auth/Register";
import { HomeEmployee } from "../page/main/HomeEmployee";
import { BookingManage } from "../page/maneger/BookingManage";
import { Cars } from "../page/maneger/CarManage";
import { Driver } from "../page/maneger/DriverManage";
import { Itinerarys } from "../page/maneger/ItineraryManage";
import { OrderMange } from "../page/maneger/OrderMange";
import { RouteCars } from "../page/maneger/RouteCarManage";
import { UserManage } from "../page/maneger/UserManage";
import { Orders } from "../page/maneger/components/Oreder";


export const PrivateRouter=[
    {
        id:0,
        path:"/",
        element:<HomeEmployee/>
    },
    {
        id:1,
        path:"/Driver",
        element:<Driver/>
    },
    {
        id:2,
        path:"/RouteCars",
        element:<RouteCars/>
    },
    {
        id:3,
        path:"/Itinerarys",
        element:<Itinerarys/>
    },
    {
        id:4,
        path:"/Orders",
        element:<OrderMange/>
    },
    {
        id:4,
        path:"/BookingManage",
        element:<BookingManage/>
    },
    {
        id:5,
        path:"/UserManage",
        element:<UserManage/>
    },
    {
        id:6,
        path:"/Cars",
        element:<Cars/>
    },
]