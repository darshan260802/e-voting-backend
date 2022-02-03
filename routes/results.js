const express = require("express");
const { getDocs, collection, query, orderBy } = require("firebase/firestore");
const axios = require("axios");
const db = require("../dbConnect");
const router = express.Router();

// Endpoint 1 : GET @ /api/results to check elections results

router.get("/results", async (req, res) => {

  const Sdate = new Date(2022, 01, 3, 08,0,0);
  const Edate = new Date(2022, 01, 3, 12,59,59);

  const isClosed = (Sdate.valueOf() - new Date().valueOf() > 0) || (Edate.valueOf() - new Date().valueOf() < 0) ;
  console.log((Sdate.valueOf() - new Date().valueOf() > 0));
  console.log((Edate.valueOf() - new Date().valueOf() < 0));

  res.send({
    today: new Date(),
    Sdate,
    Edate,
    "---":"--",
    values:new Date().valueOf(),
    eV:Edate.valueOf(),
    sV:Sdate.valueOf()
  });

  if (isClosed) return res.status(451).send("Results will be declared on "+Sdate.toLocaleString()+", and can be viewed only for the day");

  const q = query(collection(db, "Candidate"), orderBy("Votes", "desc"))

  await getDocs(q)
    .then((response) => res.json(response.docs.map((item) => item.data())))
    .catch((err) => console.log(err));
});

module.exports = router;
