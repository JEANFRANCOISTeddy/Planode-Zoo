import {ModelCtor} from "sequelize";
import {ISpaceCreationProps, ISpaceProps, SpaceInstance} from "../models/space.model";
import {IUserCreationProps, SequelizeManager, UserInstance} from "../models";
import {compare, hash} from "bcrypt";
import {ModelStatic, UpdateOptions} from "sequelize/types/lib/model";
import {readFile, appendFile} from "fs";
import {UserController} from "./user.controller";

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
     * Find a space by his id
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
     * @param id
     * @param name
     * @param description
     * @param timeStart
     * @param timeEnd
     * @param hoursStart
     * @param hoursEnd
     */
    public async spaceMaintenance(id: string, name :string, description :string, timeStart :string, timeEnd: string, hoursStart: string, hoursEnd: string): Promise<number> {
        const userController = await UserController.getInstance();
        const user = await userController.findById(id);

        if(user === null)
            return 400;

        if(name === undefined || description === undefined || timeStart === undefined || timeEnd === undefined || hoursStart === undefined || hoursEnd === undefined)
            return 404;

        if(!user.admin)
            return 401;

        const space = await this.findByName(name);
        if(space === null)
            return 404;

        if(space.status == true)
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