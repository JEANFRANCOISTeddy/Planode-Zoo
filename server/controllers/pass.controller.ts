import {ModelCtor} from "sequelize";
import {IPassCreationProps, IPassProps, PassInstance} from "../models/pass.model";
import {SequelizeManager} from "../models";


export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export class PassController {
    Pass: ModelCtor<PassInstance>; 

    private static instance: PassController;

    public static async getInstance(): Promise<PassController> {
        if(PassController.instance === undefined) {
            const {Pass} = await SequelizeManager.getInstance();
            PassController.instance = new PassController(Pass);
        }
        return PassController.instance;
    }

    private constructor(Pass: ModelCtor<PassInstance>) {
        this.Pass = Pass;
    }

    /**
     * Get all Passs created
     */
    public async findAll(options: GetAllOptions): Promise<Array<PassInstance>> {
        return this.Pass.findAll({
            ...options
        });
    }

    /**
     * Creation of new Pass
     */
    public async create(pass: IPassCreationProps): Promise<PassInstance | null> {
        return this.Pass.create({
            ...pass
        });
    }

    /**
     * Find a Pass by his id
     */
    public async findById(options: object): Promise<PassInstance | null> {
        return this.Pass.findOne({
            ...options
        })
    }

    /**
     * Delete Pass from specify id
     */
    public async deleteById(options: object): Promise<number> {
        return this.Pass.destroy({
            ...options
        })
    }
}