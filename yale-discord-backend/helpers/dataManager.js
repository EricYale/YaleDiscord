const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");

class DataManager {
    constructor() {
        initializeApp({
            credential: applicationDefault(),
        });
        this.firestore = getFirestore();
    }

    createDocIfNotExist = async (discordId) => {
        try {
            await this.firestore.collection("users").doc(discordId).create({
                createdAt: FieldValue.serverTimestamp(),
                linkToken: null,
                yaliesDataLastUpdated: null,
                netId: null,
                firstName: null,
                lastName: null,
                email: null,
                college: null,
                major: null,
                terms: null, // Example: "FA2023", "SP2024", etc. Array of objects containing course enrollment data
            });
        } catch(e) {
            console.error(e);
        }
    }

    createLinkToken = async (discordId) => {
        await this.createDocIfNotExist(discordId);
        const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        try {
            await this.firestore.collection("users").doc(discordId).update({
                linkToken: token,
            });
        } catch(e) {
            console.error(e);
            return null;
        }
        return token;
    }
}

module.exports = DataManager;
