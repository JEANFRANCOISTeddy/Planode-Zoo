export interface IUserProps {
    id?: string;
    name: string;
    firstname: string;
    mail: string;
    phone: string;
    admin: boolean;
}

// SQL Table User
export class User implements IUserProps {
    id?: string;
    name: string;
    firstname: string;
    mail: string;
    phone: string;
    admin: boolean;

    constructor(props: IUserProps) {


        this.id = props.id;
        this.name = props.name;
        this.firstname = props.firstname;
        this.mail = props.mail;
        this.phone = props.phone;
        this.admin = props.admin;
    }
}