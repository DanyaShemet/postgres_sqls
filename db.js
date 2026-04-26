import { Pool } from 'pg'

export const db = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'q1w2e3r4',
    database: 'postgres',
})

