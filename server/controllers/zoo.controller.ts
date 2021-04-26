import { IZooCreationProps, SequelizeManager, SessionInstance, ZooInstance } from "../models";
import { Connection, escape } from "mysql2/promise";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { ModelCtor } from "sequelize";
import { hash } from "bcrypt";
import { addSyntheticLeadingComment } from "typescript";

const chalk = require('chalk');

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export class ZooController {

    Session: ModelCtor<SessionInstance>;
    Zoo: ModelCtor<ZooInstance>;

    private static instance: ZooController;

    public static async getInstance(): Promise<ZooController> {
        if (ZooController.instance === undefined) {
            const { Session, Zoo } = await SequelizeManager.getInstance();
            ZooController.instance = new ZooController(Session, Zoo);
        }
        return ZooController.instance;
    }

    private constructor(Session: ModelCtor<SessionInstance>, Zoo: ModelCtor<ZooInstance>) {
        this.Session = Session;
        this.Zoo = Zoo;
    }

    /**
     *
     * create
     *
     * Create a new zoo
     *
     * @param zoo
     */
    public async create(zoo: IZooCreationProps): Promise<ZooInstance | null> {
        return this.Zoo.create({
            ...zoo,
        });
    }

    /**
     * Get all sessions created
     */
    public async findAllSession(options: GetAllOptions): Promise<Array<SessionInstance>> {
        return this.Session.findAll({
            ...options
        });
    }

    /**
     *
     * Find a zoo by id
     *
     * @param id
     */
    public async findById(id: string): Promise<ZooInstance | null> {
        return this.Zoo.findOne({ where: { id: id } })
    }

    /**
     *
     * open
     *
     * Open a zoo if we respect the currents conditions
     *
     * @param sessions
     * @param id_zoo
     */
    public async open(sessions: SessionInstance[], id_zoo: string): Promise<string | null> {
        let user, receptionist, caretaker, maintenance, seller;
        const jobs: Array<string> = [];

        const zoo = await this.Zoo.findOne({
            where: {
                id: id_zoo
            }
        });
        if (zoo === null) {
            return null;
        }
        let maDate = new Date();
        maDate.setHours(14);
        maDate.setDate(1);

        for (const property in sessions) {
            user = sessions[property].getUser();
            await user.then((value) => {
                jobs.push(value.getDataValue("role"));

            });
        }

        for (let i = 0; i < jobs.length; i++) {
            switch (jobs[i]) {
                case "receptionist":
                    receptionist = 1;
                    break;
                case "caretaker":
                    caretaker = 1;
                    break;
                case "maintenance":
                    maintenance = 1;
                    break;
                case "seller":
                    seller = 1;
                    break;
            }

        }

        if (receptionist == 1 && caretaker == 1 && maintenance == 1 && seller == 1) {

            const token = await hash(Date.now() + zoo.name, 5);
            const session = await this.Session.create({
                token
            });

            zoo.open = true;
            await session.setZoo(zoo);
            await zoo.save();

            return "ZOO OPEN";
        }
        console.log(chalk.red("ZOO CAN'T OPEN"))

        return "ZOO CAN'T OPEN";
    }

    /**
     * Delete zoo from specify id
     */
    public async deleteById(options: object): Promise<number> {
        return this.Zoo.destroy({
            ...options
        })
    }

    public async isOpen(): Promise<boolean> {


        return false;
    }
}