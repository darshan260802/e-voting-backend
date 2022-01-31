const express = require("express");
const { getDocs, collection, query, orderBy } = require("firebase/firestore");
const axios = require("axios");
const db = require("../dbConnect");
const router = express.Router();

// Endpoint 1 : GET @ /api/results to check elections results

router.get("/results", async (req, res) => {

  const date = new Date(2022, 01, 29, 23, 59,59);

  const isClosed = date.valueOf() - new Date().valueOf() < 0;

  if (isClosed) return res.status(451).send("Results will be declared on "+date+", and can be viewed only for the day");

  const q = query(collection(db, "Candidate"), orderBy("Votes", "desc"))

  await getDocs(q)
    .then((response) => res.json(response.docs.map((item) => item.data())))
    .catch((err) => console.log(err));
});

module.exports = router;
