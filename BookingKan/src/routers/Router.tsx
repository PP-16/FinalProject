import { HomePageUser } from "../page/main/HomePage";
import { Login } from "../page/auth/Login";
import { Register } from "../page/auth/Register";
import { BookingDetail } from "../page/details/BookingDetail";
import { RentDetail } from "../page/details/RentDetails";
import { HomeUnloginUser } from "../page/main/HomeUnlogin";
import { PaymentForm } from "../page/details/PaymentPage";
import { AccountPage } from "../page/main/AccountPage";
import { ChangeDateBooking } from "../page/main/components/ChangeDateBooking";

export const PublicRouter=[
    {
        id:0,
        path:"/",
        element:<HomePageUser/>
    },
    {
        id:1,
        path:"/BookingDetail",
        element:<BookingDetail/>
    },
    {
        id:2,
        path:"/PaymentPage",
        element:<PaymentForm/>
    },
    {
        id:3,
        path:"/AccountPage",
        element:<AccountPage/>
    },
    {
        id:4,
        path:"/ChangeDateBooking",
        element:<ChangeDateBooking/>
    },
]


export const accountRouter = [
    {
        id:0,
        path:"/",
        element:<HomeUnloginUser/>
    },
    {
        id:1,
        path:"/register",
        element:<Register/>
    },
    {
        id:2,
        path:"/login",
        element:<Login/>
    },
]
