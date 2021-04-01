import {User, IUserProps} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export interface UserUpdateOptions {
    id: string;
    name?: string;
    firstname?: string;
    mail?: string;
    phone?: string;
    admin?: string;
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

    async update(options: UserUpdateOptions): Promise<User | null> {
        const setClause: string[] = [];
        const params = [];
        if(options.name !== undefined) {
            setClause.push("name = ?");
            params.push(options.name);
        }
        if(options.firstname !== undefined) {
            setClause.push("firstname = ?");
            params.push(options.firstname);
        }
        if(options.mail !== undefined) {
            setClause.push("mail = ?");
            params.push(options.mail);
        }
        if(options.phone !== undefined) {
            setClause.push("phone = ?");
            params.push(options.phone);
        }
        if(options.admin !== undefined) {
            setClause.push("admin = ?");
            params.push(options.admin);
        }
        
        params.push(options.id);
        const res = await this.connection.execute(`UPDATE Animal SET ${setClause.join(", ")} WHERE id = ?`, params);
        const headers = res[0] as ResultSetHeader;
        if(headers.affectedRows === 1) {
            return this.getById(options.id);
        }
        return null;
    }
    async removeById(id: string): Promise<boolean> {
        try {
            const res = await this.connection.execute(`DELETE FROM User WHERE id = ${escape(id)}`);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows === 1;
        } catch (err) {
            console.error(err); // log dans un fichier c'est mieux
            return false;
        }
    }

}