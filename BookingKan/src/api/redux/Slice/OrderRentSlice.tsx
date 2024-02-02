import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderRent, OrderRentItem } from "../../models/Order";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { notification } from "antd";
import { log } from "console";

interface OrderRentState {
  order: OrderRent | null;
  orderItem: OrderRentItem | null;
  orderItemList: OrderRentItem | [];
  loading: boolean;
  error: null;
}

const initialState: OrderRentState = {
  order: null,
  orderItem: null,
  orderItemList: [],
  loading: false,
  error: null,
};

export const createOrderRentAsync = createAsyncThunk< OrderRentItem,FieldValues>
("orders/createOrderRentAsync", async (orders, thunkAPI) => {
  try {
    console.log("dataOrders", orders);
    const response = await agent.OrderRent.createOrderRents({
      passengerName: orders.passengerName,
      idCardNumber: orders.idCardNumber,
      email: orders.email,
      phone: orders.phone,
      orderRentItems: [
        {
          orderRentItemId: 0,
          quantity: orders.quantity,
          itemPrice: orders.itemPrice,
          dateTimePickup: orders.dateTimePickup,
          dateTimeReturn: orders.dateTimeReturn,
          placePickup: orders.placePickup,
          placeReturn: orders.placeReturn,
          carsId: orders.carsId,  
          driverId: orders.driverId,
        },
      ],
    });
    console.log("responsecreRentItem", response);
    return response;
  } catch (error: any) {
    console.log("error : ", error);
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const OrderRentSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.order = action.payload;
    },
    addTooCart: (state: any, action) => {
      const storedCartItems = localStorage.getItem("addcart");
      const existingCartItems = storedCartItems
        ? JSON.parse(storedCartItems)
        : [];

      // Check if the carsId of the item to be added already exists in the cart
      const isItemAlreadyInCart = existingCartItems.some(
        (item: any) => item.carsId === action.payload.carsId
      );

      if (isItemAlreadyInCart) {
        // If the item already exists, you might want to handle this case
        notification.error({
          message: "ล้มเหลว",
          description: `รถหมายเลขทะเบียนนี้ถูกเลือกแล้ว`,
        });
        console.log(
          `Item with carsId ${action.payload.carsId} is already in the cart.`
        );

        // You can return or perform additional actions as needed
        return;
      }

      // If the item is not in the cart, add it
      const updatedCartItems = [...existingCartItems, action.payload];
      state.orderItemList = updatedCartItems;
      console.log("orderItemList", state.orderItemList);
      localStorage.setItem("addcart", JSON.stringify(updatedCartItems));
      window.location.reload();
    },
    // addAsync:(state:any,action)=>{
    //  const existingOrderItemList = JSON.parse(localStorage.getItem(`user-${action.payload}`) || "[]");
    //  const updatedOrderItemList = [...existingOrderItemList, ...state.orderItemList];
    //  state.orderItemList = updatedOrderItemList;
    //  localStorage.setItem(`user-${action.payload}`, JSON.stringify(updatedOrderItemList));
    // } ,
    // clearCart: (state, action) => {
    //   console.log(action.payload);

    //   localStorage.removeItem(`user-${action.payload}`);
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderRentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderRentAsync.fulfilled, (state) => {
        state.loading = false;
        notification.success({
          message: "สำร็จ",
          description: "ขอบคุณที่ใช้บริการเช่ารถกับเรา.",
        });
      })
      .addCase(createOrderRentAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: "ล้มเหลว",
          description: "กรุณาตรวจสอบข้อมูลอีกครั้ง.",
        });
      });
  },
});

export const { setOrders, addTooCart } = OrderRentSlice.actions;
