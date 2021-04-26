import express from "express";
import {UserController} from "../controllers/user.controller";

export async function openMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if(auth !== undefined) {
        const token = auth.slice(7);
        const userController = await UserController.getInstance();
        const session = await userController.getSession(token);
        if(session !== null) {
            const user = await session.getUser();
            if(user.role !== "visitor"){
                next();
                return;
            }else{
                res.status(401).end();
                return;
            }
        } else {
            res.status(403).end();
            return;
        }
    } else {
        res.status(401).end();
    }
}