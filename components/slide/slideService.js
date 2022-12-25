const { Op } = require("sequelize");
const { models } = require("../../models");
const { sequelize } = require("../../models/index");

exports.getAllSlideInPresent = async (presentId) => {
    const result = await models.slides.findAll({
        attributes: ["slides_id", "presents_id", "types_id", "content"],
        include: [{
            model: models.slide_types,
            as: "type",
            attributes: ["types_name"],
            required: true,
        }],
        where: { presents_id: presentId, is_deleted: false },
        raw: true
    })

    return result;
}


exports.parseQuestionAndOption = async (slides) => {
    
    for(let i = 0; i < slides.length; i++)
    {
        let question = "";
        let options = {};

        if(slides[i].content !== "")
        {
            const parseContent = JSON.parse(slides[i].content);
            question = parseContent["question"];
            delete parseContent["question"];
            options = parseContent;
        }

        slides[i]["question"] = question;
        slides[i]["options"] = options;
    }

    const result = slides;
    return result;
}

exports.parseContent = async (data) => {
    
    for(let i = 0; i < data.length; i++)
    {
        let temp = {question: data[i].question};
        let names = Object.getOwnPropertyNames(data[i].options);
        for (let j = 0; j < names.length; j++) {
            temp[names[j]] = data[i].options[names[j]];
        }
        data[i].content = JSON.stringify(temp);
    }

    const result = data;
    return result;
}

exports.getNameAndCreator = async (presentId) => {
    const result = await models.presentations.findOne({
        include: [
            {
                model: models.users,
                as: "user",
                attributes: [],
                required: true,
            },
            {
                model: models.kahoot_groups,
                as: "group",
                attributes: [],
                required: false,
            }
        ],
        attributes: ["presents_name", 
                    "groups_id",
                    [sequelize.literal("`group`.`groups_name`"), "groups_name"],
                    [sequelize.literal("`user`.`users_name`"), "users_name"],
                ],
        where: { presents_id: presentId, is_deleted: false },
        raw: true
    })

    return result;
}

exports.getSlideTypes = async() => {
    const result = await models.slide_types.findAll();
    return result;
}

exports.addSlideInPresentation = async(presentId, typeId, content) => {
    await sequelize.query("call sp_addidslide()", {}).then((v) => console.log(v));

    const slide = await models.slides.findOne({
        attributes: ["slides_id"],
        where: { presents_id: null },
        raw: true
    });

    const slideID = slide.slides_id;

    const succesfullRows = await models.slides.update (
        {
            presents_id: presentId,
            types_id: typeId,
            content: content,
            is_deleted: false
        },
        {
            where: { slides_id: slideID },
        }
    )
    return { 
        success: succesfullRows > 0,
        slideID: slideID 
    };
}

exports.updateSlide = async (slideId, presentId, typeId, content) => {
    const successfulRow = await models.slides.update (
        {
            presents_id: presentId,
            types_id: typeId,
            content: content,
            is_deleted: false
        },
        {
            where: { slides_id: slideId },
        }
    )

    return successfulRow > 0;
}

exports.deleteSlide = async(slidesId) => {
    await models.slides.destroy({
        where: {
            slides_id: slidesId
        }
    }).then(function(rowDeleted) {
        return rowDeleted;
    }, function(error) {
        console.log(error);
        return -1;
    });
}

exports.submitSlide = async(data) => {
    return models.slides.update({
        content: data.content
    },
    {
        where: {
            slides_id: data.slides_id
        }
    });
}

exports.handleSubmitSlide = async(data) => {
    data[0].options[choice] = (parseInt(data[0].options[choice]) + 1).toString();
    let submitResult = await slideService.parseContent(data);
    await slideService.submitSlide(submitResult[0]);
    const listSlide = await slideService.getAllSlideInPresent(presentId);
    return result = await slideService.parseQuestionAndOption(listSlide);
}

exports.findOneSlide = async(slidesId) => {
    return models.slides.findOne({
        attributes: ["slides_id", "content"],
        where: {
        slides_id: slidesId,},
        raw: true
    });
}