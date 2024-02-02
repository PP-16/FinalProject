import { Itinerary } from "./Itinerary";
import { Passentger } from "./Passentger";

export interface Booking {
    bookingId: number,
    dateAtBooking: Date,
    seatNumbers: [],
    totalPrice: number,
    bookingStatus: number,
    passengerId: number,
    itineraryId: number,
    itinerary:Itinerary,
    seatsSerialized:string,
    passenger:Passentger,
    createAt:Date
}
