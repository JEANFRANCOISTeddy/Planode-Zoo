import {Pass, IPassProps} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}
export interface PassUpdateOptions {
    id:string;
    name?:string;
    price?:number;
    route?:Array<object>;
    day_start_validation?: string;
    day_end_validation?: string
}

export class PassController {

    private connection: Connection;

    constructor(connection: Connection){
        this.connection = connection;

    }





    async getAll(options ?: GetAllOptions): Promise<Pass[]> {
        options = options || {};
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;
        const res = await this.connection.query(`SELECT id,name,price,route,day_start_validation,day_end_validation FROM Pass LIMIT ${offset}, ${limit} `);
        const data = res[0];
        if(Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function(row: RowDataPacket) {
                return new Pass ({
                    id: "" + row["id"],
                    name: row["name"],
                    price: row["price"],
                    route: row["route"],
                    day_start_validation: row["day_start_validation"],
                    day_end_validation: row["day_end_validation"]

                }) 

            });
        }
    
        return [];
    }

    async getById(id: string): Promise<Pass | null> {

        const res = await this.connection.query(`SELECT id,name,price,route,day_start_validation,day_end_validation FROM Pass WHERE id = ${id} `);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];   
                return new Pass ({
                    id: "" + row["id"],
                    name: row["name"],
                    price: row["price"],
                    route: row["route"],
                    day_start_validation: row["day_start_validation"],
                    day_end_validation: row["day_end_validation"]


                });

            }
        }
        return null;
    }
 



    async create(pass: IPassProps): Promise<Pass| null> {
        try {
            const res = await this.connection.execute("INSERT INTO Pass (name,price,route,day_start_validation,day_end_validation) VALUES (?, ?, ?, ?, ?)", [
                pass.name,
                pass.price,
                pass.route,
                pass.day_start_validation,
                pass.day_end_validation
            ]);
            const headers = res[0] as ResultSetHeader;
            return new Pass({
                ...pass,
                id: "" + headers.insertId
            });
        } catch(err) {
            console.error(err); // log dans un fichier c'est mieux
            return null;
        }
    }

    async removeById(id: string): Promise<boolean> {
        try {
            const res = await this.connection.execute(`DELETE FROM Pass WHERE id = ${escape(id)}`);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows === 1;
        } catch (err) {
            console.error(err); // log dans un fichier c'est mieux
            return false;
        }
    }
    async update(options: PassUpdateOptions): Promise<Pass | null> {

    
        const setClause: string[] = [];
        const params = [];

        if(options.name !== undefined) {
            setClause.push("name = ?");
            params.push(options.name);
        }

        if(options.price !== undefined) {
            setClause.push("price = ?");
            params.push(options.price);
        }

        if(options.route !== undefined) {
            setClause.push("route = ?");
            params.push(options.route);
        }

        if(options.day_start_validation !== undefined) {
            setClause.push("day_start_validation = ?");
            params.push(options.day_start_validation);
        }

        if(options.day_end_validation !== undefined) {
            setClause.push("day_end_validation = ?");
            params.push(options.day_end_validation);
        }
        
        params.push(options.id);
        const res = await this.connection.execute(`UPDATE Pass SET ${setClause.join(", ")} WHERE id = ?`, params);
        const headers = res[0] as ResultSetHeader;
        if(headers.affectedRows === 1) {
            return this.getById(options.id);
        }
        return null;
    }

}