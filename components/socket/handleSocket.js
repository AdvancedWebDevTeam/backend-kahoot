const groupService = require("../group/groupService");
const presentService = require('../presentation/presentService');

module.exports = (io, socket) => {
  const clickedSlide = async (data) => {
    await presentService.addSlidePresent(data.presents_id, data.indexSlide);
    io.emit("clickedSlide", data);
  };
  const Notify = async ({presentInfo, currentUserId}) => {
    if(presentInfo.groups_id !== null){
      const userInGroup = await groupService.getAllUsersInGroup(presentInfo.groups_id);
      const list = [];
      for(let i = 0; i < userInGroup.length; i++){
        list.push(userInGroup[i].userId);
      }
      for(let j = 0; j < list.length; j++){
        if(list[j] !== currentUserId){
          io.to(list[j]).emit("NotifyPresentation", 
          `${presentInfo.presents_name} is presenting in group ${presentInfo.groups_name}`)
        }
      }
    }
  }
  const JoinRoom = (userId) => {
    socket.join(userId);
  }
  const disconnect = () => {
      console.log("User disconnected.");
  }
  const SendMessage = async ({ presentInfo, data, userID }) => {
    await presentService.addChatPresent(data);
    io.emit("receive_message", data);
    if(presentInfo.groups_id !== null){
      const userInGroup = await groupService.getAllUsersInGroup(presentInfo.groups_id);
      const list = [];
      for(let i = 0; i < userInGroup.length; i++){
        list.push(userInGroup[i].userId);
      }
      for(let j = 0; j < list.length; j++){
        if(list[j] !== userID){
          const result = {
            presents_id: data.presents_id,
            message: `You have a message in ${presentInfo.presents_name} of group ${presentInfo.groups_name}!`
          }
          io.to(list[j]).emit("NotifyMessage", result);
        }
      }
    }
  }
  console.log("-----------------------------User connected.--------------------------");

  socket.on("clickedSlide", clickedSlide);
  socket.on("NotifyPresentation", Notify)
  socket.on("Join", JoinRoom);
  socket.on("send_message", SendMessage);
  socket.on('disconnect', disconnect);
}