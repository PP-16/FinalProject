import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { OrderPastDue, OrderRent, OrderRentItem } from "../../models/Order";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";
import { notification } from "antd";
import { log } from "console";

interface OrderRentState {
  orders: OrderRent[] | [];
  userOrders: OrderRent[] | [];
  orderItem: OrderRentItem[] | [];
  orderItemList: OrderRentItem[] | [];
  orderPastList:OrderPastDue[]|[];
  ordereds:OrderRent[] | [];
  totalPriceOrder:[]|null;
  loading: boolean;
  error: null;
}

const initialState: OrderRentState = {
  orders: [],
  userOrders:[],
  orderItem: [],
  orderItemList: [],
  orderPastList:[],
  ordereds:[],
  totalPriceOrder:[],
  loading: false,
  error: null,
};
export const fetchOrder = createAsyncThunk("order/fetchOrder", async () => {
  const response = await agent.OrderRent.getOrder();
  return response;
});

export const fetchOrderItem = createAsyncThunk(
  "order/fetchOrderItem",
  async () => {
    const response = await agent.OrderRent.getOrderItem();
    return response;
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async () => {
    const response = await agent.OrderRent.getOrderByPassentger();
    return response;
  }
);

export const fetchOrderPast = createAsyncThunk("order/fetchOrderPast", async () => {
  const response = await agent.OrderRent.getOrderPastDue();
  return response;
});

export const fetchTotalPriceOrder = createAsyncThunk("order/fetchTotalPriceOrder", async () => {
  const response = await agent.OrderRent.getOrderTotalByReturn();
  console.log("responsegetOrderTotalByReturn",response);
  
  return response;
});


export const createOrderRentAsync = createAsyncThunk<OrderRentItem,FieldValues
>("orders/createOrderRentAsync", async (orders, thunkAPI) => {
  try {
    console.log("dataOrders", orders);
    const response = await agent.OrderRent.createOrderRents(orders);
    console.log("responsecreRentItem", response);
    return response;
  } catch (error: any) {
    console.log("error : ", error);
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const updateStatusOrderAsync = createAsyncThunk<OrderRent, FieldValues>(
  "orders/updateStatusOrderAsync",
  async (orders, thunkAPI) => {
    try {
      console.log("dataStatus", orders);
      const response = await agent.OrderRent.updataStatus(
        orders.ID,
        orders.Status
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);
export const confirmReturnCarOrderAsync = createAsyncThunk<OrderRent,FieldValues>("orders/confirmReturnCarOrderAsync", async (orders, thunkAPI) => {
  try {
    console.log("dataStatus", orders);
    const response = await agent.OrderRent.confirmReturn(orders.ID, true);
    console.log("responseupStatus", response);
    return response;
  } catch (error: any) {
    console.log("error : ", error);
    return thunkAPI.rejectWithValue({ error: error.message });
  }
});

export const CheckPaiedOrderPastAsync = createAsyncThunk<OrderPastDue, FieldValues>(
  "order/CheckPaiedOrderPastAsync",
  async (order, thunkAPI) => {
    try {
      console.log("CheckPaiedOrderPastAsync", order);
      const response = await agent.OrderRent.paiedOrderPast(
        order.Id,
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const OrderRentSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
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
        notification.error({
          message: "ล้มเหลว",
          description: `รถหมายเลขทะเบียนนี้ถูกเลือกแล้ว`,
        });
        console.log(
          `Item with carsId ${action.payload.carsId} is already in the cart.`
        );
        return;
      }
      const updatedCartItems = [...existingCartItems, action.payload];
      state.orderItemList = updatedCartItems;
      console.log("orderItemList", state.orderItemList);
      localStorage.setItem("addcart", JSON.stringify(updatedCartItems));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderItem.fulfilled, (state, action) => {
        state.loading = false;
        state.orderItem = action.payload;
      })
      .addCase(fetchOrderItem.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        console.log("action.payload",action.payload);
        
      })
      .addCase(fetchUserOrders.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(fetchOrderPast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderPast.fulfilled, (state, action) => {
        state.loading = false;
        state.orderPastList = action.payload;
      })
      .addCase(fetchOrderPast.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(createOrderRentAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderRentAsync.fulfilled, (state,action:any) => {
        state.loading = false;
        state.ordereds = action.payload;
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
      })

      .addCase(confirmReturnCarOrderAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmReturnCarOrderAsync.fulfilled, (state) => {
        state.loading = false;
        // state.order = action.payload;
        notification.success({
          message: "สำร็จ",
          description: "คืนนรถสำเร็จ",
        });
      })
      .addCase(confirmReturnCarOrderAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: "ล้มเหลว",
          description: "กรุณาตรวจสอบข้อมูลอีกครั้ง.",
        });
      })

      .addCase(CheckPaiedOrderPastAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(CheckPaiedOrderPastAsync.fulfilled, (state) => {
        state.loading = false;
        // state.order = action.payload;
        notification.success({
          message: "สำร็จ",
          description: "ขอบคุณที่ใช้บริการเช่ารถกับเรา.",
        });
      })
      .addCase(CheckPaiedOrderPastAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: "ล้มเหลว",
          description: "กรุณาตรวจสอบข้อมูลอีกครั้ง.",
        });
      })
      ;
  },
});

export const { setOrders, addTooCart } = OrderRentSlice.actions;
