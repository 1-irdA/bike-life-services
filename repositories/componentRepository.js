const pool = require('../db/db');

class ComponentRepository {
    
    /**
     * @param {int} bikeId 
     * @returns QueryResult<any>
     */
     static getBikeComponents = async (bikeId) => {
        const client = await pool.connect();
        const res = await client.query(`SELECT * FROM components WHERE fk_bike = $1 ORDER BY nb_km DESC`, [bikeId]);
        client.release(true);
        return res;
    }

    /**
     * @param {Component} component 
     * @returns QueryResult<any>
     */
    static updateComponent = async (component) => {
        const client = await pool.connect();
        const res = await client.query(`UPDATE components
                                SET brand = $1,
                                date_of_purchase = $2,
                                nb_km = $3,
                                duration = $4,
                                image = $5,
                                component_type = $6
                                WHERE component_id = $7`,
                                [component.brand, 
                                component.dateOfPurchase, 
                                component.km, 
                                component.duration,
                                component.image,
                                component.type,
                                component.id]);
        client.release(true);
        return res;
    }

    static updateNbKmBikeComponents = async (km, bikeId) => {
        const client = await pool.connect();
        const res = await client.query(`UPDATE components 
                                        SET nb_km = nb_km + $1 
                                        WHERE fk_bike = $2`,
                                        [km, bikeId]);
        client.release(true);
        return res;
    }

    /**
     * @param {String} brand 
     * @param {String} image 
     * @param {float} km 
     * @param {float} duration 
     * @param {String} type 
     * @param {Date} date 
     * @param {int} bikeId
     * @returns QueryResult<any>
     */
    static add = async (brand, image, km, duration, type, date, bikeId) => {
        const client = await pool.connect();
        const res = await client.query(`INSERT INTO components
                                        (brand, image, nb_km, duration, component_type, date_of_purchase, fk_bike)
                                        VALUES
                                        ($1, $2, $3, $4, $5, $6, $7)`, [brand, image, km, duration, type, date, bikeId]);
        client.release(true);
        return res;
    }
}

module.exports = ComponentRepository;