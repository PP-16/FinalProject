import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Passentger } from "../../models/Passentger";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { message, notification } from "antd";
import { accountRouter } from "../../../routers/Router";

interface PassengerState {
  user: Passentger | null;
  token: object | null;
  loading: boolean;
  error: null;
}

const storedUser = localStorage.getItem("user");
const initialState: PassengerState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: null,
  loading: false,
  error: null,
};

export const signInUser = createAsyncThunk<Passentger, FieldValues>(
  "account/Userlogin",
  async (data, thunkAPI) => {
    try {
      console.log("userData", data);

      const userDto = await agent.Account.login({
        email: data.email,
        password: data.password,
      });
      console.log("user", userDto);
      // localStorage.setItem("user ", JSON.stringify(userDto));
   
      return userDto;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const registerUser = createAsyncThunk<Passentger, FieldValues>(
  "account/UserRegister",
  async (data, thunkAPI) => {
    try {
      console.log("da", data);
      const userDto = await agent.Account.register({
        passengerName: data.passengerName,
        idCardNumber: data.idCardNumber,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      return userDto;
    } catch (error: any) {
      console.error("Registration error:", error.data); // Log the detailed error response
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const ChangePassword = createAsyncThunk<Passentger, FieldValues>(
  "account/ChangePassword",
  async (data, thunkAPI) => {
    try {
      console.log("da", data);
      const userDto = await agent.Account.changePass(data.newPass,data.chackNew)
      return userDto;
    } catch (error: any) {
      console.error("Registration error:", error.data); // Log the detailed error response
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);




export const updateIsUseAsync = createAsyncThunk<Passentger, FieldValues>(
  "cars/updateStatusBookingAsync",
  async (passenger, thunkAPI) => {
    try {
      console.log("dataStatus", passenger);
      const response = await agent.Account.ChangeIsUse(
        passenger.Id,
        passenger.isUse
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const updateRoleAsync = createAsyncThunk<Passentger, FieldValues>(
  "cars/updateStatusBookingAsync",
  async (role, thunkAPI) => {
    try {
      console.log("datarole", role);
      const response = await agent.Account.ChangeRole(
        role.passentgerId,
        role.roleId
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const AccountSlice = createSlice({
  name: "account",
  initialState,

  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
    },
    onLogin: (state, action) => {
      state.token = action.payload.token; // Assuming the token is part of the payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signInUser.fulfilled, (state:any, action:any) => {
        state.loading = false;
        const payload = action.payload;
         state.user = payload;
          localStorage.setItem('user', JSON.stringify(payload));
          window.location.reload();
      })
      .addCase(signInUser.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: `เกิดข้อผิดพลาด!`,
          description: "กรุณาลองใหม่อีกครั้ง!!",
          placement: "top",
        });
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })
      .addCase(ChangePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ChangePassword.fulfilled, (state) => {
        state.loading = false;
        notification.success({
          message: `สำเร็จ!`,
          description: "เปลี่ยนระหัสผ่านสำเร็จแล้ว!!",
          placement: "top",
        });
      })
      .addCase(ChangePassword.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: `เกิดข้อผิดพลาด!`,
          description: "กรุณาลองใหม่อีกครั้ง!!",
          placement: "top",
        });
      });
  },
});

export const { signOut, setUser, onLogin } = AccountSlice.actions;
