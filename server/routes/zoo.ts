import express from 'express';
import {ZooController} from '../controllers/zoo.controller';
import {employeeMiddleware} from "../middlewares/employee.middleware";

const zooRouter = express.Router();

/**
 * Creation of new zoo
 */
zooRouter.post("/create", employeeMiddleware, async function(req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const capacity = req.body.capacity;
    const open = req.body.open;

    if( name === undefined || description === undefined || images === undefined || capacity === undefined  || open === undefined) {
        res.status(400).end();
        return;
    }

    const zooController = await ZooController.getInstance();
    const zoo = await zooController.create({
        name,
        description,
        images,
        capacity,
        open
    })

    if(zoo !== null) {
        res.status(201);
        res.json(zoo);
    } else {
        res.status(409).end();
    }
})

/**
 * Open specify zoo
 */
zooRouter.get("/open/:id", employeeMiddleware, async function(req, res) {
    const zooController = await ZooController.getInstance();
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }

    const session = await zooController.findAllSession({
        limit,
        offset
    });
    const zoo = await zooController.open(session, requestedId);

    if(zoo != null) {
        res.send(zoo);
        res.status(200).end();
    } else {
        res.send(zoo);
        res.status(409).end();
    }
});

/**
 * Show zoo data
 */
zooRouter.get("/:id", employeeMiddleware, async function(req,res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }

    const zooController = await ZooController.getInstance();
    const zoo = await zooController.findById(requestedId);
    if(zoo !== null) {
        res.status(200);
        res.json(zoo);
    } else {
        res.status(409).end();
    }
});

/**
 * Modify a created user
 */
zooRouter.put("/update/:id", employeeMiddleware, async function(req,res) {
    const zooController = await ZooController.getInstance();
    const requestedId = req.params.id;
    if (requestedId === null) {
        res.status(400).end();
        return;
    }

    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const capacity = req.body.capacity;
    const open = req.body.open;

    const zoo = await zooController.findById(requestedId);

    if(zoo !== null){
        zoo.name = req.body.name;
        zoo.description = req.body.description;
        zoo.images = req.body.images;
        zoo.capacity = req.body.capacity;
        zoo.open = req.body.open;

        const zooSaved = await zoo.save();
        if(zooSaved !== null){
            res.status(200);
            res.json(zoo);
        }
    } else {
        res.status(409).end();
    }
});

/**
 * Delete Zoo with a specify id
 */
zooRouter.delete("/delete/:id", employeeMiddleware, async function(req, res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }
    const zooController = await ZooController.getInstance();
    const zoo = await zooController.deleteById({
        where: { id: requestedId },
        force : true
    });
    if(zoo !== null) {
        res.status(200);
        res.json(zoo);
    } else {
        res.status(409).end();
    }
});

export {
    zooRouter
};