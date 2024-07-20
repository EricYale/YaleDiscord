const { initializeApp, applicationDefault } = require("firebase-admin/app");
const { getFirestore, FieldValue, FirebaseFirestoreError } = require("firebase-admin/firestore");

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
                image: null,
                year: null,
                terms: null, // Example: "FA2023", "SP2024", etc. Array of objects containing course enrollment data
            });
        } catch(e) {
            if(e.code === 6) return; // Document already exists
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

    getDiscordIdFromLinkToken = async (token) => {
        const snapshot = await this.firestore.collection("users").where("linkToken", "==", token).get();
        if(snapshot.empty) return null;
        return snapshot.docs[0].id;
    }

    updateWithInitialData = async (discordId, yaliesData) => {
        try {
            await this.firestore.collection("users").doc(discordId).update({
                yaliesDataLastUpdated: FieldValue.serverTimestamp(),
                netId: yaliesData.netid,
                firstName: yaliesData.first_name,
                lastName: yaliesData.last_name,
                email: yaliesData.email,
                college: yaliesData.college,
                major: yaliesData.major,
                image: yaliesData.image,
                year: yaliesData.year,
            });
        } catch(e) {
            console.error(e);
            throw new Error("Failed to update user data");
        }
    }
}

module.exports = DataManager;
