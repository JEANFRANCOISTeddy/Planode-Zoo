import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin
} from "sequelize";
import {SessionInstance} from "./session.model";

export interface IUserProps {
    id?: string;
    lastname: string;
    firstname: string;
    mail: string;
    phone: string;
    password: string;
    admin: boolean;
    role: string; // receptionist || caretaker || maintenance || seller
}

export interface IUserCreationProps extends Optional<IUserProps, "id"> {}

export interface UserInstance extends Model<IUserProps, IUserCreationProps>, IUserProps {
    getSessions: HasManyGetAssociationsMixin<SessionInstance>;
    addSession: HasManyAddAssociationMixin<SessionInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<UserInstance> {
    return sequelize.define<UserInstance>("User", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        lastname: {
            type: DataTypes.STRING
        },
        firstname: {
            type: DataTypes.STRING
        },
        mail: {
            type: DataTypes.STRING
        },
        phone: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        admin: {
            type: DataTypes.BOOLEAN
        },
        role: {
            type: DataTypes.STRING
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
