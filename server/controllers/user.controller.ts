import {ModelCtor} from "sequelize";
import {IUserCreationProps, IUserProps, UserInstance} from "../models";
import {SessionInstance} from "../models";
import {SequelizeManager, SpaceInstance} from "../models";
import {compare, hash} from "bcrypt";

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

    public async logout(options: object): Promise<number> {
        return this.Session.destroy({
            ...options
        });
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        return this.Session.findOne({
            where: {
                token
            }
        });
    }

    /**
     * Find a space by his id
     */
    public async findById(id: string): Promise<UserInstance | null> {
        return this.User.findOne({ where: { id: id } })
    }


}