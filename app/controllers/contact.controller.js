const { BadRequestError } = require("../errors");
const mongoose = require("mongoose");
const Contact = require("../models/contact.model");

exports.create = (req, res) => {
    res.send({ message: "create handler" });
};

exports.findAll = (req, res) => {
    res.send({ message: "findAll handler" });
};

exports.findOne = (req, res) => {
    res.send({ message: "findOne handler" });
};

exports.update = (req, res) => {
    res.send({ message: "update handler" });
};

exports.detele = (req, res) => {
    res.send({ message: "delete handler" });
};

exports.deteleAll = (req, res) => {
    res.send({ message: "deleteAll hanler" });
};

exports.findAllFavorite = (req, res) => {
    res.send({ message: "findAllFavorite handler" });
};

exports.create = async (req, res, next) => {
    if(!req.body.name) {
        return next (new BadRequestError(400, "Name can not be empty"));
    }

    const contact = new Contact({
        name: req.body.name,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        favorite: req.body.favorite === true,
    });

    try {
        const document = await contact.save();
        return res.send(document);
    } catch (error) {
        return next (
            new BadRequestError(
                500,
                "An error occurred white creating the contact"
            )
        );
    }
};

exports.findAll = async (req, res, next) => {
    const condition ={};
    const { name } = req.query;
    if (name) {
        condition.name = { $regex: new RegExp(name), $options: "i" };

    }

    try {
        const document = await Contact.find(condition);
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                "An error occurred while retrieving contacts"
            )
        );
    }
};

exports.findOne = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOne(condition);
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length == 0) {
        return next(
            new BadRequestError(400, "Data to update can not be empty")
        );
    }

    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOneAndUpdate(condition, req.body,{
            new: true,
        } );
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully"});
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                `Error retrieving contact with id=${req.params.id}`
            )
        );
    }
};

exports.detele = async (req, res, next) => {
    const { id } = req.params;
    const condition = {
        _id: id && mongoose.isValidObjectId(id) ? id : null,
    };

    try {
        const document = await Contact.findOneAndDelete(condition);
        if (!document) {
            return next(new BadRequestError(404, "Contact not found"));
        }
        return res.send({ message: "Contact was updated successfully"});
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                `Could not delete contact with id=${req.params.id}`
            )
        );
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try {
        const document = await Contact.find( {favorite: true });
        return res.send(document);
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                "An error occured while retrieving favorite contacts"
            )
        );
    }
};

exports.deteleAll = async (req, res, next) => {
    try {
        const data = await Contact.deleteMany( {});
        return res.send({
            message: `${data.deletedCount} contacts were deleted sucessfully`,
        });
    } catch (error) {
        return next(
            new BadRequestError(
                500,
                "An error occured while removing all contacts"
            )
        );
    }
};


