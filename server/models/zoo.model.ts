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

export interface IZooProps {
    id?: string;
    name: string;
    description: string;
    images: string;
    capacity: number;
    open: boolean;
}

export interface IZooCreationProps extends Optional<IZooProps, "id"> {}

export interface ZooInstance extends Model<IZooProps, IZooCreationProps>, IZooProps {
    getSessions: HasManyGetAssociationsMixin<SessionInstance>;
    addSession: HasManyAddAssociationMixin<SessionInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<ZooInstance> {
    return sequelize.define<ZooInstance>("Zoo", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        images: {
            type: DataTypes.STRING
        },
        capacity: {
            type: DataTypes.INTEGER
        },
        open: {
            type: DataTypes.BOOLEAN
        },
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}