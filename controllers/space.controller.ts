import {Space, ISpaceProps} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
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
        const res = await this.connection.query(`SELECT id,name,description,images,type,capacity,time,hours,handicapped,statut FROM Space LIMIT ${offset}, ${limit} `);
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
                    statut: row["statut"]

                }) 

            });
        }
    
        return [];
    }

    async getById(id: string): Promise<Space | null> {

        const res = await this.connection.query(`SELECT id,name,description,images,type,capacity,time,hours,handicapped,statut FROM Space WHERE id = ${id} `);
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
                    statut: row["statut"]

                });

            }
        }
        return null;
    }
 



    async create(space: ISpaceProps): Promise<Space| null> {
        try {
            const res = await this.connection.execute("INSERT INTO Space (name,description,images,type,capacity,time,hours,handicapped,statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                space.name,
                space.description,
                space.images,
                space.type,
                space.capacity,
                space.time,
                space.hours,
                space.handicapped,
                space.statut
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


}