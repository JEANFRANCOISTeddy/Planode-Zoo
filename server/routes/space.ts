import express from 'express';
import {SpaceController} from '../controllers/space.controller';

const spaceRouter = express.Router();

/**
 * Get all spaces created
 */
spaceRouter.get("/", async function(req, res) {
    const spaceController = await SpaceController.getInstance();
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const spaces = await spaceController.findAll({
        limit,
        offset
    });
    if(spaces !== null) {
        res.status(200);
        res.json(spaces);
    } else {
        res.status(409).end();
    }
});

/**
 * Creation of new space
 */
spaceRouter.post("/create", async function(req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const type = req.body.type;
    const capacity = req.body.capacity;
    const time = req.body.time;
    const hours = req.body.hours;
    const handicapped = req.body.handicapped;
    const status = req.body.status;
    const last_space_description = req.body.last_space_description;

    if( name === undefined || description === undefined || images === undefined || type === undefined || capacity === undefined || time === undefined || hours === undefined || handicapped === undefined || status === undefined  || last_space_description === undefined) {
        res.status(400).end();
        return;
    }
    const spaceController = await SpaceController.getInstance();
    const space = await spaceController.create({
        name,
        description,
        images,
        type,
        capacity,
        time,
        hours,
        handicapped,
        status,
        last_space_description
    });

    if(space !== null) {
        res.status(201);
        res.json(space);
    } else {
        res.status(409).end();
    }
});

/**
 * Find a space by his id
 */
spaceRouter.get("/:id", async function(req, res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }
    const spaceController = await SpaceController.getInstance();
    const space = await spaceController.findById({
        where: { id: requestedId }
    });
    if(space !== null) {
        res.status(200);
        res.json(space);
    } else {
        res.status(409).end();
    }
});

/**
 * Modify a space created
 */
spaceRouter.put("/update/:id", async function(req, res) {
    const spaceController = await SpaceController.getInstance();
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }

    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const type = req.body.type;
    const capacity = req.body.capacity;
    const time = req.body.time;
    const hours = req.body.hours;
    const handicapped = req.body.handicapped;
    const status = req.body.status;
    const last_space_description = req.body.last_space_description;

    const space = await spaceController.findById({
        where: { id: requestedId }
    });

    if(space !== null){
        space.name = req.body.name;
        space.description = req.body.description;
        space.images = req.body.images;
        space.type = req.body.type;
        space.capacity = req.body.capacity;
        space.time = req.body.time;
        space.hours = req.body.hours;
        space.handicapped = req.body.handicapped;
        space.status = req.body.status;
        space.last_space_description = req.body.last_space_description;

        const spaceSaved = await space.save();
        if(spaceSaved !== null){
            res.status(200);
            res.json(space);
        }
    } else {
        res.status(409).end();
    }
});

/**
 * Delete space from specify id
 */
spaceRouter.delete("/delete/:id", async function(req, res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }
    const spaceController = await SpaceController.getInstance();
    const space = await spaceController.deleteById({
        where: { id: requestedId },
        force : true
    });
    if(space !== null) {
        res.status(200);
        res.json(space);
    } else {
        res.status(409).end();
    }
});

export {
    spaceRouter
};