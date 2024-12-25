import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Booking } from "../../models/Booking";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { notification } from "antd";
import { Payment } from "../../models/Payment";
import moment from "moment";

interface BookingState {
  bookings: Booking[] | [];
  bookingItinerary: Booking[] | [];
  loading: boolean;
  error: null;
  seatBooked: [];
  seatBookedPending: [];
  booked: [];
  bookById:Booking[]|[]
  bookByPassent:Booking[]|[]
}

const initialState: BookingState = {
  bookings: [],
  bookingItinerary: [],
  loading: false,
  error: null,
  seatBooked: [],
  seatBookedPending: [],
  booked: [],
  bookById:[],
  bookByPassent:[],
};

export const fetchBookingByItineraryAsync = createAsyncThunk<
  Booking,
  FieldValues
>("bookings/fetchBookingByItineraryAsync", async (bookings, thunkAPI) => {
  try {
    console.log("data", bookings);
    const response = await agent.Bookings.getBookingsByItinerary(
      bookings.itineraryId,
      bookings.dateBooking
    );
    console.log("responsecreCheckSeat", response);
    return response;
  } catch (error: any) {
    console.log("error : ", error);
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});


export const fetchBookingForCanCle = createAsyncThunk(
  "bookings/fetchBookingForCanCle",
  async () => {
    const response = await agent.Bookings.checkforCancel();
    return response;
  }
);

export const fetchBookingByPassentger = createAsyncThunk(
  "bookings/fetchBookingByPassentger",
  async () => {
    const response = await agent.Bookings.getByPassentger();
    return response;
  }
);
export const fetchBooking = createAsyncThunk(
  "bookings/fetchBooking",
  async () => {
    const response = await agent.Bookings.getBooking();
    return response;
  }
);

export const fetchBookingById = createAsyncThunk<Booking, any>(
  "bookings/fetchBookingById",
  async (bookings, thunkAPI) => {
    try {
      console.log("databookings", bookings);
      const response = await agent.Bookings.getBookingById(bookings)
      console.log("responsecreBook", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

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
        note: bookings.note,
      });
      console.log("responsecreBook", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const createEmployeeBookingsAsync = createAsyncThunk<
  Booking,
  FieldValues
>("bookings/createEmployeeBookingsAsync", async (bookings, thunkAPI) => {
  try {
    console.log("data", bookings);
    const response = await agent.Bookings.createEmployeeBooking(bookings);
    console.log("responsecreBook", response);
    return response;
  } catch (error: any) {
    console.log("error : ", error);
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

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
  "bookings/updateStatusBookingAsync",
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
  "bookings/updateDateBookingAsync",
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

export const CheckInBookingAsync = createAsyncThunk<Booking, FieldValues>(
  "bookings/CheckInBookingAsync",
  async (booking, thunkAPI) => {
    try {
      console.log("bookingdataStatus", booking);
      const response = await agent.Bookings.CheckInBooking(
        booking.Id,
        booking.checkIn
      );
      console.log("responseupStatus", response);
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
      .addCase(fetchBookingByItineraryAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingByItineraryAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.bookingItinerary = action.payload;
      })
      .addCase(fetchBookingByItineraryAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })


      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action: any) => {
        state.loading = false;
        state.bookById = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })

      .addCase(fetchBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action: any) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBooking.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })

      .addCase(fetchBookingByPassentger.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingByPassentger.fulfilled, (state, action: any) => {
        state.loading = false;
        state.bookByPassent = action.payload;
      })
      .addCase(fetchBookingByPassentger.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })


      .addCase(createBookingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBookingsAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.booked = action.payload;
      })
      .addCase(createBookingsAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(CheckSeatEmptyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckSeatEmptyAsync.fulfilled, (state, action: any) => {
        if (
          action.payload === null ||
          action.payload === undefined ||
          action.payload.length === 0
        ) {
          console.log("ac.p", action.payload);
        } else {
          state.seatBooked = action.payload;
        }

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
      .addCase(updateStatusBookingAsync.fulfilled, (state) => {
        // state.seatBookedPending = action.payload;
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
      .addCase(updateDateBookingAsync.fulfilled, (state) => {
        // state.seatBookedPending = action.payload;
        state.loading = false;
      })
      .addCase(updateDateBookingAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })

      .addCase(createEmployeeBookingsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployeeBookingsAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.booked = action.payload;
      })
      .addCase(createEmployeeBookingsAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(CheckInBookingAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckInBookingAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(CheckInBookingAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      });
  },
});

export const { setBookings } = BookingsSlice.actions;
