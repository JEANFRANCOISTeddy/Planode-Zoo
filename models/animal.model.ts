export interface IAnimalProps {
    id?: string;
    name:string;
    species:string;
    weight:number;
    height:number;
    last_medical_description:string;
    id_space:string;
}

// SQL Table Animal
export class Animal implements IAnimalProps {
    id?: string;
    name:string;
    species:string;
    weight:number;
    height:number;
    last_medical_description:string;
    id_space:string;

    constructor(props: IAnimalProps) {
        this.id = props.id;
        this.name = props.name;
        this.species = props.species;
        this.weight = props.weight;
        this.height = props.height;
        this.last_medical_description = props.last_medical_description;
        this.id_space = props.id_space;
    }
}