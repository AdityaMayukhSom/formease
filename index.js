const express = require("express");
const { auth, requiresAuth } = require("express-openid-connect");
const mongodb = require("./src/mongo");
const {
    PORT,
    AUTH_SECRET,
    AUTH_ISSUER_BASE_URL,
    AUTH_CLIENT_ID,
    AUTH_BASE_URL,
    ALLOWED_EMAILS_LIST,
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

app.get("/ranks", requiresAuth(), async (req, res) => {
    if (!req.oidc.user.email || !ALLOWED_EMAILS_LIST.includes(req.oidc.user.email)) {
        res.render("error", {
            message: "you are not allowed to visit ranks list",
        });
    } else {
        const students = await mongodb.getRanksByAverage();
        res.render("ranks", { students });
    }
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
