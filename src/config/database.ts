import config from '@/config';
import pg from 'pg';
const Pool = pg.Pool;

// console.log(config.postgresql, 'config.postgresql..');
const pool = new Pool({ ...config.postgresql });
// console.log(pool, 'pool...');
export default pool;