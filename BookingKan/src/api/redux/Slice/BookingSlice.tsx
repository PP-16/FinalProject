import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Booking } from "../../models/Booking";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { notification } from "antd";
import { Payment } from "../../models/Payment";
import moment from "moment";

interface BookingState {
  bookings: Booking | null;
  loading: boolean;
  error: null;
  seatBooked: [];
  seatBookedPending: [];
}

const initialState: BookingState = {
  bookings: null,
  loading: false,
  error: null,
  seatBooked: [],
  seatBookedPending: [],
};
export const createBookingsAsync = createAsyncThunk<Booking, FieldValues>(
  "bookings/createBookingsAsync",
  async (bookings, thunkAPI) => { 
    try {
      console.log("data", bookings);
      const response = await agent.Bookings.createBooking({
        bookingId: 0,
        dateAtBooking: bookings.dateAtBooking,
        seatNumbers: bookings.seatNumbers,
        totalPrice: bookings.totalPrice,
        bookingStatus: 0,
        passengerId: bookings.passengerId,
        itineraryId: bookings.itineraryId,
      });
      console.log("responsecreBook", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const CheckSeatEmptyAsync = createAsyncThunk<Booking, FieldValues>(
  "bookings/CheckSeatEmptyAsync",
  async (bookings, thunkAPI) => {
    try {
      console.log("data", bookings);
      const response = await agent.Bookings.getSeatBooking(
        bookings.dateBooking,
        bookings.ItineraryId
      );
      console.log("responsecreCheckSeat", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const CheckSeatPendingAsync = createAsyncThunk<Booking, FieldValues>(
  "bookings/CheckSeatPendingAsync",
  async (bookings, thunkAPI) => {
    try {
      console.log("data", bookings);
      const response = await agent.Bookings.getSeatStatusPending(
        bookings.dateBooking,
        bookings.ItineraryId
      );
      console.log("responsecreCheckSeat", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateStatusBookingAsync = createAsyncThunk<Booking, FieldValues>(
  "cars/updateStatusBookingAsync",
  async (booking, thunkAPI) => {
    try {
      console.log("dataStatus", booking);
      const response = await agent.Bookings.updataStatus(
        booking.ID,
        booking.statusBooking
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateDateBookingAsync = createAsyncThunk<Booking, FieldValues>(
  "cars/updateDateBookingAsync",
  async (booking, thunkAPI) => {
    try {
      console.log("dataDateStatus", booking);
      const response = await agent.Bookings.updateDateBooking(
        booking.itineraryId,
        booking.dateAtBooking,
        booking.seatNumbers
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const createRefundPaymentAsync = createAsyncThunk<Payment, FieldValues>(
  "payment/createRefundPaymentAsync",
  async (payments, thunkAPI) => {
    try {
      console.log("datapayments", payments);
      const response = await agent.Bookings.refundBooking(
        JSON.stringify(payments)
      );
      console.log("responsecreBook", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const BookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    setBookings: (state, action) => {
      state.bookings = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBookingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingsAsync.fulfilled, (state) => {
        state.loading = false;
        // notification.success({
        //   message: 'สำร็จ',
        //   description: 'ขอบคุณที่จองรถกับเรา.',
        // });
      })
      .addCase(createBookingsAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        // notification.error({
        //   message: 'ล้มเหลว',
        //   description: 'กรุณาตรวจสอบข้อมูลอีกครั้ง.',
        // });
      })
      .addCase(CheckSeatEmptyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckSeatEmptyAsync.fulfilled, (state, action: any) => {
        if (
          action.payload === null ||
          action.payload === undefined ||
          action.payload === Array(0)
        ) {
          console.log("ac.p", action.payload);
        }else{ state.seatBooked = action.payload;}
       

        state.loading = false;
      })
      .addCase(CheckSeatEmptyAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(CheckSeatPendingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckSeatPendingAsync.fulfilled, (state, action: any) => {
        state.seatBookedPending = action.payload;
        state.loading = false;
      })
      .addCase(CheckSeatPendingAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(updateStatusBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatusBookingAsync.fulfilled, (state, action: any) => {
        state.seatBookedPending = action.payload;
        state.loading = false;
      })
      .addCase(updateStatusBookingAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(updateDateBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDateBookingAsync.fulfilled, (state, action: any) => {
        state.seatBookedPending = action.payload;
        state.loading = false;
      })
      .addCase(updateDateBookingAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(createRefundPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRefundPaymentAsync.fulfilled, (state, action: any) => {
        state.seatBookedPending = action.payload;
        state.loading = false;
      })
      .addCase(createRefundPaymentAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      });
  },
});

export const { setBookings } = BookingsSlice.actions;
