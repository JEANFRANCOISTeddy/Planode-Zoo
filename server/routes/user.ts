import express from 'express';
import {UserController} from '../controllers/user.controller';

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

export {
    userRouter
};