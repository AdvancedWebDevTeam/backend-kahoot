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
    return succesfullRows > 0;
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