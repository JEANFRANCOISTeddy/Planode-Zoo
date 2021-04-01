import {Space, ISpaceProps} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}
export interface SpaceUpdateOptions {
    id: string;
    name?: string;
    description?: string;
    images?: string;
    type?: string;
    capacity?: string;
    time?: string;
    hours?: string;
    handicapped?: boolean;
    statut?: boolean;
    last_space_description?:string;
}

export class SpaceController {

    private connection: Connection;

    constructor(connection: Connection){
        this.connection = connection;

    }





    async getAll(options ?: GetAllOptions): Promise<Space[]> {
        options = options || {};
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;
        const res = await this.connection.query(`SELECT id,name,description,images,type,capacity,time,hours,handicapped,statut,last_space_description FROM Space LIMIT ${offset}, ${limit} `);
        const data = res[0];
        if(Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function(row: RowDataPacket) {
                return new Space ({
                    id: "" + row["id"],
                    name: row["name"],
                    description: row["description"],
                    images: row["images"],
                    type: row["type"],
                    capacity: row["capacity"],
                    time: row["time"],
                    hours: row["hours"],
                    handicapped: row["handicapped"],
                    statut: row["statut"],
                    last_space_description: row["last_space_description"]

                }) 

            });
        }
    
        return [];
    }

    async getById(id: string): Promise<Space | null> {

        const res = await this.connection.query(`SELECT id,name,description,images,type,capacity,time,hours,handicapped,statut,last_space_description FROM Space WHERE id = ${id} `);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];   
                return new Space ({
                    id: "" + row["id"],
                    name: row["name"],
                    description: row["description"],
                    images: row["images"],
                    type: row["type"],
                    capacity: row["capacity"],
                    time: row["time"],
                    hours: row["hours"],
                    handicapped: row["handicapped"],
                    statut: row["statut"],
                    last_space_description: row["last_space_description"]


                });

            }
        }
        return null;
    }
 



    async create(space: ISpaceProps): Promise<Space| null> {
        try {
            const res = await this.connection.execute("INSERT INTO Space (name,description,images,type,capacity,time,hours,handicapped,statut,last_space_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                space.name,
                space.description,
                space.images,
                space.type,
                space.capacity,
                space.time,
                space.hours,
                space.handicapped,
                space.statut,
                space.last_space_description
            ]);
            const headers = res[0] as ResultSetHeader;
            return new Space({
                ...space,
                id: "" + headers.insertId
            });
        } catch(err) {
            console.error(err); // log dans un fichier c'est mieux
            return null;
        }
    }

    async removeById(id: string): Promise<boolean> {
        try {
            const res = await this.connection.execute(`DELETE FROM Space WHERE id = ${escape(id)}`);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows === 1;
        } catch (err) {
            console.error(err); // log dans un fichier c'est mieux
            return false;
        }
    }
    async update(options: SpaceUpdateOptions): Promise<Space | null> {

        
        const setClause: string[] = [];
        const params = [];

        if(options.name !== undefined) {
            setClause.push("name = ?");
            params.push(options.name);
        }

        if(options.description !== undefined) {
            setClause.push("description = ?");
            params.push(options.description);
        }

        if(options.images !== undefined) {
            setClause.push("images = ?");
            params.push(options.images);
        }

        if(options.type !== undefined) {
            setClause.push("type = ?");
            params.push(options.type);
        }

        if(options.capacity !== undefined) {
            setClause.push("capacity = ?");
            params.push(options.capacity);
        }

        if(options.time !== undefined) {
            setClause.push("time = ?");
            params.push(options.time);
        }

        if(options.hours !== undefined) {
            setClause.push("hours = ?");
            params.push(options.hours);
        }
        
        if(options.handicapped !== undefined) {
            setClause.push("handicapped = ?");
            params.push(options.handicapped);
        }

        if(options.statut !== undefined) {
            setClause.push("statut = ?");
            params.push(options.statut);
        }

        if(options.last_space_description !== undefined) {
            setClause.push("last_space_description = ?");
            params.push(options.last_space_description);
        }
        
        params.push(options.id);
        const res = await this.connection.execute(`UPDATE Space SET ${setClause.join(", ")} WHERE id = ?`, params);
        const headers = res[0] as ResultSetHeader;
        if(headers.affectedRows === 1) {
            return this.getById(options.id);
        }
        return null;
    }

}