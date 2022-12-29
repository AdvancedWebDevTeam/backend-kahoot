const groupService = require("../group/groupService");
const presentService = require('../presentation/presentService');

module.exports = (io, socket) => {
  const clickedSlide = (data) => {
    presentService.addSlidePresent(data.presents_id, data.indexSlide);
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
  const JoinPresent = (presentID) => {
    socket.join(presentID);
  }
  const disconnect = () => {
      console.log("User disconnected.");
  }
  const SendMessage = (message) => {
    presentService.addMessageToChat(message);
    socket.emit("receive_message", message);
  }
  console.log("-----------------------------User connected.--------------------------");

  socket.on("clickedSlide", clickedSlide);
  socket.on("NotifyPresentation", Notify)
  socket.on("Join", JoinRoom);
  socket.on("JoinPresent", JoinPresent);
  socket.on("send_message", SendMessage);
  socket.on('disconnect', disconnect);
}