import expressAsyncHandler from "express-async-handler";

export const generate = expressAsyncHandler(async (req, res) => {
  const meetingData = req.meeting.data;
  res.json({ message: "Meeting created", success: true ,meetingData});
  //   res.status(200).json();
});
