import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Itinerary } from "../../models/Itinerary";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { message, notification } from "antd";

interface ItineraryState {
  itinerary: Itinerary[] | [];
  loading: boolean;
  error: null;
}
const initialState: ItineraryState = {
  itinerary: [],
  loading: false,
  error: null,
};

export const fetchItinarery = createAsyncThunk(
  "itinerarys/fetchItinarery",
  async () => {
    const response = await agent.Itinerarys.getItinarery();
    return response;
  }
);

export const createItineraryAsync = createAsyncThunk<Itinerary, FieldValues>(
  "itinerarys/createDriverAsync",
  async (itinerarys, thunkAPI) => {
    try {
      console.log("dataitinerarysup", itinerarys);
      const ItinerarysDto = await agent.Itinerarys.createAndUpdateItinerery(
        itinerarys
      );
      console.log("responsecrateDri", ItinerarysDto);
      return ItinerarysDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const searchItineraryAsync = createAsyncThunk<Itinerary, string>(
  "itinerarys/searchItineraryAsync",
  async (routename, thunkAPI) => {
    try {
      console.log("dataitinerarysup", routename);
      const ItinerarysDto = await agent.Itinerarys.searchItinerary(routename);
      console.log("responsecrateIti", ItinerarysDto);
      return ItinerarysDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateIsUseItinararyAsync = createAsyncThunk<
  Itinerary,
  FieldValues
>("itinerarys/updateIsUseItinararyAsync", async (itinerarys, thunkAPI) => {
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
});

export const deleteItinararyById = createAsyncThunk<Itinerary, any>(
  "itinerarys/deleteItinararyById",
  async (itinerarys, thunkAPI) => {
    try {
      console.log("deleteItinararyById", itinerarys);
      const response = await agent.Itinerarys.dalete(itinerarys);
      if (response.status === 400 && response.data === "มีคนใช้อยู่") {
        return thunkAPI.rejectWithValue({ error: "Itinerary is still in use" });
      }
      console.log("deleteItinararyById", response);
      return response.data;
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
      .addCase(fetchItinarery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItinarery.fulfilled, (state, action: any) => {
        state.loading = false;
        state.itinerary = action.payload;
      })
      .addCase(fetchItinarery.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })

      .addCase(searchItineraryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchItineraryAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.itinerary = action.payload;
      })
      .addCase(searchItineraryAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })

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
      .addCase(deleteItinararyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteItinararyById.fulfilled, (state) => {
        state.loading = false;
        message.success("ลบสำเร็จ!");
      })
      .addCase(deleteItinararyById.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error || action.error.message;

        if (action.payload?.error.response?.data === "มีคนใช้อยู่") {
          notification.error({
            message: `เกิดข้อผิดพลาด!`,
            description: "ไม่สามารถลบได้: มีคนใช้อยู่",
            placement: "top",
          });
        } else {
          notification.error({
            message: `เกิดข้อผิดพลาด!`,
            description: "กรุณาตรวจสอบใหม่อีกครั้ง",
            placement: "top",
          });
        }
      });
  },
});

export const { setItinerary } = ItinerarySlice.actions;
