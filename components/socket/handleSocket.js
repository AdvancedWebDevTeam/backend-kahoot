const presentService = require('../presentation/presentService');

module.exports = (io, socket) => {
  const clickedSlide = (data) => {
    presentService.addSlidePresent(data.presents_id, data.indexSlide);
    io.emit("clickedSlide", data);
  };

  const disconnect = () => {
    console.log("User disconnected.");
  };
  console.log(
    "-----------------------------User connected.--------------------------"
  );
  socket.on("clickedSlide", clickedSlide);
  socket.on("disconnect", disconnect);
};
