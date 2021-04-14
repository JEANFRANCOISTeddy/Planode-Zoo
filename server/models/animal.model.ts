import {
    Sequelize,
    Optional,
    Model,
    DataTypes,
    ModelCtor,
    BelongsToSetAssociationMixin,
    HasManyGetAssociationsMixin, HasManyAddAssociationMixin
} from "sequelize";

export interface IAnimalProps {
    id?: string;
    name:string;
    species:string;
    weight:number;
    height:number;
    last_medical_description?:string;
    bestMonth?:string;
}

export interface IAnimalCreationProps extends Optional<IAnimalProps, "id"> {}

export interface AnimalInstance extends Model<IAnimalProps, IAnimalCreationProps>, IAnimalProps {}

export default function(sequelize: Sequelize): ModelCtor<AnimalInstance> {
    return sequelize.define<AnimalInstance>("Animal", {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING
        },
        species: {
            type: DataTypes.STRING
        },
        weight: {
            type: DataTypes.DOUBLE
        },
        height: {
            type: DataTypes.DOUBLE
        },
        last_medical_description: {
            type: DataTypes.STRING
        },
        bestMonth: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        underscored: true,
        paranoid: true,
        timestamps: true
    });
}