import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";

const GOOGLE_CLIENT_ID = "375663990298-a0h400tpt07kf9am9d23njpk1db7n0i9.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GoogleOAuthProvider>
);