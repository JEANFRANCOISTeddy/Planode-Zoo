import {ModelCtor} from "sequelize";
import {IUserCreationProps, UserInstance} from "../models";
import {SessionInstance} from "../models";
import {SequelizeManager, SpaceInstance} from "../models";
import {compare, hash} from "bcrypt";
import {GetAllOptions} from "./animal.controller";

export class UserController {

    User: ModelCtor<UserInstance>;
    Session: ModelCtor<SessionInstance>;

    private static instance: UserController;

    public static async getInstance(): Promise<UserController> {
        if(UserController.instance === undefined) {
            const {User, Session} = await SequelizeManager.getInstance();
            UserController.instance = new UserController(User, Session);
        }
        return UserController.instance;
    }

    private constructor(User: ModelCtor<UserInstance>, Session: ModelCtor<SessionInstance>) {
        this.User = User;
        this.Session = Session;
    }

    /**
     * Get all users created
     */
    public async findAll(options: GetAllOptions): Promise<Array<UserInstance>> {
        return this.User.findAll({
            ...options
        });
    }


    /**
     *
     * create
     *
     * Create a new user
     *
     * @param user
     */
    public async create(user: IUserCreationProps): Promise<UserInstance | null> {
        const passwordHashed = await hash(user.password, 5);
        return this.User.create({
            ...user,
            password: passwordHashed
        });
    }

    /**
     * Connexion of user
     *
     * @param mail
     * @param password
     */
    public async login(mail: string, password: string): Promise<SessionInstance | null> {
        const user = await this.User.findOne({
            where: {
                mail
            }
        });
        if(user === null) {
            return null;
        }
        const isSamePassword = await compare(password, user.password);
        if(!isSamePassword) {
            return null;
        }
        const token = await hash( Date.now() + mail, 5);
        const session = await this.Session.create({
            token
        });
        await session.setUser(user);
        return session;
    }

    /**
     * Logout user
     *
     * @param options
     */
    public async logout(options: object): Promise<number> {
        return this.Session.destroy({
            ...options
        });
    }

    /**
     *
     * Get user Session with auth token
     *
     * @param token
     */
    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    /**
     * Find a user by his id
     *
     * @param id
     */
    public async findById(id: string): Promise<UserInstance | null> {
        return this.User.findOne({ where: { id: id } })
    }

    /**
     * Delete user from specify id
     */
    public async deleteById(options: object): Promise<number> {
        return this.User.destroy({
            ...options
        })
    }
}