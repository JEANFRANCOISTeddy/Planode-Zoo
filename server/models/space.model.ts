import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin
} from "sequelize";
import {AnimalInstance} from "./animal.model";

export interface ISpaceProps {
    id?: string;
    name: string;
    description: string;
    images: string;
    type: string;
    capacity: string;
    time: string; // opening duracy
    hours: string; // opening hours
    handicapped: boolean; // true --> space has handicapped access
    status: boolean; // true --> maintenance | false --> operational
    last_space_description:string; 
}

export interface ISpaceCreationProps extends Optional<ISpaceProps, "id"> {}

export interface SpaceInstance extends Model<ISpaceProps, ISpaceCreationProps>, ISpaceProps {
    getAnimals: HasManyGetAssociationsMixin<AnimalInstance>;
    setAnimal: HasManyAddAssociationMixin<AnimalInstance, "id">;
}

export default function(sequelize: Sequelize): ModelCtor<SpaceInstance> {
    return sequelize.define<SpaceInstance>("Space", {
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
        type: {
            type: DataTypes.STRING
        },
        capacity: {
            type: DataTypes.STRING
        },
        time: {
            type: DataTypes.STRING
        },
        hours: {
            type: DataTypes.STRING
        },
        handicapped: {
            type: DataTypes.BOOLEAN
        },
        status: {
            type: DataTypes.BOOLEAN
        },
        last_space_description: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}
