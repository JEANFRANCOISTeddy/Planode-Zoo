import express from 'express';
import {ZooController} from '../controllers/zoo.controller';

const zooRouter = express.Router();

zooRouter.get("/open", async function(req, res) {
    const zooController = await ZooController.getInstance();
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;

    const session = await zooController.findAllSession({
        limit,
        offset
    });
    await zooController.open(session);

    if(session != null) {
        res.status(200).end();
    } else {
        res.status(409).end();
    }
});

export {
    zooRouter
};