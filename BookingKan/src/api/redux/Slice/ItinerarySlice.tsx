import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Itinerary } from "../../models/Itinerary";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";

interface ItineraryState {
  itinerary: Itinerary | null;
  loading: boolean;
  error: null;
}
const initialState: ItineraryState = {
  itinerary: null,
  loading: false,
  error: null,
};

export const createItineraryAsync = createAsyncThunk<Itinerary, FieldValues>(
  "itinerarys/createDriverAsync",
  async (itinerarys, thunkAPI) => {
    try {
        console.log("dataitinerarysup", itinerarys);
        const ItinerarysDto = await agent.Itinerarys.createAndUpdateItinerery({
          issueTime: itinerarys.issueTime,
          arrivalTime: itinerarys.arrivalTime,
          routeCarsId: itinerarys.routeCarsId,
          carsId: itinerarys.carsId,
        });
        console.log("responsecrateDri", ItinerarysDto);
        return ItinerarysDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateItineraryAsync = createAsyncThunk<Itinerary, FieldValues>(
  "itinerarys/updateDriverAsync",
  async (itinerarys, thunkAPI) => {
    try {
      console.log("dataitinerarysup", itinerarys);
      const ItinerarysDto = await agent.Itinerarys.createAndUpdateItinerery({
        itineraryId: itinerarys.itineraryId,
        issueTime: itinerarys.issueTime,
        arrivalTime: itinerarys.arrivalTime,
        routeCarsId: itinerarys.routeCarsId,
        carsId: itinerarys.carsId,
      });
      console.log("responsecrateDri", ItinerarysDto);
      return ItinerarysDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const searchItineraryAsync = createAsyncThunk<Itinerary, FieldValues>(
  "itinerarys/searchItineraryAsync",
  async (routename, thunkAPI) => {
    try {
      console.log("dataitinerarysup", routename);
      const ItinerarysDto = await agent.Itinerarys.searchItinerary(
        routename
      );
      console.log("responsecrateIti", ItinerarysDto);
      return ItinerarysDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateIsUseItinararyAsync = createAsyncThunk<Itinerary, FieldValues>(
  "itinerarys/updateIsUseItinararyAsync",
  async (itinerarys, thunkAPI) => {
    try {
      console.log("dataStatus", itinerarys);
      const response = await agent.Itinerarys.ChangeIsUseItinarary(
        itinerarys.Id,
        itinerarys.isUse
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);



export const ItinerarySlice = createSlice({
  name: "drivers",
  initialState,
  reducers: {
    setItinerary: (state, action) => {
      state.itinerary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createItineraryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItineraryAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createItineraryAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(updateItineraryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateItineraryAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateItineraryAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      });
  },
});

export const { setItinerary } = ItinerarySlice.actions;
