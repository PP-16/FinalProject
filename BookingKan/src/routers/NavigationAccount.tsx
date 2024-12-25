import { BrowserRouter, Route, Routes } from "react-router-dom";
import { EmpolyeeRouter, NoAdmin, PrivateRouter } from "./RouteAdmin";
import { HomeUser } from "../layout/userLayout/Home";
import { PublicRouter, accountRouter } from "./Router";
import { HomeAdmin } from "../layout/adminLayout/Home";
import {
  store,
  useAppDispatch,
  useAppSelector,
} from "../api/redux/Store/configureStore";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { EmpolyeeLayout } from "../layout/adminLayout/EmpolyeeLayout";
import { useEffect, useState } from "react";
import agent from "../api/agent";
import { PathImage } from "./PathImage";
import { fetchSystem } from "../api/redux/Slice/SystemSlice";

export const NavigationAccounts = () => {
  const stripePromise = loadStripe(
    "pk_test_51OXblgLHde6FL718IKCwlCOOE8sQPWMrmjhLogdQ6eoSa2yK1xP1GlibMM2ge31jLgUlzVtMEZf8Rxgg6K2MQhuU00BXqapqBU"
  );
  const options: any = {
    mode: "payment",
    amount: 1099,
    currency: "thb",
    payment_method_types: ["card"],
    appearance: {
      /*...*/
    },
  };
  const [admin, setAdmin] = useState([]);
  const system = useAppSelector((t) => t.system.system);
  const dispath = useAppDispatch();
  // console.log("system", system);

  useEffect(() => {
    dispath(fetchSystem());

    agent.Account.getAdmin().then((admin) => setAdmin(admin));

    const existingFavicons = document.querySelectorAll(
      'link[rel="icon"], link[rel="shortcut icon"]'
    );
    existingFavicons.forEach((favicon: any) =>
      favicon.parentNode.removeChild(favicon)
    );

    // Create a new link element for the favicon
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = PathImage.logo + system[0]?.logo;

    // Append the new favicon to the head
    document.head.appendChild(link);
    document.title = system[0]?.nameWeb;
  }, [system.length !== 0]);
  // console.log("admin", admin);
  // console.log("ImgLogo", PathImage.logo + system[0]?.logo);

  const isAuthenticated = store.getState().account.user;
  const isAdmin = isAuthenticated && isAuthenticated.roleId == 1;
  const isEmployee = isAuthenticated && isAuthenticated.roleId == 3;

  return (
    <BrowserRouter>
      <Elements stripe={stripePromise} options={options}>
        {isAuthenticated ? (
          isAdmin ? (
            <HomeAdmin>
              <Routes>
                {PrivateRouter.map((item) => (
                  <Route
                    key={item.id}
                    path={item.path}
                    element={item.element}
                  />
                ))}
              </Routes>
            </HomeAdmin>
          ) : isEmployee ? (
            <EmpolyeeLayout>
              <Routes>
                {EmpolyeeRouter.map((item) => (
                  <Route
                    key={item.id}
                    path={item.path}
                    element={item.element}
                  />
                ))}
              </Routes>
            </EmpolyeeLayout>
          ) : (
            <HomeUser>
              <Routes>
                {PublicRouter.map((item) => (
                  <Route
                    key={item.id}
                    path={item.path}
                    element={item.element}
                  />
                ))}
              </Routes>
            </HomeUser>
          )
        ) : admin.length == 0 ? (
          <Routes>
            {NoAdmin.map((item) => (
              <Route key={item.id} path={item.path} element={item.element} />
            ))}
          </Routes>
        ) : (
          <Routes>
            {accountRouter.map((item) => (
              <Route key={item.id} path={item.path} element={item.element} />
            ))}
          </Routes>
        )}
      </Elements>
    </BrowserRouter>
  );
};
