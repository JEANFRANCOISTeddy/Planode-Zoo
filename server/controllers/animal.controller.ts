import {Animal, IAnimalProps} from "../models";
import {Connection, escape} from "mysql2/promise";
import {ResultSetHeader, RowDataPacket} from "mysql2";

export interface GetAllOptions {
    limit?: number;
    offset?: number;
}

export interface AnimalUpdateOptions {
    id: string;
    name?:string;
    species?:string;
    weight?:number;
    height?:number;
    last_medical_description?:string;
    id_space?:string;
}


export class AnimalController {
    
    private connection: Connection;

    constructor(connection: Connection){
        this.connection = connection;

    }




    async getAll(options ?: GetAllOptions): Promise<Animal[]> {
        options = options || {};
        const limit = options?.limit || 20;
        const offset = options?.offset || 0;
        const res = await this.connection.query(`SELECT id,name,species,weight,height,last_medical_description,id_space FROM Animal LIMIT ${offset}, ${limit} `);
        const data = res[0];
        if(Array.isArray(data)) {
            return (data as RowDataPacket[]).map(function(row: RowDataPacket) {
                return new Animal ({
                    id: "" + row["id"],
                    name: row["name"],
                    species: row["species"],
                    weight: row["weight"],
                    height: row["height"],
                    last_medical_description: row["last_medical_description"],
                    id_space: row["id_space"]

                }) 

            });
        }
    
        return [];
    }

    async getById(id: string): Promise<Animal | null> {

        const res = await this.connection.query(`SELECT id,name,species,weight,height,last_medical_description,id_space FROM Animal WHERE id = ${id} `);
        const data = res[0];
        if(Array.isArray(data)) {
            const rows = data as RowDataPacket[];
            if(rows.length > 0) {
                const row = rows[0];   
                return new Animal ({
                    id: "" + row["id"],
                    name: row["name"],
                    species: row["species"],
                    weight: row["weight"],
                    height: row["height"],
                    last_medical_description: row["last_medical_description"],
                    id_space: row["id_space"]

                });

            }
        }
        return null;
    }
 



    async create(animal: IAnimalProps): Promise<Animal| null> {
        try {
            const res = await this.connection.execute("INSERT INTO Animal (name,species,weight,height,last_medical_description,id_space) VALUES (?, ?, ?, ?, ?, ?, ?)", [
                animal.name,
                animal.species,
                animal.weight,
                animal.height,
                animal.last_medical_description,
                animal.id_space
            ]);
            const headers = res[0] as ResultSetHeader;
            return new Animal({
                ...animal,
                id: "" + headers.insertId
            });
        } catch(err) {
            console.error(err); // log dans un fichier c'est mieux
            return null;
        }
    }
    async removeById(id: string): Promise<boolean> {
        try {
            const res = await this.connection.execute(`DELETE FROM Animal WHERE id = ${escape(id)}`);
            const headers = res[0] as ResultSetHeader;
            return headers.affectedRows === 1;
        } catch (err) {
            console.error(err); // log dans un fichier c'est mieux
            return false;
        }
    }

    async update(options: AnimalUpdateOptions): Promise<Animal | null> {
        const setClause: string[] = [];
        const params = [];
        if(options.name !== undefined) {
            setClause.push("name = ?");
            params.push(options.name);
        }
        if(options.species !== undefined) {
            setClause.push("species = ?");
            params.push(options.species);
        }
        if(options.weight !== undefined) {
            setClause.push("weight = ?");
            params.push(options.weight);
        }
        if(options.height !== undefined) {
            setClause.push("height = ?");
            params.push(options.height);
        }
        if(options.last_medical_description !== undefined) {
            setClause.push("last_medical_description = ?");
            params.push(options.last_medical_description);
        }
        if(options.id_space !== undefined) {
            setClause.push("id_space = ?");
            params.push(options.id_space);
        }
        
        params.push(options.id);
        const res = await this.connection.execute(`UPDATE Animal SET ${setClause.join(", ")} WHERE id = ?`, params);
        const headers = res[0] as ResultSetHeader;
        if(headers.affectedRows === 1) {
            return this.getById(options.id);
        }
        return null;
    }

}