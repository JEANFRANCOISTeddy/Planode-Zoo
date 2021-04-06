import {ModelCtor} from "sequelize";
import {ISpaceCreationProps, ISpaceProps, SpaceInstance} from "../models/space.model";
import {SequelizeManager} from "../models";
import {compare, hash} from "bcrypt";
import {ModelStatic, UpdateOptions} from "sequelize/types/lib/model";

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
    public async findById(options: object): Promise<SpaceInstance | null> {
        return this.Space.findOne({
            ...options
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
}