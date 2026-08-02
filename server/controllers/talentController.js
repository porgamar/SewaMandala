const getTalents = (req, res) => {
  res.send("Talent Controller Working!");
};


const createTalent = (req, res) => {
  console.log("Body:", req.body);
  console.log("File:", req.file);

  res.json({
    message: "Talent received successfully!",
    body: req.body,
    file: req.file,
  });
};

module.exports = {
  getTalents,
  createTalent,
};