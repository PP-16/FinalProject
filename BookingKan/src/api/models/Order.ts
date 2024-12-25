import { Car } from "./Cars"
import { Drivers } from "./Drivers"
import { Passentger } from "./Passentger"

export interface OrderRent {
    orderRentId: number,
    orderSatus: number,
    paymentDate: Date,
    passengerId: number
    passenger: Passentger
    confirmReturn: boolean
    orderRentItems: OrderRentItem
}

export interface OrderRentItem {
    orderRentItemId: number,
    quantity: number,
    carsPrice: number,
    dateTimePickup: string,
    dateTimeReturn: string,
    placePickup: string,
    placeReturn: string,
    carsId: number,
    cars: Car,
    driverId: number,
    driver: Drivers,
    orderRentId: number
    createAt: Date
}

export interface OrderPastDue {
    ordersPastDueId: number
    retrunDate: Date
    numberOfDays: number
    totalPricePastDue: number
    paied: boolean
    orderRentId: number
    orderRent: OrderRent
}