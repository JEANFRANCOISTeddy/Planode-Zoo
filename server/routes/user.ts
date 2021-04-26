import express from 'express';
import {UserController} from '../controllers/user.controller';
import {userMiddleware} from "../middlewares/auth.middleware";
import {spaceRouter} from "./space";
import {employeeMiddleware} from "../middlewares/employee.middleware";
import {SpaceController} from "../controllers/space.controller";

const userRouter = express.Router();

/**
 * Get all users created
 */
userRouter.get("/", employeeMiddleware, async function(req,res) {
    const userController = await UserController.getInstance();
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const users = await userController.findAll({
        limit,
        offset
    });

    if(users !== null) {
        res.status(200);
        res.json(users);
    } else {
        res.status(409).end();
    }
});

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

    if(role !== "receptionist" && role !== "caretaker" && role !== "maintenance" && role !== "seller" && role !== "visitor") {
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
userRouter.delete("/logout", userMiddleware, async function(req, res) {
    const auth = req.headers["authorization"];
    if(auth === undefined) {
        res.status(400).end();
        return;
    }

    const token = auth.slice(7);
    const userController = await UserController.getInstance();
    const session = await userController.getSession(token);
    if(session == null) {
        res.status(403).end();
        return;
    }

    const session_destroy = await userController.logout({
        where: { id: session.id },
        force : true
    });

    if(session_destroy !== null) {
        res.status(200);
        res.json(session_destroy);
    } else {
        res.status(409).end();
    }
});

/**
 * Modify a created user
 */
userRouter.put("/update/:id", async function(req, res) {
    const userController = await UserController.getInstance();
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }

    const lastname = req.body.lastname;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const password = req.body.password;
    const admin = req.body.admin;
    const role = req.body.role;

    const user = await userController.findById(requestedId);
    if(user !== null){
        user.lastname = req.body.lastname;
        user.firstname = req.body.firstname;
        user.mail = req.body.mail;
        user.phone = req.body.phone;
        user.password = req.body.password;
        user.admin = req.body.admin;
        user.role = req.body.role;

        const userSaved = await user.save();
        if(userSaved !== null){
            res.status(200);
            res.json(user);
        }
    } else {
        res.status(409).end();
    }
});

/**
 * Delete USER with a specify id
 */
userRouter.delete("/delete/:id", employeeMiddleware, async function(req, res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }
    const userController = await UserController.getInstance();
    const user = await userController.deleteById({
        where: { id: requestedId },
        force : true
    });
    if(user !== null) {
        res.status(200);
        res.json(user);
    } else {
        res.status(409).end();
    }
});

export {
    userRouter
};