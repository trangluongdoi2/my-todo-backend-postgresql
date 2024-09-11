import config from '@/config';
import pg from 'pg';
const Pool = pg.Pool;

const pool = new Pool({ ...config.postgresql });
export default pool;