const path = import.meta.env.VITE_HOST ?? "https://localhost:7149/";

export const PathImage = {
  image: `${path}images/`,
  imageNews: `${path}news/`,
  imageSlide: `${path}imageSlide/`,
  logo: `${path}Logo/`,
  imagePayment: `${path}prompay/`,
  imageUser: `${path}userImage/`,
};

// import tarnfer from "../../assets/tranfer.png";
// import cash from "../../assets/cash.png";
// import card from "../../assets/card.png";
// import carseat from "../../../assets/car-seat.png";
// import Booked from "../../../assets/carseat.png";
// import checkSeats from "../../../assets/check.png";
// import paySeat from "../../../assets/payseat.png";
// import driver from "../../../assets/steering-wheel.png";
// import doorIn from "../../../assets/dorIn.png";
// import doorOut from "../../../assets/dorOut.png";
// import myseat from "../../../assets/mySeat.png";

const ass = path +"assets/"
const local = "/src/assets/"

export const imageLocal ={
  tarnfer:`${path?ass + "tranfer-b3589e1b":local+"tranfer"}.png `,
  cash:`${path?ass + "cash-689b8704":local+"cash"}.png `,
  card:`${path?ass + "card-515f2953":local+"card"}.png `,
  carseat:`${path?ass + "car-seat-93b0094c":local+"car-seat"}.png `,
  Booked:`${path?ass + "carseat-8be812a9":local+"carseat"}.png `,
  checkSeats:`${path?ass + "check-a7ed2abc":local+"check"}.png `,
  paySeat:`${path?ass + "payseat-f7d64f2d":local+"payseat"}.png `,
  driver:`${path?ass + "steering-wheel-e3dc33b4":local+"steering-wheel"}.png `,
  doorIn:`${path?ass + "dorIn-4db5bbaf":local+"dorIn"}.png `,
  doorOut:`${path?ass + "dorOut-76f2351e":local+"dorOut"}.png `,
  myseat:`${path?ass + "mySeat-d1228145":local+"mySeat"}.png `,
}
