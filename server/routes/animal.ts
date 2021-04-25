/*import express from 'express';
import {AnimalController} from '../controllers/animal.controller';
import {DatabaseUtils} from "../config/db.config";

const router = express.Router();

router.get("/", async function(req, res) { 
    const connection = await DatabaseUtils.getConnection();
    const animalController = new AnimalController(connection);
    const limit = req.query.limit ? Number.parseInt(req.query.limit as string) : undefined;
    const offset = req.query.offset ? Number.parseInt(req.query.offset as string) : undefined;
    const animalList = await animalController.getAll({
        limit,
        offset
    });
    res.json(animalList);
});
router.get("/:id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const animalController = new AnimalController(connection);
    const animal = await animalController.getById(req.params.id);
    if(animal === null) {
        res.status(404).end();
    } else {
        res.json(animal);
    }
});

router.post("/", async function(req, res) {
    const name = req.body.name;
    const species = req.body.species;
    const weight = req.body.weight;
    const height = req.body.height;
    const last_medical_description = req.body.price;
    const id_space = req.body.price;
    if(name === undefined || species === undefined || weight === undefined || height === undefined || last_medical_description === undefined || id_space === undefined) {
        res.status(400).end();
        return;
    }
    const connection = await DatabaseUtils.getConnection();
    const animalController = new AnimalController(connection);
    const animal = await animalController.create({
        name,
        species,
        weight: Number.parseInt(weight),
        height: Number.parseFloat(height),
        last_medical_description,
        id_space
    });

    if(animal === null) {
        res.status(500).end();
    } else {
        res.status(201);
        res.json(animal);
    }

});

router.put("/:id", async function(req, res) {
    const id = req.params.id;
    const name = req.body.name;
    const weight = req.body.weight;
    const height = req.body.height;
    const last_medical_description = req.body.last_medical_description;
    const id_space = req.body.id_space;
    if(id === null) {
        res.status(400).end();
        return;
    }
    const connection = await DatabaseUtils.getConnection();
    const animalController = new AnimalController(connection);
    const animal = await animalController.update({
        id,
        name,
        weight: weight !== undefined ? Number.parseInt(weight) : weight,
        height: height !== undefined ? Number.parseInt(height) : height,
        last_medical_description,
        id_space
    });
    if(animal === null){
        res.status(404);
    }else{
        res.json(animal);
    }
});

router.delete("/id", async function(req, res) {
    const connection = await DatabaseUtils.getConnection();
    const animalController = new AnimalController(connection);
    const success = await animalController.removeById(req.params.id);
    if(success) {
        res.status(204).end();
    } else {
        res.status(404).end();
    }
});

export default router;*/