const express = require("express");
const { auth } = require("express-openid-connect");
const mongodb = require("./src/mongo");
const {
    PORT,
    AUTH_SECRET,
    AUTH_ISSUER_BASE_URL,
    AUTH_CLIENT_ID,
    AUTH_BASE_URL,
} = require("./src/config");

const app = express();

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: AUTH_SECRET,
    baseURL: AUTH_BASE_URL,
    clientID: AUTH_CLIENT_ID,
    issuerBaseURL: AUTH_ISSUER_BASE_URL,
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(auth(config));
app.set("views", "./views");
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("index", {
        user: req.oidc.isAuthenticated(),
        description: "Student Result Form",
        email: req.oidc.user?.email,
    });
});

app.post("/submit", async (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        res.render("index", {
            user: req.oidc.isAuthenticated(),
            description: "Student Result Form",
        });
    }

    const email = req.oidc.user.email;
    const body = req.body;
    try {
        await mongodb.addMarks(body, email);
        res.render("success");
    } catch (e) {
        res.render("error", { message: e.message });
    }
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
