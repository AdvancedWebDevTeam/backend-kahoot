module.exports = (io, socket) => {
    const clickedSlide = (index) => {
      io.emit("clickedSlide", index);
    }
  
    const disconnect = () => {
        console.log("User disconnected.");
    }
    console.log("-----------------------------User connected.--------------------------");
    socket.on("clickedSlide", clickedSlide);
    socket.on('disconnect', disconnect);
}