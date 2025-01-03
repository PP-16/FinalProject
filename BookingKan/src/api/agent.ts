import axios, { AxiosResponse } from "axios"
import { store } from "./redux/Store/configureStore";


//เป็น Service สำหรับติดต่อกับ Server


axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_API_URL;

const responseBody = (response: AxiosResponse) => response.data;
const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
    Dpost: (url: string) => axios.post(url).then(responseBody),
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

export const createFormData = (item: any) => {
    let formData = new FormData();
    for (const key in item) {
        if (key !== null || key !== undefined) {
            formData.append(key, item[key])
        }
        console.log("itemcreateFormData",item);
        
    }
    return formData;
}
export const createFormDataImagUser = (imagePassenger: any) => {
    let formData = new FormData();
    formData.append("ImagePassenger", imagePassenger);
    return formData;
}

const Account = {
    login: (value: any) => requests.post('Account/Login', value),
    register: (value: any) => requests.post('Account/Register', value),
    registerAdmin: (value: any) => requests.post('Account/RegisterAdmins', value),
    getAllUser: () => requests.get('Account/GetAllUser'),
    getAdmin: () => requests.get('Account/GetAdmins'),
    getUser: (token: any) => requests.post(`Account/GetUserInfoFromToken?token=${token}`, ""),
    checkPass: (oldPass: any) => requests.post(`Account/CheckOldpassword?oldPass=${oldPass}`, ""),
    changePass: (newPass: string, checkNew: string) => requests.post(`Account/ChangePassword?NewPass=${newPass}&checkNewPass=${checkNew}`, ""),
    ChangeRole: (passentgerId: number, roleId: number) => requests.post(`Account/ChangeRoles?PassId=${passentgerId}&RoleId=${roleId}`, ""),
    ChangeIsUse: (Id: number, isUse: boolean) => requests.post(`Account/CheckIsuse?Id=${Id}&isuse=${isUse}`, ""),
    getRole: () => requests.get('Account/GetRols'),
    createRole:(value: any)=>requests.post('Account/CreateNewRoles',value),
    deleteRole: (Id: any) => requests.Dpost(`Account/DeleteRole?id=${Id}`),
    updateImageUser : (value: any) => requests.post('Account/updateProfileuser', createFormData(value)),
}



const Cars = {
    getCars: () => requests.get('CarsManage/GetCar'),
    getCarForRents: () => requests.get('CarsManage/GetCarForRents'),
    getClass: () => requests.get('CarsManage/GetClass'),
    createCar: (value: any) => requests.post('CarsManage/CreateAndUpdateCars', value),
    createClass: (value: any) => requests.post('CarsManage/CreateAndUpdateClassCar', value),
    updateClass: (ID: number, ClassID: number) => requests.post(`CarsManage/UpdateClassInCars?ID=${ID}&ClassID=${ClassID}`, ""),
    updateStatus: (ID: number, Status: number) => requests.post(`CarsManage/UpdateStatusCars?ID=${ID}&newStatus=${Status}`, ""),
    // updateStatusRent: (ID: number) => requests.post(`CarsManage/UpdateStatusCarsRent?ID=${ID}`, ""),
    delete: (Id: number) => requests.Dpost(`CarsManage/DeleteCars?id=${Id}`),
    deleteImage: (Id: number) => requests.Dpost(`CarsManage/DeleteImageCars?id=${Id}`),
    deleteClass: (Id: number) => requests.Dpost(`CarsManage/DeleteClassCars?id=${Id}`),
    ChangeIsUseCar: (Id: number, isUse: boolean) => requests.post(`CarsManage/CheckIsuseCar?Id=${Id}&isuse=${isUse}`, ""),
}

const Drivers = {
    getDriver: () => requests.get('Drivers/GetDriver'),
    getByChage: (min: number, max: number) => requests.get(`Drivers/SearchByCharges?minCharges=${min}&maxCharges=${max}`),
    createAndUpdateDriver: (value: any) => requests.post('Drivers/CreateandUpdateDriver', value),
    delete: (Id: number) => requests.Dpost(`Drivers/DeleteCarDrivers?id=${Id}`),
    ChangeIsUseDriver: (Id: number, isUse: boolean) => requests.post(`Drivers/CheckIsuseDriver?Id=${Id}&isuse=${isUse}`, ""),
    updateStatusDriver: (Id: number, newStatus: number) => requests.post(`Drivers/updateStatusDriver?Id=${Id}&newStatus=${newStatus}`, ''),

}

const RoustCars = {
    getRoute: () => requests.get('RouteCars/GetRoute'),
    delete: (Id: number) => requests.Dpost(`RouteCars/DeleteRouteCar?id=${Id}`),
    createAndUpdateRoute: (value: any) => requests.post('RouteCars/CreateAndUpdateRouteCar', value),
    ChangeIsUseRoute: (Id: number, isUse: boolean) => requests.post(`RouteCars/CheckIsuseRoute?Id=${Id}&isuse=${isUse}`, ""),
}

const Itinerarys = {
    getItinarery: () => requests.get('Itinerary/GetItinerary'),
    createAndUpdateItinerery: (value: any) => requests.post('Itinerary/CreateAndUpdateItinerary', value),
    searchItinerary: (routename: string) => requests.get(`Itinerary/SearchItinerary?Routename=${routename}`),
    dalete: (Id: number) => requests.Dpost(`Itinerary/DeleteCarDrivers?id=${Id}`),
    ChangeIsUseItinarary: (Id: number, isUse: boolean) => requests.post(`Itinerary/CheckIsuseItinarary?Id=${Id}&isuse=${isUse}`, ""),
}

