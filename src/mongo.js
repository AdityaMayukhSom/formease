const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_DBNAME, MONGODB_THIRD_YEAR_COLLECTION_NAME } = require("./config");
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = new URL("mongodb+srv://ju-sgpa-calculator.bkrtmnl.mongodb.net/");
// uri.protocol = "mongodb+srv:";
uri.username = MONGODB_USERNAME;
uri.password = MONGODB_PASSWORD;
uri.searchParams.set("retryWrites", "true");
uri.searchParams.set("w", "majority");

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri.toString(), {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

async function addMarks(body, email) {
    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(MONGODB_DBNAME);
        const col = db.collection(MONGODB_THIRD_YEAR_COLLECTION_NAME);
        const multipleSubmissionFromOneEmail = await col.findOne({ email: email });
        if (multipleSubmissionFromOneEmail) {
            throw new Error("one submission from this email already exists.\ncontact administrator.");
        }
        const alreadyExistingRollNumber = await col.findOne({ _id: body.rollNumber });
        if (alreadyExistingRollNumber) {
            throw new Error("already one submission exists for this roll number.\ncontact administrator.");
        }

        const marks = {};
        let cgpaSum = 0;
        let semCount = 0;
        for (const sem of Object.keys(body)) {
            if (sem.startsWith("semester")) {
                const cgpa = Number.parseFloat(body[sem]);
                cgpaSum += cgpa;
                semCount++;
                Object.defineProperty(marks, sem, {
                    value: cgpa,
                    writable: true,
                    enumerable: true,
                    configurable: true,
                });
            }
        }

        if (semCount == 0) {
            throw new Error("you need atleast one semester's marks to submit the form, please try again with marks.");
        }

        // Create a new document
        let personDocument = {
            _id: body.rollNumber.trim(),
            name: body.name.trim(),
            email: email.trim(),
            rollNumber: body.rollNumber.trim(),
            marks: marks,
            average: cgpaSum / semCount,
        };
        // Insert the document into the specified collection
        const p = await col.insertOne(personDocument);
    } finally {
        await client.close();
    }
}

async function getRanksByAverage() {
    try {
        await client.connect(); // Connect to the Atlas cluster
        const db = client.db(MONGODB_DBNAME);
        const col = db.collection(MONGODB_THIRD_YEAR_COLLECTION_NAME);
        const cursor = col.find().sort({ average: -1 });
        const result = [];
        for await (const doc of cursor) {
            result.push(doc);
        }
        return result;
    } finally {
        await client.close();
    }
}

// run().catch(console.dir);

module.exports = { addMarks, getRanksByAverage };
