import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Car, ClassCar } from "../../models/Cars";
import agent, { createFormData } from "../../agent";
import { FieldValues } from "react-hook-form";
import { message } from "antd";

interface CarState {
  cars: Car[] | [];
  carForRent:Car[] | [];
  classCars: ClassCar[] | [];
  loading: boolean;
  error: null;
}

const initialState: CarState = {
  cars: [],
  carForRent:[],
  classCars: [],
  loading: false,
  error: null,
};

export const fetchCars = createAsyncThunk(
  "cars/fetchCars",
  async () => {
    const response = await agent.Cars.getCars();
    return response;
  }
);
export const fetchCarsForRent = createAsyncThunk(
  "cars/fetchCarsForRent",
  async () => {
    const response = await agent.Cars.getCarForRents();
    return response;
  }
);

export const fetchClassCars = createAsyncThunk(
  "cars/fetchClassCars",
  async () => {
    const response = await agent.Cars.getClass();
    return response;
  }
);
export const createCarsAsync = createAsyncThunk<Car, FieldValues>(
  "cars/createCarsAsync",
  async (cars, thunkAPI) => {
    const data = createFormData(cars);
    // console.log("cars.imageCars", cars.imageCars);

    for (var formfile of cars.imageCars) {
      data.append("FormFiles", formfile.originFileObj);
      // console.log("sand formfile", formfile);
    }

    try {
      // console.log("dataCreateCarsAsync", data);
      const response = await agent.Cars.createCar(data);

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

export const updateIsUseCarsAsync = createAsyncThunk<Car, FieldValues>(
  "cars/updateIsUseCarsAsync",
  async (cars, thunkAPI) => {
    try {
      console.log("dataStatus", cars);
      const response = await agent.Cars.ChangeIsUseCar(cars.Id, cars.isUse);
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const createAndUpdateClassCarsAsync = createAsyncThunk<ClassCar, FieldValues>(
  "classCars/createAndUpdateClassCarsAsync",
  async (classCars, thunkAPI) => {
    try {
      console.log("data", classCars);
      const ClassDto = await agent.Cars.createClass({
        classCarsId:classCars.classCarsId,
        className:classCars.className,
        price:classCars.price,
      });
      console.log("responseupClass", ClassDto);
      return ClassDto;
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
    .addCase(fetchClassCars.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchClassCars.fulfilled, (state, action:any) => {
      state.loading = false;
      state.classCars = action.payload;
    })
    .addCase(fetchClassCars.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.error.message || "feiled to update";
    })

    .addCase(fetchCars.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCars.fulfilled, (state, action:any) => {
      state.loading = false;
      state.cars = action.payload;
    })
    .addCase(fetchCars.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.error.message || "feiled to update";
    })


    .addCase(fetchCarsForRent.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchCarsForRent.fulfilled, (state, action:any) => {
      state.loading = false;
      state.carForRent = action.payload;
    })
    .addCase(fetchCarsForRent.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.error.message || "feiled to update";
    })

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
