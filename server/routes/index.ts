import {Express} from "express";
import {userRouter} from "./user";
import {spaceRouter} from "./space";

export function buildRoutes(app: Express) {
    app.use("/user", userRouter);
    app.use("/space", spaceRouter);
}