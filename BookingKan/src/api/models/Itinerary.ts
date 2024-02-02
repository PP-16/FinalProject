import { Car } from "./Cars"
import { RouteCar } from "./RouetCar"

export interface Itinerary {
    itineraryId: number,
    issueTime: Date,
    arrivalTime: Date,
    routeCarsId: number,
    routeCars:RouteCar
    carsId: number
    cars:Car
    isUse:boolean
}