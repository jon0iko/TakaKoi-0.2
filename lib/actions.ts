"use server";
import { neon } from "@neondatabase/serverless";

export async function db(query:string) {
    try {
        const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
        const data = await sql(query);
        return data;
    }
    catch (error) {
        console.error(error);
        throw error;
    }

}