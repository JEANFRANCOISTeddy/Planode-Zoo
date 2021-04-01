import {User, IUserProps} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export class UserController {
    private connection: Connection;

    constructor(connection: Connection){
        this.connection = connection;

    }


    
    async getAll(options ?: GetAllOptions): Promise<User[]> {
        options = options || {};
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;
        const res = await this.connection.query(`SELECT id,name,firstname,mail,phone,admin FROM User LIMIT ${offset}, ${limit} `);
        const data = res[0];
        if(Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function(row: RowDataPacket) {
                return new User ({
                    id: "" + row["id"],
                    name: row["name"],
                    firstname: row["firstname"],
                    mail: row["mail"],
                    phone: row["phone"],
                    admin: row["admin"]
                  

                }) 

            });
        }
    
        return [];
    }

    async getById(id: string): Promise<User | null> {

        const res = await this.connection.query(`SELECT  id,name,firstname,mail,phone,admin FROM User WHERE id = ${id} `);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];   
                return new User ({
                    id: "" + row["id"],
                    name: row["name"],
                    firstname: row["firstname"],
                    mail: row["mail"],
                    phone: row["phone"],
                    admin: row["admin"]

                });

            }
        }
        return null;
    }
 



    async create(user: IUserProps): Promise<User| null> {
        try {
            const res = await this.connection.execute("INSERT INTO User (name,firstname,mail,phone,admin) VALUES (?, ?, ?, ?, ?)", [
                user.name,
                user.firstname,
                user.mail,
                user.phone,
                user.admin
            ]);
            const headers = res[0] as ResultSetHeader;
            return new User({
                ...user,
                id: "" + headers.insertId
            });
        } catch(err) {
            console.error(err); // log dans un fichier c'est mieux
            return null;
        }
    }

}