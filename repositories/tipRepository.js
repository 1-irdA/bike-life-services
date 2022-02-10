const pool = require('../db/db');

/**
 * @returns QueryResult<any>
 */
module.exports.get = async () => {

    const client = await pool.connect();
    const res = await client.query(`SELECT * 
                                    FROM tips 
                                    ORDER BY write_date DESC`);
    client.release(true);
    return res;
}

/**
 * @param {Number} tipId 
 * @returns QueryResult<any> 
 */
module.exports.getById = async (tipId) => {

    const client = await pool.connect();
    const res = await client.query(`SELECT * 
                                    FROM tips 
                                    WHERE tip_id = $1`, [tipId]);
    client.release(true);
    return res;
}

/**
 * @param {String} topic 
 * @returns QueryResult<any>
 */
module.exports.getByTopic = async (topic) => {
    
    const client = await pool.connect();
    const res = await client.query(`SELECT * 
                                    FROM tips 
                                    WHERE fk_topic LIKE $1`, [topic]);
    client.release(true);
    return res;
}