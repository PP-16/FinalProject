import { Booking } from "./Booking"

export interface Payment {
    PaymentBookingId: number,
    CreateAt: Date,
    PaymentIntentId: string,
    ClientSecret: string,
    BookingId: number,
    Booking: Booking
}