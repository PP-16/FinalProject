import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { CarsSlice } from "../Slice/CarsSlice";
import { DriverSlice } from "../Slice/DriverSilce";
import { RouteSlice } from "../Slice/RouteCarSlice";
import { ItinerarySlice } from "../Slice/ItinerarySlice";
import { AccountSlice } from "../Slice/AccountSlice";
import { BookingsSlice } from "../Slice/BookingSlice";
import { OrderRentSlice } from "../Slice/OrderRentSlice";
import { PaymentSlice } from "../Slice/PaymentSlice";
import { NewsSlice } from "../Slice/NewsSlice";
import { SystemSlice } from "../Slice/SystemSlice";

export const store = configureStore({
    reducer: {
        cars : CarsSlice.reducer,
        drivers : DriverSlice.reducer,
        routes : RouteSlice.reducer,
        itinerary : ItinerarySlice.reducer,
        account : AccountSlice.reducer,
        booking : BookingsSlice.reducer,
        order:OrderRentSlice.reducer,
        payment:PaymentSlice.reducer,
        news:NewsSlice.reducer,
        system:SystemSlice.reducer,
    }
})
  
//เป็นค่า Default ที่มีอยู่ใน store คือ store.getState, store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

//สำหรับเรียกใข้ dispatch และ state
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
