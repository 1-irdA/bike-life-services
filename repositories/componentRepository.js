const pool = require('../db/db');

class ComponentRepository {

    /**
     * @param {String} bikeId 
     * @returns {QueryResult<any>}
     */
    static getBikeComponents = async (bikeId) => {

        try {
            const client = await pool.connect();
            const res = await client.query(`SELECT components.*, get_last_changed_date(component_id) AS changed_at
                                            FROM components, bikes_components
                                            WHERE component_id = fk_component
                                            AND fk_bike = $1
                                            AND active = true
                                            ORDER BY fk_component_type`,
                                            [bikeId]);
            client.release(true);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} componentId
     * @param {String} bikeId
     * @param {Number} km
     * @param {Number} duration
     * @param {String} type
     * @returns {QueryResult<any>}
     */
    static create = async (componentId, bikeId, km, duration, type) => {

        try {
            const client = await pool.connect();
            await client.query(`INSERT INTO components (component_id, duration, fk_component_type, active, total_km)
                                VALUES ($1, $2, $3, true, $4)`,
                                [componentId, duration, type, km]);
            await client.query(`INSERT INTO bikes_components 
                                VALUES ($1, $2)`, 
                                [bikeId, componentId]);
            client.release(true);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} componentId 
     * @returns {QueryResult<any>}
     */
    static resetKm = async (componentId) => {

        try {
            const client = await pool.connect();
            await client.query(`UPDATE components
                                SET total_km = 0
                                WHERE component_id = $1`,
                                [componentId]);
            client.release(true);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} componentId 
     * @param {Number} km 
     */
    static addDailyKm = async (componentId, km) => {
        try {
            const client = await pool.connect();
            await client.query(`UPDATE components
                        SET total_km = total_km + $1
                        WHERE component_id = $2`,
                        [km, componentId]);
            client.release(true);
        } catch (err) {
            throw err;
        }
    }
    
    /**
     * @param {String} memberId 
     * @param {Number} percent 
     * @returns {QueryResult<any>}
     */
    static getAlerts = async (memberId, percent) => {
        
        try {
            const client = await pool.connect();
            const res = await client.query(`SELECT DISTINCT components.*, get_last_changed_date(component_id) AS changed_at
                                            FROM bikes, components, members_bikes, bikes_components
                                            WHERE members_bikes.fk_member = $1
                                            AND members_bikes.fk_bike = bikes.bike_id
                                            AND members_bikes.fk_bike = bikes_components.fk_bike
                                            AND bikes_components.fk_component = components.component_id
                                            AND components.active = true
                                            AND components.total_km / components.duration >= $2`,
                                            [memberId, percent]);
            client.release(true);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} componentId 
     * @param {Date} changedAt 
     * @returns {QueryResult<any>}
     */
    static changeComponent = async (componentId, changedAt, km) => {

        try {
            const client = await pool.connect();
            await client.query(`INSERT INTO components_changed
                                VALUES ($1, $2, $3)`,
                                [componentId, changedAt, km]);
            await client.query(`UPDATE components
                                SET total_km = 0
                                WHERE component_id = $1`,
                                [componentId]);
            client.release(true);
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} componentId 
     * @returns {QueryResult<any>}
     */
    static getChangeHistoric = async (componentId) => {

        try {
            const client = await pool.connect();
            const res = await client.query(`SELECT changed_at AS label, km_realised AS value
                                            FROM components_changed
                                            WHERE fk_component = $1
                                            ORDER by changed_at ASC`,
                                            [componentId]);
            client.release(true);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} memberId 
     * @param {Number} year 
     * @returns {QueryResult<any>}
     */
    static getNumOfComponentChangeByMemberByYear = async (memberId, year) => {

        try {
            const client = await pool.connect();
            const res = await client.query(`SELECT components.fk_component_type AS label, COUNT(*) AS value
                                            FROM bikes, components, members_bikes, bikes_components, components_changed
                                            WHERE members_bikes.fk_member = $1
                                            AND members_bikes.fk_bike = bikes.bike_id
                                            AND members_bikes.fk_bike = bikes_components.fk_bike
                                            AND bikes_components.fk_component = components.component_id
                                            AND components_changed.fk_component = components.component_id
                                            AND components.active = true
                                            AND EXTRACT(YEAR FROM changed_at) = $2
                                            GROUP BY components.fk_component_type`,
                                            [memberId, year]);
            client.release(true);
            return res;
        } catch (err) {
            throw err;
        }
    }

    
    /**
     * @param {String} memberId 
     * @param {Number} year 
     * @returns {QueryResult<any>}
     */
    static getAvgKmComponentChangeByMemberByYear = async (memberId, year) => {

        try {
            const client = await pool.connect();
            const res = await client.query(`SELECT components.fk_component_type AS label, AVG(components_changed.km_realised) AS value
                                            FROM bikes, components, members_bikes, bikes_components, components_changed
                                            WHERE members_bikes.fk_member = $1
                                            AND members_bikes.fk_bike = bikes.bike_id
                                            AND members_bikes.fk_bike = bikes_components.fk_bike
                                            AND bikes_components.fk_component = components.component_id
                                            AND components_changed.fk_component = components.component_id
                                            AND components.active = true
                                            AND EXTRACT(YEAR FROM changed_at) = $2
                                            GROUP BY components.fk_component_type`,
                                            [memberId, year]);
            client.release(true);
            return res;
        } catch (err) {
            throw err;
        }
    }

    /**
     * @param {String} memberId 
     * @returns {QueryResult<any>}
     */
    static getTotalNbChange = async (memberId) => {

        try {
            const client = await pool.connect();
            const res = await client.query(`SELECT EXTRACT(YEAR FROM components_changed.changed_at) AS label, COUNT(*) AS value
                                            FROM bikes, components, members_bikes, bikes_components, components_changed
                                            WHERE members_bikes.fk_member = $1
                                            AND members_bikes.fk_bike = bikes.bike_id
                                            AND members_bikes.fk_bike = bikes_components.fk_bike
                                            AND bikes_components.fk_component = components.component_id
                                            AND components_changed.fk_component = components.component_id
                                            AND components.active = true
                                            GROUP BY EXTRACT(YEAR FROM components_changed.changed_at)
                                            ORDER BY EXTRACT(YEAR FROM components_changed.changed_at)`,
                                            [memberId]);
            client.release(true);
            return res;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = ComponentRepository;