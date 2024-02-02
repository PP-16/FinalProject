import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Drivers } from "../../models/Drivers";
import agent from "../../agent";
import { FieldValues } from "react-hook-form";

interface DriverState {
  driver: Drivers | null;
  loading: boolean;
  error: null;
}
const initialState: DriverState = {
  driver: null,
  loading: false,
  error: null,
};

export const createDriverAsync = createAsyncThunk<Drivers, FieldValues>(
  "drivers/createDriverAsync",
  async (drivers, thunkAPI) => {
    try {
      console.log("datadrivers", drivers);
      const DriverDto = await agent.Drivers.createAndUpdateDriver({
        driverName: drivers.driverName,
        idCardNumber: drivers.idCardNumber,
        charges: drivers.charges,
        address: drivers.address,
        phone: drivers.phone,
        statusDriver: drivers.statusDriver,
      });
      console.log("responsecrateDri", DriverDto);
      return DriverDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateDriverAsync = createAsyncThunk<Drivers, FieldValues>(
  "drivers/updateDriverAsync",
  async (drivers, thunkAPI) => {
    try {
      console.log("datadriversup", drivers);
      const DriverDto = await agent.Drivers.createAndUpdateDriver({
        driverId: drivers.driverId,
        driverName: drivers.driverName,
        idCardNumber: drivers.idCardNumber,
        charges: drivers.charges,
        address: drivers.address,
        phone: drivers.phone,
        statusDriver: drivers. statusDriver,
      });
      console.log("responsecrateDri", DriverDto);
      return DriverDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const searchBychargeAsync = createAsyncThunk<Drivers, FieldValues>(
  "charge/searchBychargeAsync",
  async (charge, thunkAPI) => {
    try {
      console.log("chargeDri", charge);
      const ChargeDto = await agent.Drivers.getByChage(charge.min,charge.max)
      console.log("responsecrateCharge", ChargeDto);
      return ChargeDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const updateIsUseDriverAsync = createAsyncThunk<Drivers, FieldValues>(
  "drivers/updateIsUseDriverAsync",
  async (drivers, thunkAPI) => {
    try {
      console.log("dataStatus", drivers);
      const response = await agent.Drivers.ChangeIsUseDriver(
        drivers.Id,
        drivers.isUse
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const DriverSlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setDriver: (state, action) => {
      state.driver = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDriverAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDriverAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDriverAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(updateDriverAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDriverAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateDriverAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      });
  },
});

export const { setDriver } = DriverSlice.actions;
