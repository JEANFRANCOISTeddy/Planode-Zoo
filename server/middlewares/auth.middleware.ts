import express from "express";
import {UserController} from "../controllers/user.controller";

export async function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const auth = req.headers["authorization"];
    if(auth !== undefined) {
        const token = auth.slice(7);
        const authController = await UserController.getInstance();
        const session = await authController.getSession(token);
        if(session !== null) {
            next();
            return;
        } else {
            res.status(403).end();
            return;
        }
    } else {
        res.status(401).end();
    }
}
