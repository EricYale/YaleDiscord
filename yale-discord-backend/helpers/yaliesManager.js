const yalies = require("yalies");

class YaliesManager {
    constructor() {
        this.api = new yalies.API(process.env.YALIES_API_KEY);
    }

    getUserByNetId = async (netId) => {
        let people;
        try {
            people = await this.api.people({
                filters: {
                    netid: netId,
                },
                page: 1,
                page_size: 1,
            });
        } catch(e) {
            console.error(e);
            return null;
        }
        if(!people || people.length === 0) return null;
        return people[0];
    }
}

module.exports = YaliesManager;
