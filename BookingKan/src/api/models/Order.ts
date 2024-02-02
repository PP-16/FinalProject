import { Car } from "./Cars"
import { Drivers } from "./Drivers"
import { Passentger } from "./Passentger"

export interface OrderRent {
    orderRentId: number,
    orderSatus: number,
    paymentDate: Date,
    passengerId: number
    passenger:Passentger
}

export interface OrderRentItem {
    orderRentItemId: number,
    quantity: number,
    itemPrice: number,
    dateTimePickup: string,
    dateTimeReturn: string,
    placePickup: string,
    placeReturn:string,
    carsId: number,
    cars:Car,
    driverId: number,
    driver:Drivers,
    orderRentId: number
    orderRent: OrderRent
}