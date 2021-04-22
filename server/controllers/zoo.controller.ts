import {SequelizeManager, SessionInstance, UserInstance} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {ModelCtor} from "sequelize";

const chalk = require('chalk');

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export class ZooController {

    Session: ModelCtor<SessionInstance>;

    private static instance: ZooController;

    public static async getInstance(): Promise<ZooController> {
        if(ZooController.instance === undefined) {
            const {Session} = await SequelizeManager.getInstance();
            ZooController.instance = new ZooController(Session);
        }
        return ZooController.instance;
    }

    private constructor(Session: ModelCtor<SessionInstance>) {
        this.Session = Session;
    }

    /**
     * Get all sessions created
     */
public async findAllSession(options: GetAllOptions): Promise<Array<SessionInstance>> {
        return this.Session.findAll({
            ...options
        });
    }

    public async open(sessions: SessionInstance[]): Promise<boolean> {
        let receptionist,
            caretaker,
            maintenance,
            seller;
        const jobs: Array<string> = [];
        let i = 0;
        let user;

        for (const property in sessions) {
            user = sessions[property].getUser();
            await user.then((value) => {
                jobs.push(value.getDataValue("role"));
            });

        }

        for (let i = 0; i < jobs.length; i++) {
            switch (jobs[i]){
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

        if(receptionist == 1 && caretaker == 1 && maintenance == 1 && seller == 1) {
            console.log(chalk.green("ZOO OPEN"))
            return true;
        }
        console.log(chalk.red("ZOO CAN'T OPEN"))

        return false;
    }

}