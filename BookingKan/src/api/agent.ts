import axios, { AxiosResponse } from "axios"
import { store } from "./redux/Store/configureStore";


//เป็น Service สำหรับติดต่อกับ Server


axios.defaults.baseURL = "https://localhost:7149/api/"

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    postref: (url: string, body: {}) => axios.post(url, body, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(responseBody),
}
//แนบ token ไปกับ Header
axios.interceptors.request.use((config: any) => {
    const token = store.getState().account.user?.token
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const Account = {
    login: (value: any) => requests.post('Account/Login', value),
    register: (value: any) => requests.post('Account/Register', value),
    getAllUser: () => requests.get('Account/GetAllUser'),
    getUser: (token: any) => requests.post(`Account/GetUserInfoFromToken?token=${token}`, ""),
    checkPass: (oldPass: any) => requests.post(`Account/CheckOldpassword?oldPass=${oldPass}`, ""),
    changePass: (newPass: string, checkNew: string) => requests.post(`Account/ChangePassword?NewPass=${newPass}&checkNewPass=${checkNew}`, ""),
    ChangeRole: (passentgerId: number, roleId: number) => requests.post(`Account/ChangeRoles?PassId=${passentgerId}&RoleId=${roleId}`, ""),
    ChangeIsUse:(Id :number,isUse:boolean)=>requests.post(`Account/CheckIsuse?Id=${Id}&isuse=${isUse}`,""),
    getRole:()=>requests.get('Account/GetRols')
}



const Cars = {
    getCars: () => requests.get('CarsManage/GetCar'),
    getCarForRents: () => requests.get('CarsManage/GetCarForRents'),
    getClass: () => requests.get('CarsManage/GetClass'),
    createCar: (value: any) => requests.post('CarsManage/CreateAndUpdateCars', value),
    updateClass: (ID: number, ClassID: number) => requests.post(`CarsManage/UpdateClassInCars?ID=${ID}&ClassID=${ClassID}`, ""),
    updateStatus: (ID: number, Status: number) => requests.post(`CarsManage/UpdateStatusCars?ID=${ID}&newStatus=${Status}`, ""),
    updateStatusRent: (ID: number) => requests.post(`CarsManage/UpdateStatusCarsRent?ID=${ID}`, ""),
    delete: (Id: number) => requests.delete(`CarsManage/DeleteCars?id=${Id}`),
}

const Drivers = {
    getDriver: () => requests.get('Drivers/GetDriver'),
    getByChage: (min: number, max: number) => requests.get(`Drivers/SearchByCharges?minCharges=${min}&maxCharges=${max}`),
    createAndUpdateDriver: (value: any) => requests.post('Drivers/CreateandUpdateDriver', value),
    delete: (Id: number) => requests.delete(`Drivers/DeleteCarDrivers?id=${Id}`),
    ChangeIsUseDriver:(Id :number,isUse:boolean)=>requests.post(`Drivers/CheckIsuseDriver?Id=${Id}&isuse=${isUse}`,""),
}

const RoustCars = {
    getRoute: () => requests.get('RouteCars/GetRoute'),
    delete: (Id: number) => requests.delete(`RouteCars/DeleteRouteCar?id=${Id}`),
    createAndUpdateRoute: (value: any) => requests.post('RouteCars/CreateAndUpdateRouteCar', value),
    ChangeIsUseRoute:(Id :number,isUse:boolean)=>requests.post(`RouteCars/CheckIsuseRoute?Id=${Id}&isuse=${isUse}`,""),
}

const Itinerarys = {
    getItinarery: () => requests.get('Itinerary/GetItinerary'),
    createAndUpdateItinerery: (value: any) => requests.post('Itinerary/CreateAndUpdateItinerary', value),
    searchItinerary: (routename: string) => requests.get(`Itinerary/SearchItinerary?Routename=${routename}`),
    dalete: (Id: number) => requests.delete(`Itinerary/DeleteCarDrivers?id=${Id}`),
    ChangeIsUseItinarary:(Id :number,isUse:boolean)=>requests.post(`Itinerary/CheckIsuseItinarary?Id=${Id}&isuse=${isUse}`,""),
}

const Bookings = {
    getBooking: () => requests.get('Booking/GetBookings'),
    getBookingById: (Id: number) => requests.get(`Booking/GetById?ID=${Id}`),
    getBookingPaymentById: (Id: number) => requests.get(`Booking/GetPaymentByBookingId?ID=${Id}`),
    getTop3: () => requests.get('Booking/getTop3'),
    getByPassentger: () => requests.get('Booking/getByPassenger'),
    getSeatBooking: (data: Date, Id: number) => requests.get(`Booking/getseat?date=${data}&itineraryId=${Id}`),
    getSeatStatusPending: (data: Date, Id: number) => requests.get(`Booking/getseatstatus?date=${data}&itineraryId=${Id}`),
    createBooking: (value: any) => requests.post('Booking/CreateBookings', value),
    updataStatus: (ID: number, Status: number) => requests.post(`Booking/UpdateStatus?ID=${ID}&newStatus=${Status}`, ""),
    updateDateBooking: (itineraryId: number, dateAtBooking: Date, seatNumbers: any) => requests.post(`Booking/upDateBooking?ID=${itineraryId}&newDate=${dateAtBooking}`, seatNumbers),
    refundBooking: (value: any) => requests.postref('Booking/RefundPayment', value)
}

const OrderRent = {
    getOrderItem: () => requests.get('OrdersRent/GetOrderItem'),
    getOrder: () => requests.get('OrdersRent/GetOrder'),
    createOrderRents: (value: any) => requests.post('OrdersRent/CreateOrders', value),
}

const agent = {
    Account,
    Cars,
    Drivers,
    RoustCars,
    Itinerarys,
    Bookings,
    OrderRent
}


export default agent;
