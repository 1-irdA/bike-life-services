require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v1: uuidv1 } = require('uuid');
const Member = require('../models/Member');

class Generator {

    /**
     * @returns {String}
     */
    static uuid = () => uuidv1();

    /**
     * @param {String} password 
     * @returns {String}
     */
    static createHash = async (password) => {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    /**
     * @param {Member} member 
     * @returns {String}
     */
    static createJwt = (member) => jwt.sign({data: JSON.stringify(member) }, process.env.SECRET_TOKEN);

    /**
     * @param {String} password 
     * @param {String} hash 
     * @returns {Boolean} 
     */
    static comparePassword =  async (password, hash) => await bcrypt.compare(password, hash);
}

module.exports = Generator;