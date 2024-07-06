const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const loadData = () => {
  const data = fs.readFileSync("data.json");
  return JSON.parse(data);
};

app.get("/api/leads", (req, res) => {
  const query = req.query.query;
  let leads = loadData();

  if (query && query.length >= 3) {
    leads = leads.filter(
      (lead) =>
        lead.title.toLowerCase().includes(query.toLowerCase()) ||
        lead.responsible.toLowerCase().includes(query.toLowerCase())
    );
  }

  res.json(leads);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
