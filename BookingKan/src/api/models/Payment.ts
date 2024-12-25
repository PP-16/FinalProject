import { Booking } from "./Booking"
import { OrderPastDue, OrderRent } from "./Order"

export interface Payment {
    paymentBookingId: number,
    createAt: Date,
    paymentIntentId: string,
    clientSecret: string,
    bookingId: number,
    booking: Booking,
    imagePayment :string,
    orderRentId :number,
    orderRent:OrderRent,
    categoryPayment:number,
    ordersPastDueId:number,
    ordersPastDue: OrderPastDue
}