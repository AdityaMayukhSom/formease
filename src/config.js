"use strict";

const dotenv = require("dotenv");
dotenv.config();

const MONGODB_USERNAME = process.env.MONGODB_USERNAME;
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD;
const MONGODB_DBNAME = process.env.MONGODB_DBNAME;

const MONGODB_THIRD_YEAR_COLLECTION_NAME =
    process.env.MONGODB_THIRD_YEAR_COLLECTION_NAME;

if (!MONGODB_THIRD_YEAR_COLLECTION_NAME) {
    throw new Error(
        "MONGODB_THIRD_YEAR_COLLECTION_NAME environment variable not properly set"
    );
}

const AUTH_SECRET = process.env.AUTH_SECRET;
if (!AUTH_SECRET) {
    throw new Error("AUTH_SECRET environment variable not properly set");
}
const AUTH_ISSUER_BASE_URL = process.env.AUTH_ISSUER_BASE_URL;
if (!AUTH_ISSUER_BASE_URL) {
    throw new Error(
        "AUTH_ISSUER_BASE_URL environment variable not properly set"
    );
}
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
if (!AUTH_CLIENT_ID) {
    throw new Error("AUTH_CLIENT_ID environment variable not properly set");
}

const AUTH_BASE_URL = process.env.AUTH_BASE_URL;
if (!AUTH_BASE_URL) {
    throw new Error("AUTH_BASE_URL environment variable not properly set");
}

const PORT = process.env.PORT || 5000;

const ALLOWED_EMAILS_STRING = process.env.ALLOWED_EMAILS_STRING;
if (!ALLOWED_EMAILS_STRING) {
    throw new Error(
        "ALLOWED_EMAIL_STRING environment variable not properly set"
    );
}

const ALLOWED_EMAILS_LIST = ALLOWED_EMAILS_STRING.split(" ");
console.log(ALLOWED_EMAILS_LIST);

module.exports = {
    MONGODB_USERNAME,
    MONGODB_PASSWORD,
    MONGODB_DBNAME,
    MONGODB_THIRD_YEAR_COLLECTION_NAME,
    AUTH_SECRET,
    AUTH_ISSUER_BASE_URL,
    AUTH_CLIENT_ID,
    AUTH_BASE_URL,
    PORT,
    ALLOWED_EMAILS_LIST,
};
