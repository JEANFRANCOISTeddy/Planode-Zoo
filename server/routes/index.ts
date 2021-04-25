import {Express} from "express";
import {userRouter} from "./user";
import {spaceRouter} from "./space";
import {passRouter} from "./pass";

export function buildRoutes(app: Express) {
    app.use("/user", userRouter);
    app.use("/space", spaceRouter);
    app.use("/pass", passRouter );
}