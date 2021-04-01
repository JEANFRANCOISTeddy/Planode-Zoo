import express from 'express';
import {UserController} from '../controllers/user.controller';
import {DatabaseUtils} from "../config/db.config";

const router = express.Router();

router.get("/", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const userList = await userController.getAll({
        limit,
        offset
    });
    res.json(userList);
});

router.get("/:id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const user = await userController.getById(req.params.id);
    if(user === null) {
        res.status(404).end();
    } else {
        res.json(user);
    }
});

router.post("/", async function(req, res) {
    const name = req.body.name;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const admin = req.body.admin;
    if(name === undefined || firstname === undefined || mail === undefined || phone === undefined || admin === undefined) {
        res.status(400).end();
        return;
    }
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const user = await userController.create({
        name,
        firstname,
        mail,
        phone,
        admin
    });

    if(user === null) {
        res.status(500).end();
    } else {
        res.status(201);
        res.json(user);
    }

});




router.put("/", async function(req, res) {
    
    const id = req.body.id
    const name = req.body.name;
    const firstname = req.body.firstname;
    const mail = req.body.mail;
    const phone = req.body.phone;
    const admin = req.body.admin;

    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const user = await userController.update({
        id,
        name,
        firstname,
        mail,
        phone,
        admin
    });
    if(user === null){
        res.status(404);
    }else{
        res.json(user);
    }


});

router.delete("/", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const userController = new UserController(connection);
    const success = await userController.removeById(req.params.id);
    if(success) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

export default router;