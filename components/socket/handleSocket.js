module.exports = (io, socket) => {
    const clickedSlide = (index) => {
      io.emit("clickedSlide", index);
    }
    const Notify = (groupId) =>{
      io.emit("NotifyPresentation", "present in presenting")
    }
    const disconnect = () => {
        console.log("User disconnected.");
    }
    console.log("-----------------------------User connected.--------------------------");
    socket.on("clickedSlide", clickedSlide);

    socket.on("NotifyPresentation", Notify)
    socket.on('disconnect', disconnect);
}