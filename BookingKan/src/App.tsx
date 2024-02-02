//import { HomeAdmin } from './layout/adminLayout/Home'
// import { HomeUser } from './layout/userLayout/Home'

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomeUser } from "./layout/userLayout/Home";
import { PublicRouter } from "./routers/Router";
import { HomeAdmin } from "./layout/adminLayout/Home";
import { PrivateRouter } from "./routers/RouteAdmin";
import { Provider, useDispatch, useSelector } from "react-redux";
import { store, useAppDispatch } from "./api/redux/Store/configureStore";
import { useCallback, useState, useEffect } from "react";
import { onLogin, setUser } from "./api/redux/Slice/AccountSlice";
import { NavigationAccounts } from "./routers/NavigationAccount";

function App() {

  return (
    <Provider store={store}>
      <NavigationAccounts/>
    </Provider>
  );
}

export default App;
