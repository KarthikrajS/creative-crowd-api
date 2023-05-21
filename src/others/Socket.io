// import io from "socket.io-client";
// import Peer from "peerjs";

// const socket = io("http://localhost:3001");

// const peer = new Peer(undefined, {
//   host: "/",
//   port: "3001",
// });

// const socketConnect = (userId) => {
//   socket.connect();
//   socket.emit("join room", userId);
// };

// const socketDisconnect = () => {
//   socket.disconnect();
// };

// const createPeer = (userId, callerId, stream) => {
//   const call = peer.call(userId, stream);
//   call.on("stream", (remoteStream) => {
//     // Display remote stream in a video element
//   });

//   call.on("close", () => {
//     // Cleanup video element
//   });

//   call.on("error", (error) => {
//     // Handle call errors
//   });

//   return call;
// };

// const answerCall = (userId, callerId, stream) => {
//   const call = peer.call(callerId, stream);
//   call.on("stream", (remoteStream) => {
//     // Display remote stream in a video element
//   });

//   call.on("close", () => {
//     // Cleanup video element
//   });

//   call.on("error", (error) => {
//     // Handle call errors
//   });

//   return call;
// };

// const startListeningForCalls = (stream) => {
//   peer.on("call", (call) => {
//     call.answer(stream);
//     call.on("stream", (remoteStream) => {
//       // Display remote stream in a video element
//     });

//     call.on("close", () => {
//       // Cleanup video element
//     });

//     call.on("error", (error) => {
//       // Handle call errors
//     });
//   });
// };

// const socketOnCall = (callback) => {
//   socket.on("call", (data) => {
//     callback(data.callerId, data.stream);
//   });
// };

// const socketSendCall = (userId, callerId, stream) => {
//   socket.emit("call", { userId, callerId, stream });
// };

// const socketOnEndCall = (callback) => {
//   socket.on("end call", () => {
//     callback();
//   });
// };

// const socketSendEndCall = () => {
//   socket.emit("end call");
// };

// export {
//   socketConnect,
//   socketDisconnect,
//   createPeer,
//   answerCall,
//   startListeningForCalls,
//   socketOnCall,
//   socketSendCall,
//   socketOnEndCall,
//   socketSendEndCall,
// };
