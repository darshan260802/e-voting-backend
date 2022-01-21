const express = require("express");
const { getDoc, doc, updateDoc } = require("firebase/firestore");
const axios = require('axios');
const db = require("../dbConnect");
const router = express.Router();

// POST endpoint at /api/vote to make vote
router.post("/vote", async (req, res) => {
  const { candidate, voter } = req.body;

  const url = 'https://worldtimeapi.org/api/timezone/asia/kolkata';
  const isClosed = await axios.get(url).then(result => result.data.datetime.substr(0,10) !== '2022-01-21').catch(err => console.log(err))

  if(isClosed) return res.status(451).send("Voting Lines Has Been Closed")

  //   Get voter details
  const VoterData = await getDoc(doc(db, "Voter", voter))
    .then((result) => result.data())
    .catch((err) => console.log(err));

  // Get candidate details
  const CandidateData = await getDoc(doc(db, "Candidate", candidate))
    .then((result) => result.data())
    .catch((err) => console.log(err));

  // Check if voter has already given their vote
  if (VoterData.RemainingVotes === 0)
    return res.status(403).send("Voter has already given their vote!");

  // deducting remaining vote from voter
  await updateDoc(doc(db, "Voter", voter), "RemainingVotes", 0)
    .then((result) => console.log(result))
    .catch((err) => console.log(err));

  // adding vote count  to candidate
  await updateDoc(
    doc(db, "Candidate", candidate),
    "Votes",
    CandidateData.Votes + 1
  )
    .then(() => res.status(200).send("Your vote has been submitted successfully!"))
    .catch((err) => console.log(err));
});

module.exports = router;
