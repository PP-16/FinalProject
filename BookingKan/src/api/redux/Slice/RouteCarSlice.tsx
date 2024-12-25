import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RouteCar } from "../../models/RouetCar";
import { FieldValues } from "react-hook-form";
import agent from "../../agent";


interface RouteCarState  {
    routeCars : RouteCar[] | [],
    loading: boolean;
    error: null;
}

const initialState : RouteCarState = {
    routeCars : [],
    loading: false,
    error: null,
}

export const fetchRouteCars = createAsyncThunk(
  "route/fetchRouteCars",
  async () => {
    const response = await agent.RoustCars.getRoute();
    return response;
  }
);

export const createRouteAsync = createAsyncThunk<RouteCar, FieldValues>(
  "route/createRouteAsync",
  async (route, thunkAPI) => {
    try {
      console.log("data", route);
      const RouterDto = await agent.RoustCars.createAndUpdateRoute({
        destinationName : route.destinationName,
        originName : route.originName,
    });
      console.log("responseupClass", RouterDto);
      return RouterDto;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const updateIsUseRouteAsync = createAsyncThunk<RouteCar, FieldValues>(
  "route/updateIsUseRouteAsync",
  async (route, thunkAPI) => {
    try {
      console.log("dataStatus", route);
      const response = await agent.RoustCars.ChangeIsUseRoute(
        route.Id,
        route.isUse
      );
      console.log("responseupStatus", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);


export const updateRouteAsync = createAsyncThunk<RouteCar, FieldValues>(
    "route/updateRouteAsync",
    async (route, thunkAPI) => {
      try {
        console.log("datarouteup", route);
        const RouterDto = await agent.RoustCars.createAndUpdateRoute({
            destinationName : route.destinationName,
            originName : route.originName,
            routeCarsId : route.routeCarsId
        });
        console.log("responsecrateRouter", RouterDto);
        return RouterDto;
      } catch (error: any) {
        console.log("error : ", error);
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  );

  export const RouteSlice = createSlice({
    name: "drivers",
    initialState,
    reducers: {
      setRoute: (state, action) => {
        state.routeCars = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder

      .addCase(fetchRouteCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRouteCars.fulfilled, (state, action:any) => {
        state.loading = false;
        state.routeCars = action.payload;
      })
      .addCase(fetchRouteCars.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
      })

        .addCase(updateRouteAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateRouteAsync.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateRouteAsync.rejected, (state: any, action) => {
          state.loading = false;
          state.error = action.error.message || "feiled to update";
        })

        .addCase(createRouteAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(createRouteAsync.fulfilled, (state) => {
          state.loading = false;
        
        })
        .addCase(createRouteAsync.rejected, (state: any, action) => {
          state.loading = false;
          state.error = action.error.message || "feiled to update";
        });
    },
  });
  
  export const { setRoute } = RouteSlice.actions;
  