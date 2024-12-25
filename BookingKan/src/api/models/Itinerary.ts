import { Car } from "./Cars"
import { RouteCar } from "./RouetCar"

export interface Itinerary {
    arrivalTime: Date
    cars: Car
    carsId: number
    isUse: boolean
    issueTime: Date
    itineraryId: number
    routeCars: RouteCar
    routeCarsId: number
}