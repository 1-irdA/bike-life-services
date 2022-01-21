class Bike {

    /**
     * @param {int} id
     * @param {String} name 
     * @param {String} image 
     * @param {Date} date_of_purchase
     * @param {int} nbKm
     */
    constructor(id, name, image, dateOfPurchase, nbKm) {
        this.id = parseInt(id);
        this.name = name;
        this.image = image;
        this.dateOfPurchase = dateOfPurchase;
        this.nbKm = parseFloat(nbKm);
    }

    /**
     * @param {Array} records 
     * @returns Array<Bike>
     */
    static createFromList(records) {
        console.log(records);
        return records
                .map((bike) => new Bike(bike.bike_id, 
                                        bike.name, 
                                        bike.image, 
                                        bike.date_of_purchase, 
                                        bike.nb_km));
    }
}

module.exports = Bike;