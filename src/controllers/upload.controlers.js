// import firebase from "firebase/app";
// import "firebase/storage";
// import "firebase/firestore";

// // Initialize Firebase
// const firebaseConfig = {
//   apiKey: "AIzaSyCp_3jU6VklFJa7rl9jHWEdjNq72DhB5j4",
//   authDomain: "tutor-student-aaba2.firebaseapp.com",
//   projectId: "tutor-student-aaba2",
//   storageBucket: "tutor-student-aaba2.appspot.com",
//   messagingSenderId: "811107985232",
//   appId: "1:811107985232:web:02855c03f30eb1f3b92e55",
//   measurementId: "G-G723K9XTFZ",
// };

// firebase.initializeApp(firebaseConfig);

// const storageRef = firebase.storage().ref();
// const firestore = firebase.firestore();

// // function to upload a file to Firebase Storage and save metadata to Firestore
// export const uploadFile = async (file, metadata, userId) => {
//   try {
//     // upload file to Firebase Storage
//     const fileRef = storageRef.child(`${userId}/${file.name}`);
//     await fileRef.put(file);

//     // get download URL for the file
//     const downloadURL = await fileRef.getDownloadURL();

//     // save metadata to Firestore
//     const resourcesRef = firestore.collection("resources");
//     const docRef = await resourcesRef.add({
//       title: metadata.title,
//       description: metadata.description,
//       type: metadata.type,
//       thumbnailURL: metadata.thumbnailURL,
//       downloadURL: downloadURL,
//       userId: userId,
//     });
//     console.log(`Resource ${docRef.id} uploaded successfully`);
//     return docRef.id;
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     return null;
//   }
// };
