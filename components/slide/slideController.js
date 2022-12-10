const slideService = require("./slideService")

exports.getAllSlideInPresent = async(req, res) => {
    const { presentId } = req.params;
    const result = await slideService.getAllSlideInPresent(presentId);
    res.status(200).json(result);
}

exports.getNameAndCreator = async (req, res) => {
    const { presentId } = req.params;
    const result = await slideService.getNameAndCreator(presentId);
    res.status(200).json(result);
}

exports.getSlideTypes = async(req, res) => {
    const result = await slideService.getSlideTypes();

    res.status(200).json(result);
}

exports.addSlideInPresentation = async (req, res) => {
    const { presentId, typeId, content } = req.body;
    const result = await slideService.addSlideInPresentation(presentId, typeId, content);

    if(result){
        res.status(201).send("Add slide Successfully");
    }
    else{
        res.status(405).send("Failed to Add slide")
    }
}

exports.deleteSlide = async (req, res) => {
    const { slidesId } = req.params;
    const result = await slideService.deleteSlide(slidesId);
    if (result === -1) {
        res.json("Failed to Delete slide");
    } else {
        res.json("Successfully!");
    }
}