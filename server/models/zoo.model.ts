export interface IZooProps {
    name?: string;
    description: string;
    images: string;
    capacity: string;
    hours: string;
}

// SQL Table Zoo
export class Zoo implements IZooProps {
    name?: string;
    description: string;
    images: string;
    capacity: string;
    hours: string;

    constructor(props: IZooProps) {
        this.name = props.name;
        this.description = props.description;
        this.images = props.images;
        this.capacity = props.capacity;
        this.hours = props.hours;
    }
}