const Bookings = {
    getBooking: () => requests.get('Booking/GetBookings'),
    getBookingById: (Id: any) => requests.get(`Booking/GetById?ID=${Id}`),
    getBookingPaymentById: (Id: number) => requests.get(`Booking/GetPaymentByBookingId?ID=${Id}`),
    getTop3: () => requests.get('Booking/getTop3'),
    getByPassentger: () => requests.get('Booking/getByPassenger'),
    getSeatBooking: (data: Date, Id: number) => requests.get(`Booking/getseat?date=${data}&itineraryId=${Id}`),
    getSeatStatusPending: (data: Date, Id: number) => requests.get(`Booking/getseatstatus?date=${data}&itineraryId=${Id}`),
    createBooking: (value: any) => requests.post('Booking/CreateBookings', value),
    createEmployeeBooking: (value: any) => requests.post('Booking/CreateEmployeeBookings', value),
    updataStatus: (ID: number, Status: number) => requests.post(`Booking/UpdateStatus?ID=${ID}&newStatus=${Status}`, ""),
    updateDateBooking: (itineraryId: number, dateAtBooking: Date, seatNumbers: any) => requests.post(`Booking/upDateBooking?ID=${itineraryId}&newDate=${dateAtBooking}`, seatNumbers),
    CheckInBooking: (Id: number, checkIn: boolean) => requests.post(`Booking/Checkin?Id=${Id}&checkin=${checkIn}`, ""),
    getTotalPriceBookings: () => requests.get('Booking/GetTotalPriceBookings'),
    getTotalPriceBookingsByMount: (month: number, year: number) => requests.get(`Booking/GetTotalPriceBookingsByMount?month=${month}&year=${year}`),
    getTotalPriceBookingsByYear: (year: number) => requests.get(`Booking/GetTotalPriceBookingsByYear?year=${year}`),
    getBookingsByItinerary: (itineraryId : number,dateBooking:Date) => requests.get(`Booking/GetBookingsFromItinerary?itineraryId=${itineraryId}&dateBooking=${dateBooking}`),
    checkforCancel:()=>requests.get("Booking/CheckBookingAndUpdateStatus"),
}

const OrderRent = {
    getOrderItem: () => requests.get('OrdersRent/GetOrderItem'),
    getOrder: () => requests.get('OrdersRent/GetOrder'),
    getCarInRent: () => requests.get('OrdersRent/GetcarInRented'),
    createOrderRents: (value: object) => requests.post('OrdersRent/CreateOrders', value),
    updataStatus: (ID: number, Status: number) => requests.post(`OrdersRent/UpdateStatus?ID=${ID}&newStatus=${Status}`, ""),
    confirmReturn: (ID: number, confirm: boolean) => requests.post(`OrdersRent/ConfirmReturn?Id=${ID}&confirm=${confirm}`, ""),
    getOrderTotalByReturn: () => requests.get('OrdersRent/GetOrderTotalByReturn'),
    getOrderTotalByMount: (month: number, year: number) => requests.get(`OrdersRent/GetOrderTotalByMount?month=${month}&year=${year}`),
    getOrderTotalByYear: (year: number) => requests.get(`OrdersRent/GetOrderTotalByYear?year=${year}`),
    getOrderByPassentger: () => requests.get('OrdersRent/getByPassenger'),
    getOrderPastDue: () => requests.get('OrdersRent/GetOrderPast'),
    getOrderById: (Id: number) => requests.get(`OrdersRent/GetById?ID=${Id}`),
    getOrderPastById: (Id: number) => requests.get(`OrdersRent/GetOrderPastById?orderRentId=${Id}`),
    paiedOrderPast: (Id: any) => requests.post(`OrdersRent/PaiedPastDue?Id=${Id}`,""),
    checkOrderPast:()=>requests.get('OrdersRent/CheckPastDueOrders')
}


const Payments = {
    refundBooking: (value: any) => requests.postref('Payment/RefundPayment', value),
    createPayment: (value: any) => requests.post('Payment/CreatePayment', createFormData(value)),
}

const News = {
    getNews: () => requests.get('News/GetNews'),
    getNewsById: (Id: number) => requests.get(`News/GetById?Id=${Id}`),
    CreateUpdateNews: (value: any) => requests.post('News/CreateUpdateNews', value),
    deleteNews: (Id: number) => requests.Dpost(`News/DeleteNewsById?Id=${Id}`),
    deleteImageNews: (Id: number) => requests.Dpost(`News/DeleteImageNewss?id=${Id}`),
}

const SystemSetting = {
    getSetting: () => requests.get('SystemSetting/GetSystemSetting'),
    getSettingById: (Id: number) => requests.get(`SystemSetting/GetSystemSettingById?Id=${Id}`),
    CreateUpdateSetting: (value: any) => requests.post('SystemSetting/CreateUpdateSystem', value),
    deleteSetting: (Id: number) => requests.Dpost(`SystemSetting/DeleteSystemSetting?Id=${Id}`),
    deleteImageSildes: (Id: number) => requests.Dpost(`SystemSetting/DeleteImageSlides?id=${Id}`),
}

const agent = {
    Account,
    Cars,
    Drivers,
    RoustCars,
    Itinerarys,
    Bookings,
    OrderRent,
    Payments,
    News,
    SystemSetting,
}


export default agent;
