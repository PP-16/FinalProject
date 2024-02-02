import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PrivateRouter } from "./RouteAdmin";
import { HomeUser } from "../layout/userLayout/Home";
import { PublicRouter, accountRouter } from "./Router";
import { Login } from "../page/auth/Login";
import { Typography } from "antd";
import { HomeAdmin } from "../layout/adminLayout/Home";
import { store } from "../api/redux/Store/configureStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export const NavigationAccounts = () => {

  const stripePromise = loadStripe('pk_test_51OXblgLHde6FL718IKCwlCOOE8sQPWMrmjhLogdQ6eoSa2yK1xP1GlibMM2ge31jLgUlzVtMEZf8Rxgg6K2MQhuU00BXqapqBU');
  const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'thb',
    payment_method_types: ["card"],
    appearance: {
      /*...*/
    },
  };
 
  const isAuthenticated = store.getState().account.user
  const isAdmin = isAuthenticated && isAuthenticated.roleId == 1;
  return (
    <BrowserRouter>
    {isAuthenticated ? (
      isAdmin ? (
        <HomeAdmin>
          <Routes>
            {PrivateRouter.map((item) => (
              <Route key={item.id} path={item.path} element={item.element} />
            ))}
          </Routes>
        </HomeAdmin>
      ) : (
        <Elements stripe={stripePromise} options={options}>
        <HomeUser>
          <Routes>
            {PublicRouter.map((item) => (
              <Route key={item.id} path={item.path} element={item.element} />
            ))}
          </Routes>
        </HomeUser>
        </Elements>
      )
    ) : (
      <Routes>
        {accountRouter.map((item)=>(
           <Route key={item.id} path={item.path} element={item.element} />
        ))}
      </Routes>
    )}
  </BrowserRouter>
  );
};
