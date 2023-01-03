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
        let heading = "";
        let subheading = "";
        let paragraph = "";

        switch(slides[i].types_id)
        {
            case 0:
            {
                slides[i]["question"] = question;
                slides[i]["options"] = options;
                slides[i]["subheading"] = subheading;
                slides[i]["heading"] = heading;
                slides[i]["paragraph"] = paragraph;

                break;
            }
            case 1:
            {
                const parseContent = JSON.parse(slides[i].content);
                question = parseContent["question"];
                delete parseContent["question"];
                options = parseContent;
                
                slides[i]["question"] = question;
                slides[i]["options"] = options;
                slides[i]["subheading"] = subheading;
                slides[i]["heading"] = heading;
                slides[i]["paragraph"] = paragraph;

                break;
            }
            case 2:
            {
                const parseContent = JSON.parse(slides[i].content);
                heading = parseContent["heading"];
                subheading = parseContent["subheading"];

                slides[i]["question"] = question;
                slides[i]["options"] = options;
                slides[i]["subheading"] = subheading;
                slides[i]["heading"] = heading;
                slides[i]["paragraph"] = paragraph;

                break;
            }
            case 3:
            {
                const parseContent = JSON.parse(slides[i].content);
                heading = parseContent["heading"];
                paragraph = parseContent["paragraph"];

                slides[i]["question"] = question;
                slides[i]["options"] = options;
                slides[i]["subheading"] = subheading;
                slides[i]["heading"] = heading;
                slides[i]["paragraph"] = paragraph;

                break;
            }
            default:
                break;
        }
    }

    const result = slides;
    return result;
}

async function parseContent(data) {
    
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
async function submitSlide(data) {
    return models.slides.update({
        content: data.content
    },
    {
        where: {
            slides_id: data.slides_id
        }
    });
}

exports.handleSubmitSlide = async(data, choice, presentId) => {
    data[0].options[choice] = (parseInt(data[0].options[choice]) + 1).toString();
    let submitResult = await parseContent(data);
    await submitSlide(submitResult[0]);
    const listSlide = await this.getAllSlideInPresent(presentId);
    return result = await this.parseQuestionAndOption(listSlide);
}

exports.findOneSlide = async(slidesId) => {
    return models.slides.findOne({
        attributes: ["slides_id", "content"],
        where: {
        slides_id: slidesId,},
        raw: true
    });
}

exports.getSlidePresent = async(presents_id) => {
    const index = await models.slide_present.findOne({
        where: {
            presents_id
        }
    });
    const slides = await this.getAllSlideInPresent(presents_id);
    const parse = await this.parseQuestionAndOption(slides);
    return {
        indexSlide: index,
        listOfSlides: parse
    };
}