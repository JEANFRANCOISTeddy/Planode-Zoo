import {ModelCtor} from "sequelize";
import {IUserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager, SpaceInstance} from "../models";
import {compare, hash} from "bcrypt";
import {SpaceController} from "./space.controller";
import {spaceRouter} from "../routes/space";

export class UserController {
    User: ModelCtor<UserInstance>;

    private static instance: UserController;

    public static async getInstance(): Promise<UserController> {
        if(UserController.instance === undefined) {
            const {User} = await SequelizeManager.getInstance();
            UserController.instance = new UserController(User);
        }
        return UserController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>) {
        this.User = User;
    }

    public async create(user: IUserCreationProps): Promise<UserInstance | null> {
        const passwordHashed = await hash(user.password, 5);
        return this.User.create({
            ...user,
            password: passwordHashed
        });
    }

    /**
     * Find a space by his id
     */
    public async findById(id: string): Promise<UserInstance | null> {
        return this.User.findOne({ where: { id: id } })
    }


}