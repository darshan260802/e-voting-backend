const express = require("express");
const { getDocs, collection, query, orderBy } = require("firebase/firestore");
const axios = require("axios");
const db = require("../dbConnect");
const router = express.Router();

// Endpoint 1 : GET @ /api/results to check elections results

router.get("/results", async (req, res) => {

  const Sdate = new Date(2022, 01, 3, 08,0,0);
  const Edate = new Date(2022, 01, 3, 12,59,59);
  let today = new Date();
  today = today.setHours(today.getHours + 5, today.getMinutes + 30);

  res.send(today);

  const isClosed = (Sdate.valueOf() - today.valueOf() > 0) || (Edate.valueOf() - today.valueOf() < 0) ;
  console.log((Sdate.valueOf() - today.valueOf() > 0));
  console.log((Edate.valueOf() - today.valueOf() < 0));

  if (isClosed) return res.status(451).send("Results will be declared on "+Sdate.toLocaleString()+", and can be viewed only for the day");

  const q = query(collection(db, "Candidate"), orderBy("Votes", "desc"))

  await getDocs(q)
    .then((response) => res.json(response.docs.map((item) => item.data())))
    .catch((err) => console.log(err));
});

module.exports = router;
