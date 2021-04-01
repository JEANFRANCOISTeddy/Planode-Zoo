import express from 'express';
import {SpaceController} from '../controllers/space.controller';
import {DatabaseUtils} from "../config/db.config";

const router = express.Router();

router.get("/", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const spaceController = new SpaceController(connection);
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const spaceList = await spaceController.getAll({
        limit,
        offset
    });
    res.json(spaceList);
});
router.get("/:id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const spaceController = new SpaceController(connection);
    const space = await spaceController.getById(req.params.id);
    if(space === null) {
        res.status(404).end();
    } else {
        res.json(space);
    }
});

router.post("/", async function(req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const type = req.body.type;
    const capacity = req.body.capacity;
    const time = req.body.time;
    const hours = req.body.hours;
    const handicapped = req.body.handicapped;
    const statut = req.body.statut;
    const last_space_description = req.body.last_space_description;
    if(name === undefined || description === undefined || images === undefined || type === undefined || capacity === undefined || time === undefined || hours === undefined || handicapped === undefined || statut === undefined || last_space_description === undefined) {
        res.status(400).end();
        return;
    }
    const connection = await DatabaseUtils.getConnection();
    const spaceController = new SpaceController(connection);
    const space = await spaceController.create({
        name,
        description,
        images,
        type,
        capacity,
        time,
        hours,
        handicapped,
        statut,
        last_space_description
    });

    if(space === null) {
        res.status(500).end();
    } else {
        res.status(201);
        res.json(space);
    }

});

router.put("/:id", async function(req, res) {
    const id = req.body.id
    const name = req.body.name;
    const description = req.body.description;
    const images = req.body.images;
    const type = req.body.type;
    const capacity = req.body.capacity;
    const time = req.body.time;
    const hours = req.body.hours;
    const handicapped = req.body.handicapped;
    const statut = req.body.statut;
    const last_space_description = req.body.last_space_description;

    const connection = await DatabaseUtils.getConnection();
    const spaceController = new SpaceController(connection);
    const space = await spaceController.update({
        id,
        name,
        description,
        images,
        type,
        capacity,
        time,
        hours,
        handicapped,
        statut,
        last_space_description
    });
    if(space === null){
        res.status(404);
    }else{
        res.json(space);
    }
});

router.delete("/id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const spaceController = new SpaceController(connection);
    const success = await spaceController.removeById(req.params.id);
    if(success) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

export default router;