import { Itinerary } from "./Itinerary";
import { Passentger } from "./Passentger";

export interface Booking {
    bookingId: number,
    dateAtBooking: Date,
    seatNumbers: string[],
    totalPrice: number,
    bookingStatus: number,
    passengerId: number,
    itineraryId: number,
    itinerary:Itinerary,
    seatsSerialized:string,
    passenger:Passentger,
    createAt:Date,
    checkIn : boolean,
    note:string
}
