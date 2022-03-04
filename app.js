const express = require("express");
const cors = require("cors");

const app = express();
const setupContactRoutes = require("./app/routes/contact.routes");

app.use(cors());
app.use(express.json());

app.get("/",(req, res) => {
        res.json({ message: "welcome to contact book application." });
});

setupContactRoutes(app);

module.exports = app; 