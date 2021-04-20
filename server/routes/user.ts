import express from 'express';
import {UserController} from '../controllers/user.controller';
import {authMiddleware} from "../middlewares/auth.middleware";

const userRouter = express.Router();

/**
 * Creation of new user
 */
userRouter.post("/create", async function(req, res) {
    const lastname = req.body.lastname;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const password = req.body.password;
    const admin = req.body.admin;
    const role = req.body.role;

    if( lastname === undefined || firstname === undefined || mail === undefined || phone === undefined || password === undefined || admin === undefined  || role === undefined) {
        res.status(400).end();
        return;
    }

    if(role !== "receptionist" || role !== "caretaker" || role !== "maintenance" || role !== "seller" || role !== "visitor") {
        console.log(role);
        console.log(typeof role);
        console.log("visitor");
        console.log(typeof "visitor");
        res.status(400).end();
        return;
    }

    const userController = await UserController.getInstance();
    const user = await userController.create({
        lastname,
        firstname,
        mail,
        phone,
        password,
        admin,
        role
    });

    if(user !== null) {
        res.status(201);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

/**
 * Log user and create session
 */
userRouter.post("/login", async function(req, res) {
    const mail = req.body.mail;
    const password = req.body.password;
    if(mail === undefined || password === undefined) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const session = await userController.login(mail, password);
    if(session === null) {
        res.status(404).end();
        return;
    } else {
        res.json({
            token: session.token
        });
    }
});

/**
 * Find a user by his id
 */
userRouter.get("/:id", async function(req, res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.findById(requestedId);
    if(user !== null) {
        res.status(200);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

/**
 * Logout and delete session
 */
userRouter.delete("/logout/:token", authMiddleware, async function(req, res) {
    const token = req.params.token;
    console.log(token);
    if(token === null) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const session = await userController.logout({
        where: { token: token },
        force : true
    });
    console.log(session);
    if(session !== null) {
        res.status(200);
        res.json(session);
    } else {
        res.status(409).end();
    }
});

export {
    userRouter
};