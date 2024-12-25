import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RouteCar } from "../../models/RouetCar";
import { FieldValues } from "react-hook-form";
import agent, { createFormData } from "../../agent";
import { SystemSetting } from "../../models/SystemSetting";


interface SystemState  {
    system : SystemSetting[] | [],
    loading: boolean;
    error: null;
}

const initialState : SystemState = {
    system : [],
    loading: false,
    error: null,
}
export const fetchSystem = createAsyncThunk("system/fetchSystem", async () => {
    const response = await agent.SystemSetting.getSetting();
    return response;
  });


export const updateSystemAsync = createAsyncThunk<SystemSetting, FieldValues>(
    "system/updateSystemAsync",
    async (system, thunkAPI) => {
      console.log("news",system);
    
      const data = createFormData(system);
      console.log("news.imageNews", system.imageSlide);
  
      for (var formfile of  system.imageSlide) {
        data.append("FormFiles", formfile.originFileObj);
        console.log("sand formfile", formfile);
      }
      
      try {
        const response = await agent.SystemSetting.CreateUpdateSetting(data);
        console.log("response", response);
        return response;
      } catch (error: any) {
        console.log("error : ", error);
        return thunkAPI.rejectWithValue({ error: error.message });
      }
    }
  );

  export const SystemSlice = createSlice({
    name: "drivers",
    initialState,
    reducers: {
      setRoute: (state, action) => {
        state.system = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
      .addCase(fetchSystem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSystem.fulfilled, (state, action) => {
        state.loading = false;
        state.system = action.payload;
      })
      .addCase(fetchSystem.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.error.message;
      })

        .addCase(updateSystemAsync.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(updateSystemAsync.fulfilled, (state) => {
          state.loading = false;
        })
        .addCase(updateSystemAsync.rejected, (state: any, action) => {
          state.loading = false;
          state.error = action.error.message || "feiled to update";
        })
       ;
    },
  });
  
  export const { setRoute } = SystemSlice.actions;
  