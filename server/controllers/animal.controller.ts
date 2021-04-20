import {ModelCtor} from "sequelize";
import {
    IAnimalCreationProps,
    IAnimalProps,
    AnimalInstance,
    SequelizeManager, SpaceInstance
} from "../models";
import {compare, hash} from "bcrypt";
import {ModelStatic, UpdateOptions} from "sequelize/types/lib/model";
import {readFile, appendFile} from "fs";
import {UserController} from "./user.controller";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export class AnimalController {
    Animal: ModelCtor<AnimalInstance>;
    Space: ModelCtor<SpaceInstance>;

    private static instance: AnimalController;

    public static async getInstance(): Promise<AnimalController> {
        if(AnimalController.instance === undefined) {
            const {Animal, Space} = await SequelizeManager.getInstance();
            AnimalController.instance = new AnimalController(Animal, Space);
        }
        return AnimalController.instance;
    }

    private constructor(Animal: ModelCtor<AnimalInstance>, Space: ModelCtor<SpaceInstance>) {
        this.Animal = Animal;
        this.Space = Space;
    }

    /**
     * Get all animals created
     */
    public async findAll(options: GetAllOptions): Promise<Array<AnimalInstance>> {
        return this.Animal.findAll({
            ...options
        });
    }

    /**
     * Creation of new animal
     */
    public async create(animal: IAnimalCreationProps): Promise<AnimalInstance | null> {
        return this.Animal.create({
            ...animal
        });
    }

    /**
     * Find an animal by his id
     */
    public async findById(id: string): Promise<AnimalInstance | null> {
        return this.Animal.findOne({
            where: { id: id }
        })
    }

    /**
     * Find an animal by his name
     */
    public async findByName(id: string): Promise<AnimalInstance | null> {
        return this.Animal.findOne({
            where: { id: id }
        })
    }

    /**
     * Delete animal from specify id
     */
    public async deleteById(options: object): Promise<number> {
        return this.Animal.destroy({
            ...options
        })
    }

    /**
     *
     * animalTreatment
     *
     * Put an animal in treatment
     *
     * @param id_user
     * @param id_animal
     * @param medical_description
     */
    public async animalTreatment(id_user: string, id_animal: string, medical_description: string): Promise<number> {
        const userController = await UserController.getInstance();
        const user = await userController.findById(id_user);

        if(user === null)
            return 400;

        if(user.role !== 'caretaker')
            return 401;

        if(id_user === undefined || id_animal === undefined || medical_description === undefined)
            return 404;

        const animal = await this.findById(id_animal);
        if(animal === null)
            return 404;

        animal.last_medical_description = medical_description;
        const spaceSaved = await animal.save();
        if(spaceSaved === null)
            return 409;

        await saveNewMTreatmentInFile(user.lastname, user.firstname, animal.name, medical_description);

        return 201;
    }

    /**
     * Read all content in treatment book
     */
    public async readTreatmentFile(): Promise<void> {
        readFile('./books/treatment.book.txt', function (err,data) {
            if (err) {
                console.error(err);
            }
            const txt = data.toString('utf-8');
            console.error(txt);
        });
    }

    /**
     *
     * assignAnimalToSpace
     *
     *
     *
     * @param id_space
     * @param id_animal
     */
    public async assignAnimalToSpace(id_space: string, id_animal: string): Promise<AnimalInstance | null> {
        const space = await this.Space.findOne({
            where: {
                id: id_space
            }
        });

        const animal = await this.Animal.findOne({
            where: {
                id: id_animal
            }
        });

        if(space === null || animal === null) {
            return null;
        }

        await animal.setSpace(space);
        return animal;
    }
}

/**
 *
 * saveNewMTreatmentInFile
 *
 * Save a new treatment in treatment file
 *
 * @param lastname_user
 * @param firstname_user
 * @param name_animal
 * @param medical_description
 */
async function saveNewMTreatmentInFile(lastname_user: string, firstname_user: string, name_animal: string, medical_description:string): Promise<string> {
    return new Promise<string>(function(resolve, reject) {
        readFile('./books/treatment.book.txt', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            writeNewMaintenanceInFile(lastname_user, firstname_user, name_animal, medical_description).then(function () {
                resolve("Success");
            }).catch(reject);
            return;
        })
    })
}

/**
 *
 * writeMaintenanceInFile
 *
 * Write a new treatment in treatment file
 *
 * @param lastname_user
 * @param firstname_user
 * @param name_animal
 * @param medical_description
 */
function writeNewMaintenanceInFile(lastname_user: string, firstname_user: string, name_animal: string, medical_description:string): Promise<void> {
    return new Promise<void>(function(resolve, reject) {
        appendFile('./books/treatment.book.txt',  treatmentToString(lastname_user, firstname_user, name_animal, medical_description), function (err) {
            if(err) {
                reject(err);
                return
            }
            resolve();
        });
    });
}

function treatmentToString(lastname_user: string, firstname_user: string, name_animal: string, medical_description:string): string {
    let dateTime = new Date();
    let dd = dateTime.getDate();
    let mm = dateTime.getMonth() + 1;
    let yyyy = dateTime.getFullYear();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    let today = dd + "/" + mm + "/" + yyyy + " " + hours + ":" + minutes + ":" + seconds;

    return '' + today + ' -> { The caretaker ' + lastname_user + ' ' + firstname_user + ' to perform a treatment on ' + name_animal + ' in order to ' + medical_description + ' }\n';
}