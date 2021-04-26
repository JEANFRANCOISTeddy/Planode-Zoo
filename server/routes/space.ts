import express from 'express';
import {SpaceController} from '../controllers/space.controller';
import {employeeMiddleware} from "../middlewares/employee.middleware";
import { SpaceInstance } from '../models';

const chalk = require('chalk');
const spaceRouter = express.Router();

/**
 * Get all spaces created
 */
spaceRouter.get("/", employeeMiddleware, async function(req, res) {
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
 * Read maintenance file
 */
spaceRouter.get("/readMaintenanceFile", employeeMiddleware, async function(req, res) {
    const spaceController = await SpaceController.getInstance();
    await spaceController.readMaintenanceFile();
    res.send("Look the terminal to see the file's content");
    res.status(200);
});

/**
 * Add new maintenance to maintenance file
 */
spaceRouter.post("/spaceMaintenanceFile", employeeMiddleware, async function(req, res) {
    const id_user = req.body.id_user;
    const name = req.body.name;
    const description = req.body.description;
    const timeStart = req.body.timeStart;
    const timeEnd = req.body.timeEnd;
    const hoursStart = req.body.hoursStart;
    const hoursEnd = req.body.hoursEnd;

    if(name === undefined || description === undefined || timeStart === undefined || timeEnd === undefined || hoursStart === undefined || hoursEnd === undefined)
        res.status(403).end();

    const spaceController = await SpaceController.getInstance();
    const space = await spaceController.spaceMaintenance(
        id_user,
        name,
        description,
        timeStart,
        timeEnd,
        hoursStart,
        hoursEnd
    );

    switch (space) {
        case 400:
            res.status(400).end();
            break;
        case 401:
            res.status(401).end();
            break;
        case 404:
            res.status(404).end();
            break;
        case 409:
            res.status(409).end();
            break;
        case 201:
            res.status(201).end();
            break;
    }

});

/**
 * Creation of new space
 */
spaceRouter.post("/create", employeeMiddleware, async function(req, res) {
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
    const infoHebdo = req.body.infoHebdo;
    const infoQuoti = req.body.infoQuoti;

    if( name === undefined || description === undefined || images === undefined || type === undefined || capacity === undefined || time === undefined || hours === undefined || handicapped === undefined || status === undefined  || last_space_description === undefined || infoHebdo === undefined || infoQuoti === undefined) {
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
        last_space_description,
        infoHebdo,
        infoQuoti
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
spaceRouter.get("/:id", employeeMiddleware, async function(req, res) {
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }
    const spaceController = await SpaceController.getInstance();
    const space = await spaceController.findById(requestedId);
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
spaceRouter.put("/update/:id", employeeMiddleware, async function(req, res) {
    const spaceController = await SpaceController.getInstance();
    const requestedId = req.params.id;
    if(requestedId === null) {
        res.status(400).end();
        return;
    }

    const space = await spaceController.findById(requestedId);

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
        space.infoHebdo = req.body.infoHebdo;
        space.infoQuoti = req.body.infoQuoti;

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
 * Delete space with a specify id
 */
spaceRouter.delete("/delete/:id", employeeMiddleware, async function(req, res) {
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