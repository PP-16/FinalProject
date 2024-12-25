import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderRent, OrderRentItem } from "../../models/Order";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { notification } from "antd";
import { log } from "console";
import { Payment } from "../../models/Payment";

interface PaymentState {
  payments: Payment | null;
  loading: boolean;
  error: null;
}

const initialState: PaymentState = {
  payments: null,
  loading: false,
  error: null,
};

export const createPaymentAsync = createAsyncThunk<Payment, FieldValues>(
  "payments/createPaymentAsync",
  async (payment, thunkAPI) => {
    try {
      console.log("datapayment", payment);
      const response = await agent.Payments.createPayment(payment);
      console.log("responsecreRentItem", response);
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
      const response = await agent.Payments.refundBooking(
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

export const PaymentSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.payments = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentAsync.fulfilled, (state, action: any) => {
        state.loading = false;
        state.payments = action.payload;
        notification.success({
          message: "สำร็จ",
          description: "ขอบคุณที่ชำระเงิน.",
        });
      })
      .addCase(createPaymentAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: "ล้มเหลว",
          description: "กรุณาตรวจสอบข้อมูลอีกครั้ง.",
        });
      })
      .addCase(createRefundPaymentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRefundPaymentAsync.fulfilled, (state) => {
        // state.seatBookedPending = action.payload;
        state.loading = false;
      })
      .addCase(createRefundPaymentAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      });
  },
});

export const {} = PaymentSlice.actions;
