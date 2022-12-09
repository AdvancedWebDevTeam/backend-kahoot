const { models } = require("../../models");
const { sequelize } = require("../../models/index");

exports.getAllSlideInPresent = async (presentId) => {
    const result = await models.slides.findAll({
        attributes: ["slides_id", "presents_id", "types_id", "content"],
        where: { presents_id: presentId, is_deleted: false },
        raw: true
    })

    return result;
}

exports.getNameAndCreator = async (presentId) => {
    const result = await models.presentations.findOne({
        attributes: ["presents_name"],
        include: [{
            model: models.users,
            as: "user",
            attributes: ["users_name"],
            required: true,
        }],
        where: { presents_id: presentId, is_deleted: false },
        raw: true
    })

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
    console.log(slideID);

    console.log({presentId, typeId, content})
    
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
    return succesfullRows > 0;
}