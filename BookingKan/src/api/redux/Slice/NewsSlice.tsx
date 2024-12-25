import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { notification } from "antd";
import { FieldValues } from "react-hook-form";
import agent, { createFormData } from "../../agent";
import { News } from "../../models/News";

interface NewsState {
  news: News[] | [];
  loading: boolean;
  error: null;
}

const initialState: NewsState = {
  news: [],
  loading: false,
  error: null,
};

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await agent.News.getNews();
  return response;
});

export const createNewsAsync = createAsyncThunk<News, FieldValues>(
  "news/createNewsAsync",
  async (news, thunkAPI) => {
    console.log("news",news);
    
    const data = createFormData(news);
    console.log("news.imageNews", news.imageNews);

    for (var formfile of  news.imageNews) {
      data.append("FormFiles", formfile.originFileObj);
      console.log("sand formfile", formfile);
    }
    
    try {
      const response = await agent.News.CreateUpdateNews(data);
      console.log("response", response);
      return response;
    } catch (error: any) {
      console.log("error : ", error);
      return thunkAPI.rejectWithValue({ error: error.message });
    }
  }
);

export const NewsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    setPayments: (state, action) => {
      state.news = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewsAsync.fulfilled, (state) => {
        state.loading = false;
        notification.success({
          message: "สำร็จ",
          description: "สร้างหรือแก้ไขข่าว/ประชาสัมพันธ์สำเร็จ",
        });
      })
      .addCase(createNewsAsync.rejected, (state: any, action) => {
        state.loading = false;
        state.error = action.error.message || "feiled to update";
        notification.error({
          message: "ล้มเหลว",
          description: "กรุณาตรวจสอบข้อมูลอีกครั้ง.",
        });
      })


      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action: any) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNews.rejected, (state: any, action) => {
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

export const {} = NewsSlice.actions;
