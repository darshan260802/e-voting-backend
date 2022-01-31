const express = require("express");
const {
  addDoc,
  collection,
  getDocs,
  where,
  query,
} = require("firebase/firestore");
const bcrypt = require("bcrypt");
const router = express.Router();
const axios = require("axios");
const db = require("../dbConnect");

// Gate 1:  POST Endpoint  at '/signup' to create voter account.
router.post("/signup", async (req, res) => {
  const { enrollment, password, name } = req.body;
  const findUser = query(
    collection(db, "Voter"),
    where("UiD", "==", enrollment)
  );

  try {
    const isUserExist = await getDocs(findUser)
      .then((results) => results.docs.map((item) => item.data()).length !== 0)
      .catch((err) => console.log(err));

    if (isUserExist) {
      res.status(422).send("Voter Already Exist!, Please Login...");
      return;
    }

    const securePassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    const userId = await addDoc(collection(db, "Voter"), {
      UiD: enrollment,
      Name: name,
      Password: securePassword,
      RemainingVotes: 1,
    })
      .then((response) => response.id)
      .catch((err) => console.log(err));

    res.status(200).send({ VoterID: userId, Name: name });
  } catch (errors) {
    console.log(errors);
  }
});

// GATE 2: Post Endpoint at /login to login for voters

router.post("/login", async (req, res) => {
  const { enrollment, password } = req.body;

  try {
    const findUser = query(
      collection(db, "Voter"),
      where("UiD", "==", enrollment)
    );

    const voters = await getDocs(findUser)
      .then((results) =>
        results.docs.map((item) => {
          const obj = {
            id: item.id,
            name: item.data().Name,
            password: item.data().Password,
          };
          return obj;
        })
      )
      .catch((err) => console.log(err));

    console.log(voters);

    if (voters.length === 0) {
      res.status(404).send("Voter Not Found!, Please Signup");
      return;
    }

    const voter = voters[0];
    const passwordMatch = bcrypt.compareSync(password, voter.password);
    if (passwordMatch) res.send({ VoterID: voter.id, Name: voter.name });
    else res.status(403).send("Invalid Credintials!");
  } catch (error) {
    console.log(error);
  }
});

// GATE 3: POST Endpoint at /candidateSignup to Register For Candidates

router.post("/candidateSignup", async (req, res) => {
  const { enrollment, password, name, electionMoto } = req.body;

  const date = new Date(2022, 01, 5, 23,59,59);

  const isClosed = date.valueOf() - new Date().valueOf() < 0;

  if (isClosed)
    return res.status(451).send("Candidate Registrations are closed!");
  const findUser = query(
    collection(db, "Candidate"),
    where("UiD", "==", enrollment)
  );

  try {
    const isUserExist = await getDocs(findUser)
      .then((results) => results.docs.map((item) => item.data()).length !== 0)
      .catch((err) => console.log(err));

    if (isUserExist) {
      res.status(422).send("Candidate Already Exist!, Please Login...");
      return;
    }

    const securePassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    const userId = await addDoc(collection(db, "Candidate"), {
      UiD: enrollment,
      Name: name,
      Password: securePassword,
      ElectionMoto: electionMoto,
      Votes: 0,
    })
      .then((response) => response.id)
      .catch((err) => console.log(err));

    res.send({ CandidateID: userId, Name: name });
  } catch (errors) {
    console.log(errors);
  }
});

//  GATE 4 : POST Endpoint at /candidatelogin to login for candidate
router.post("/candidatelogin", async (req, res) => {
  const { enrollment, password } = req.body;

  try {
    const findUser = query(
      collection(db, "Candidate"),
      where("UiD", "==", enrollment)
    );

    const candidates = await getDocs(findUser)
      .then((results) =>
        results.docs.map((item) => {
          return {
            id: item.id,
            password: item.data().Password,
            name: item.data().Name,
          };
        })
      )
      .catch((err) => console.log(err));

    if (candidates.length === 0) {
      res.status(404).send("Candidate Not Found!, Please Signup");
      return;
    }

    const candidate = candidates[0];
    const passwordMatch = bcrypt.compareSync(password, candidate.password);
    if (passwordMatch)
      res.send({ CandidateID: candidate.id, Name: candidate.name });
    else res.status(403).send("Invalid Credintials!");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
