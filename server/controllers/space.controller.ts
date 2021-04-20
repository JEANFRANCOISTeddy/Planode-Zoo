import {ModelCtor} from "sequelize";
import {ISpaceCreationProps, ISpaceProps, SpaceInstance} from "../models";
import {IUserCreationProps, SequelizeManager, UserInstance} from "../models";
import {compare, hash} from "bcrypt";
import {ModelStatic, UpdateOptions} from "sequelize/types/lib/model";
import {readFile, appendFile} from "fs";
import {UserController} from "./user.controller";

const chalk = require('chalk');

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export class SpaceController {
    Space: ModelCtor<SpaceInstance>;

    private static instance: SpaceController;

    public static async getInstance(): Promise<SpaceController> {
        if(SpaceController.instance === undefined) {
            const {Space} = await SequelizeManager.getInstance();
            SpaceController.instance = new SpaceController(Space);
        }
        return SpaceController.instance;
    }

    private constructor(Space: ModelCtor<SpaceInstance>) {
        this.Space = Space;
    }

    /**
     * Get all spaces created
     */
    public async findAll(options: GetAllOptions): Promise<Array<SpaceInstance>> {
        return this.Space.findAll({
            ...options
        });
    }

    /**
     * Creation of new space
     */
    public async create(space: ISpaceCreationProps): Promise<SpaceInstance | null> {
        return this.Space.create({
            ...space
        });
    }

    /**
     * Find a space by his id
     */
    public async findById(id: string): Promise<SpaceInstance | null> {
        return this.Space.findOne({
            where: { id: id }
        })
    }

    /**
     * Find a space by his name
     */
    public async findByName(name: string): Promise<SpaceInstance | null> {
        return this.Space.findOne({
            where: { name: name }
        })
    }

    /**
     * Delete space from specify id
     */
    public async deleteById(options: object): Promise<number> {
        return this.Space.destroy({
            ...options
        })
    }

    /**
     *
     * spaceMaintenance
     *
     * Put a space in maintenance
     *
     * @param id_user
     * @param name
     * @param description
     * @param timeStart
     * @param timeEnd
     * @param hoursStart
     * @param hoursEnd
     */
    public async spaceMaintenance(id_user: string, name :string, description :string, timeStart :string, timeEnd: string, hoursStart: string, hoursEnd: string): Promise<number> {
        const userController = await UserController.getInstance();
        const user = await userController.findById(id_user);

        if(user === null)
            return 400;

        if(name === undefined || description === undefined || timeStart === undefined || timeEnd === undefined || hoursStart === undefined || hoursEnd === undefined)
            return 404;

        if(!user.admin)
            return 401;

        const space = await this.findByName(name);
        if(space === null)
            return 404;


        let dateTime = new Date();
        let today_month = dateTime.getMonth() + 1;

        const allAnimals = await space.getAnimals();
        const bestMonthAnimals: Array<string> = [];

        for(let i=0; i<allAnimals.length; i++) {
            bestMonthAnimals.push(allAnimals[i].getDataValue("bestMonth"));
        }

        let i = 0;
        bestMonthAnimals.forEach(function(element, index) {
            if(element == today_month.toString()) {
                i++;
            }
        });

        if(i != 0)
            console.log(chalk.green("It's the best month to maintain your space because no animals are present."));
        else
            console.log(chalk.red("It's not the best month to maintain your space because one or many of your animals are there."));

        if(space.status)
            return 409;
        else
            space.status = true; //maintenance == true, !maintenance == false

        await saveNewMaintenanceInFile(name, description, timeStart, timeEnd, hoursStart, hoursEnd);
        return 201;
    }

    /**
     * Read all content in maintenance book
     */
    public async readMaintenanceFile(): Promise<void> {
        readFile('./books/maintenance.book.txt', function (err,data) { // Pas mettre le nom du fichier en dur
            if (err) {
                console.error(err);
            }
            const txt = data.toString('utf-8');
            console.error(txt);
        });
    }
}

/**
 *
 * saveNewMaintenanceInFile
 *
 * Save a new maintenance in maintenance file
 *
 * @param name
 * @param description
 * @param timeStart
 * @param timeEnd
 * @param hoursStart
 * @param hoursEnd
 */
async function saveNewMaintenanceInFile(name :string, description :string, timeStart :string, timeEnd: string, hoursStart: string, hoursEnd: string): Promise<string> {
    return new Promise<string>(function(resolve, reject) {
        readFile('./books/maintenance.book.txt', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            writeNewMaintenanceInFile(name, description, timeStart, timeEnd, hoursStart, hoursEnd).then(function () {
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
 * Write a new maintenance in maintenance file
 *
 * @param name
 * @param description
 * @param timeStart
 * @param timeEnd
 * @param hoursStart
 * @param hoursEnd
 */
function writeNewMaintenanceInFile(name :string, description :string, timeStart :string, timeEnd: string, hoursStart: string, hoursEnd: string): Promise<void> {
    return new Promise<void>(function(resolve, reject) {
        appendFile('./books/maintenance.book.txt',  maintenanceToString(name, description, timeStart, timeEnd, hoursStart, hoursEnd), function (err) {
            if(err) {
                reject(err);
                return
            }
            resolve();
        });
    });
}

function maintenanceToString(name :string, description :string, timeStart :string, timeEnd: string, hoursStart: string, hoursEnd: string): string {
    let dateTime = new Date();
    let dd = dateTime.getDate();
    let mm = dateTime.getMonth() + 1;
    let yyyy = dateTime.getFullYear();
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    let today = dd + "/" + mm + "/" + yyyy + " " + hours + ":" + minutes + ":" + seconds;

    return  '' + today + ' -> { ' + description + ' in the space "' + name + '" will be carried out on ' + timeStart + ' at ' + hoursStart + ' until ' + timeEnd + ' at ' + hoursEnd + ' }\n';
}