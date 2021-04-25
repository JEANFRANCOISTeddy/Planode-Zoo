import express from 'express';
import { PassController } from '../controllers/pass.controller';


const passRouter = express.Router();

passRouter.get("/", async function (req, res) {
    const passController = await PassController.getInstance();
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const passs = await passController.findAll({
        limit,
        offset
    });
    if (passs !== null) {
        res.status(200);
        res.json(passs);
    } else {
        res.status(409).end();
    }
});





passRouter.get("/:id", async function (req, res) {
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }
    const passController = await PassController.getInstance();
    const pass = await passController.findById({
        where: { id: requestedId }
    });
    if (pass !== null) {
        res.status(200);
        res.json(pass);
    } else {
        res.status(409).end();
    }
});





passRouter.post("/create", async function (req, res) {
    const name = req.body.name;
    const price = req.body.price;
    const route = req.body.route;
    const day_start_validation = req.body.day_start_validation;
    const day_end_validation = req.body.day_end_validation;
    const valid = req.body.valid;

    if (name === undefined || price === undefined || route === undefined || day_start_validation === undefined || day_end_validation === undefined || valid === undefined) {
        res.status(400).end();
        return;
    }
    const spaceController = await PassController.getInstance();
    const pass = await spaceController.create({
        name,
        price,
        route,
        day_start_validation,
        day_end_validation,
        valid
    });

    if (pass === null) {
        res.status(500).end();
    } else {
        res.status(201);
        res.json(pass);
    }

});

passRouter.put("/update/:id", async function (req, res) {
    const passController = await PassController.getInstance();
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }
    /*
        const name = req.body.name;
        const price = req.body.price;
        const route = req.body.route;
        const day_start_validation = req.body.day_start_validation;
        const day_end_validation = req.body.day_end_validation;*/


    const pass = await passController.findById({
        where: { id: requestedId }
    });

    if (pass !== null) {
        pass.name = req.body.name;
        pass.price = req.body.price;
        pass.route = req.body.route;
        pass.day_start_validation = req.body.day_start_validation;
        pass.day_end_validation = req.body.day_end_validation;
        pass.valid = req.body.valid;


        const spaceSaved = await pass.save();
        if (spaceSaved !== null) {
            res.status(200);
            res.json(pass);
        }
    } else {
        res.status(409).end();
    }
});

passRouter.delete("/delete/:id", async function (req, res) {
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }
    const spaceController = await PassController.getInstance();
    const space = await spaceController.deleteById({
        where: { id: requestedId },
        force: true
    });
    if (space !== null) {
        res.status(200);
        res.json(space);
    } else {
        res.status(409).end();
    }
});

export {
    passRouter
};