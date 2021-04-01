import express from 'express';
import {PassController} from '../controllers/pass.controller';
import {DatabaseUtils} from "../config/db.config";

const router = express.Router();

router.get("/", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const passController = new PassController(connection);
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const passList = await passController.getAll({
        limit,
        offset
    });
    res.json(passList);
});
router.get("/:id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const passController = new PassController(connection);
    const pass = await passController.getById(req.params.id);
    if(pass === null) {
        res.status(404).end();
    } else {
        res.json(pass);
    }
});

router.post("/", async function(req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const route = req.body.route;
    const day_start_validation = req.body.day_start_validation;
    const day_end_validation = req.body.day_end_validation;
    if(name === undefined || price === undefined || route === undefined || day_start_validation === undefined || day_end_validation === undefined ) {
        res.status(400).end();
        return;
    }

    const connection = await DatabaseUtils.getConnection();
    const passController = new PassController(connection);
    const pass = await passController.create({
        name,
        price,
        route,
        day_start_validation,
        day_end_validation
    });

    if(pass === null) {
        res.status(500).end();
    } else {
        res.status(201);
        res.json(pass);
    }

});

router.put("/:id", async function(req, res) {
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const route = req.body.route;
    const day_start_validation = req.body.day_start_validation;
    const day_end_validation = req.body.day_end_validation;

    const connection = await DatabaseUtils.getConnection();
    const passController = new PassController(connection);
    const pass = await passController.update({
        id,
        name,
        price,
        route,
        day_start_validation,
        day_end_validation
    });
    if(pass === null){
        res.status(404);
    }else{
        res.json(pass);
    }
});

router.delete("/id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const passController = new PassController(connection);
    const success = await passController.removeById(req.params.id);
    if(success) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});



export default router;