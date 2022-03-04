const express = require("express");
const cors = require("cors");

const { BadRequestError, errorHandler } = require("./app/errors");

const app = express();

const setupContactRoutes = require("./app/routes/contact.routes");




app.use(cors());
app.use(express.json());

app.get("/",(req, res) => {
        res.json({ message: "welcome to contact book application." });
});

setupContactRoutes(app);


//handle 404 response
app.use((req, res, next) => {
        
        next(new BadRequestError(404, "Resource not found"));
});

//define error-handling middleware last, after other app.use() and routes calls 
app.use((err, req, res, next) => {
        errorHandler.handleError(err, res);
});

module.exports = app; 