import {ModelCtor, Sequelize} from "sequelize";
import userCreator, {UserInstance} from "./user.model";
import spaceCreator, {SpaceInstance} from "./space.model";
import sessionCreator, {SessionInstance} from "./session.model";
import passCreator, {PassInstance} from "./pass.model";
import animalCreator, {AnimalInstance} from "./animal.model";
import zooCreator, {ZooInstance} from "./zoo.model";
import {Dialect} from "sequelize/types/lib/sequelize";
export interface SequelizeManagerProps {
    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Space: ModelCtor<SpaceInstance>;
    Pass: ModelCtor<PassInstance>;
    Session: ModelCtor<SessionInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Zoo: ModelCtor<ZooInstance>;
}
export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    User: ModelCtor<UserInstance>;
    Space: ModelCtor<SpaceInstance>;
    Pass: ModelCtor<PassInstance>;
    Session: ModelCtor<SessionInstance>;
    Animal: ModelCtor<AnimalInstance>;
    Zoo: ModelCtor<ZooInstance>;

    public static async getInstance(): Promise<SequelizeManager> {
        if (SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            logging: false,
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string)
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            User: userCreator(sequelize),
            Space: spaceCreator(sequelize),
            Session: sessionCreator(sequelize),
            Pass: passCreator(sequelize),
            Animal: animalCreator(sequelize),
            Zoo: zooCreator(sequelize)
        }
        SequelizeManager.associate(managerProps);
        await sequelize.sync();
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {
        props.User.hasMany(props.Session); // User N Session
        props.Session.belongsTo(props.User); // Session 1 User

        props.Space.hasMany(props.Animal);
        props.Animal.belongsTo(props.Space);

        props.Zoo.hasMany(props.Session);
        props.Session.belongsTo(props.Zoo);
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.User = props.User;
        this.Space = props.Space;
        this.Pass = props.Pass;
        this.Session = props.Session;
        this.Pass = props.Pass;
        this.Animal = props.Animal;
        this.Zoo = props.Zoo;
    }
}

