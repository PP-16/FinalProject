import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Car, ClassCar } from "../../models/Cars";
import agent from "../../agent";
import { FieldValues } from "react-hook-form";
import { message } from "antd";

interface CarState {
  cars: Car | null;
  classCars: ClassCar | null;
  loading: boolean;
  error: null;
}

const initialState: CarState = {
  cars: null,
  classCars: null,
  loading: false,
  error: null,
};

export const createCarsAsync = createAsyncThunk<Car, FieldValues>(
  "cars/createCarsAsync",
  async (cars, thunkAPI) => {
    try {
      console.log("data", cars);
      const response = await agent.Cars.createCar({
        carRegistrationNumber : cars.carRegistrationNumber,
        carModel : cars.carModel,
        carBrand : cars.carBrand,
        detailCar : cars.detailCar,
        categoryCar : cars.categoryCar,
        statusCar : cars.statusCar,
        classCarsId : cars.classCarsId,
        imageCars : cars.imageCars,
        quantitySeat : cars.quantitySeat,
        priceSeat : cars.priceSeat
      }
     
      );
      console.log("responseupClass", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateClassCarAsync = createAsyncThunk<Car, FieldValues>(
  "cars/updateClassCarAsync",
  async (cars, thunkAPI) => {
    try {
      console.log("data", cars);
      const response = await agent.Cars.updateClass(cars.ID, cars.ClassID);
      console.log("responseupClass", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateStatusCarAsync = createAsyncThunk<Car, FieldValues>(
  "cars/updateStatusCarAsync",
  async (cars, thunkAPI) => {
    try {
      console.log("dataStatus", cars);
      const response = await agent.Cars.updateStatus(cars.ID, cars.statusCar);
      console.log("responseupStatus", response);
      return response;  
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const CarsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    setCars: (state, action) => {
      state.cars = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(createCarsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCarsAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCarsAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(updateClassCarAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClassCarAsync.fulfilled, (state) => {
        state.loading = false;
        message.success("Update success!");
      })
      .addCase(updateClassCarAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        message.error("Unable to update status. Check order conditions.");
      })
      .addCase(updateStatusCarAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatusCarAsync.fulfilled, (state) => {
        state.loading = false;
        message.success(" Update status success!!.");
      })
      .addCase(updateStatusCarAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        message.error("Unable to update status. Check order conditions.");
      });
  },
});

export const { setCars } = CarsSlice.actions;
