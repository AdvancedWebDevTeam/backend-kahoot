const { models } = require("../../models");
const { sequelize } = require("../../models/index");

exports.getPresentation = async(groupId) => {
    const result = await models.presentations.findAll({
        attributes: ["presents_id", "presents_name"],
        include: [{
            model: models.users,
            as: "user",
            attributes: ["users_name"],
            required: true,
        }],
        where: { groups_id: groupId, is_deleted: false },
        raw: true
      });
    
      return result;
}

exports.addPresentation = async(groupId, userId, presentName) => {
    await sequelize.query("call sp_addidpresent()", {}).then((v) => console.log(v));

    const present = await models.presentations.findOne({
        attributes: ["presents_id"],
        where: { groups_id: null },
        raw: true
    });

    const presentID = present.presents_id;
    const succesfullRows = await models.presentations.update (
        {
            groups_id: groupId,
            creators_id: userId,
            presents_name: presentName,
            is_deleted: false
        },
        {
            where: { presents_id: presentID },
        }
    )
    return succesfullRows > 0;
}