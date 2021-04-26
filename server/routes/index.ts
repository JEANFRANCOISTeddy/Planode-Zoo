import {Express} from "express";
import {userRouter} from "./user";
import {spaceRouter} from "./space";
import {passRouter} from "./pass";
import {animalRouter} from "./animal";
import {zooRouter} from "./zoo";

export function buildRoutes(app: Express) {
    app.use("/user", userRouter);
    app.use("/space", spaceRouter);
    app.use("/animal", animalRouter);
    app.use("/zoo", zooRouter);
    app.use("/pass", passRouter );
}