const slideService = require("./slideService")

exports.getAllSlideInPresent = async (req, res) => {
    const { presentId } = req.params;
    const slides = await slideService.getAllSlideInPresent(presentId);
    const result = await slideService.parseQuestionAndOption(slides);
    res.status(200).json(result);
}

exports.getNameAndCreator = async (req, res) => {
    const { presentId } = req.params;
    const result = await slideService.getNameAndCreator(presentId);
    res.status(200).json(result);
}

exports.getSlideTypes = async (req, res) => {
    const result = await slideService.getSlideTypes();

    res.status(200).json(result);
}

exports.addSlideInPresentation = async (req, res) => {
    const { presentId, typeId, content } = req.body;
    const result = await slideService.addSlideInPresentation(presentId, typeId, content);

    if (result.success) {
        res.status(201).json(result.slideID);
    }
    else {
        res.status(405).send("Failed to Add slide");
    }
}

exports.updateSlide = async (req, res) => {
    const { slideId, presentId, typeId, content } = req.body;
    const result = await slideService.updateSlide(slideId, presentId, typeId, content);
    if (result) {
        res.status(201).send("Update slide success");
    }
    else {
        res.status(405).send("Failed to update slide");
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

exports.submitSlide = async (req, res) => {
    const { presentId ,slidesId } = req.params;
    const { question, choice } = req.body;
    let slide = await slideService.findOneSlide(slidesId);
    let arraySlide = [slide];
    if (!slide) {
        res.json("Failed to submit or slide is not exists");
    } else {
        let data = await slideService.parseQuestionAndOption(arraySlide);
        if (question === data[0].question) {
            const result = await slideService.handleSubmitSlide(data);
            res.io.emit("submitSlide", result);
            res.json("Submit success.");
        } else {
            res.json("Failed to submit or question is not exists");
        }
    }
}