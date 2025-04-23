import {drizzle } from 'drizzle-orm/node-postgres';


export const db = drizzle(process.env.NEXT_PUBLIC_DATABASE_CONNECTION_STRING!);