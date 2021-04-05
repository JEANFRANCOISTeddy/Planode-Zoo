export interface ISpaceProps {
    id?: string;
    name: string;
    description: string;
    images: string;
    type: string;
    capacity: string;
    time: string;
    hours: string;
    handicapped: boolean;
    statut: boolean;
    last_space_description:string;
}

// SQL Table Space
export class Space implements ISpaceProps {
    id?: string;
    name: string;
    description: string;
    images: string;
    type: string;
    capacity: string;
    time: string;
    hours: string;
    handicapped: boolean;
    statut: boolean;
    last_space_description:string;

    constructor(props: ISpaceProps) {
        this.id = props.id;
        this.name = props.name;
        this.description = props.description;
        this.images = props.images;
        this.type = props.type;
        this.capacity = props.capacity;
        this.time = props.time;
        this.hours = props.hours;
        this.handicapped = props.handicapped;
        this.statut = props.statut;
        this.last_space_description = props.last_space_description;
    }
}