import { configureStore } from "@reduxjs/toolkit";
import app from "./appSlice";
import crew from "./crewSlice";
import dashboard from "./dashboardSlice";

export const store = configureStore({ reducer: { app, crew, dashboard } });
