import pool from './index';


const deletesql = `DROP TABLE IF EXISTS users CASCADE;
 DROP TABLE IF EXISTS accounts CASCADE;
  DROP TABLE IF EXISTS transactions`;

pool.query(deletesql).then(() => {
  console.log('Deleted tables successfully');
}).catch((err) => {
  console.log(err);
  process.exit(0);
});
