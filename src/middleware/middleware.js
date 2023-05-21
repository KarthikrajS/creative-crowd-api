import axios from "axios";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
import rp from "request-promise";

const middleware = {};

// middleware.generateToken = expressAsyncHandler((req, res, next) => {
//   let signature = "";
//   const iat = Math.round(new Date().getTime() / 1000);
//   const exp = iat * 60 * 60 * 2;

//   const oHeader = { alg: "HS256", typ: "JWT" };
//   const { topic, passWord, userIdentity, sessionKey, roleType } = req.body;
//   const sdkKey = process.env.SDK_KEY;
//   const skSecret = process.env.SDK_SECRET;

//   const oPayload = {
//     app_key: sdkKey,
//     iat,
//     exp,
//     tpc: topic,
//     pwd: passWord,
//     user_identity: userIdentity,
//     session_key: sessionKey,
//     role_type: roleType,
//   };

//   const sHeader = JSON.stringify(oHeader);
//   const sPayload = JSON.stringify(oPayload);

//   signature = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, skSecret);
//   res.locals.signature = signature;
//   return next();
// });

middleware.generateToken = expressAsyncHandler(async (req, res, next) => {
  var auth =
    "Basic " +
    Buffer.from(
      process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET,
      "binary"
    ).toString("base64");

  axios.defaults.headers.common["Authorization"] = auth;
  //   const response = await rp(options);
  const response = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ACCOUNT_ID}`
  );
  console.log(response.data);
  const data = response.data;

  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${data.access_token.toString()}`;

  const meeting = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: req.title,
      type: "2",
      start_time: req.start,
      duration: req.end - req.start,
      timezone: "India/Chennai_City",
      password: "123",
      agenda: req.title,
      settings: {
        host_video: "true",
        participant_vide: "true",
        join_before_host: "true",
        mute_upon_entry: "true",
        breakout_room: {
          enable: true,
        },
      },
    },
    { "content-type": "application/json" }
  );
  req.meeting = meeting;
  return next();
});

export default middleware;
