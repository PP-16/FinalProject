export interface Car{
    carsId : number;
    carRegistrationNumber : string;
    carModel : string;
    carBrand :string;
    detailCar : string
    categoryCar :number;
    statusCar : number;
    classCarsId : number;
    classCars : ClassCar; 
    imageCars : string;
    quantitySeat:number;
    priceSeat :number;
    isUse:boolean
}

export interface ClassCar{
    classCarsId:number;
    className:string;
    price:number;
}