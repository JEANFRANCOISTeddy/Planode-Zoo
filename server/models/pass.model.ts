export interface IPassProps {
      id?:string;
      name:string;
      price:number;
      route?:Array<object>;
      day_start_validation : string;
      day_end_validation : string
}

// SQL Table Pass
export class Pass implements IPassProps {
    id?:string;
    name:string;
    price:number;
    route?:Array<object>;
    day_start_validation : string;
    day_end_validation : string

    constructor(props: IPassProps) {
        this.id = props.id;
        this.name = props.name;
        this.price = props.price;
        this.route = props.route;
        this.day_start_validation = props.day_start_validation;
        this.day_end_validation = props.day_end_validation;

    }
}