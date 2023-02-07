const Book = require("../models/Books");
const Member = require("../models/Members");

module.exports = {
  bookPage: async (req, res) => {
    try {
      const book = await Book.find().limit(5);
      res.status(200).json({
        book,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  memberPage: async (req, res) => {
    const { nisn, name, kelas, tahun } = req.body;

    if (
      nisn === undefined ||
      name === undefined ||
      kelas === undefined ||
      tahun === undefined
    ) {
      res.status(404).json({ message: "Lengkapi semua field" });
    }

    const member = await Member.create({
      nisn,
      name,
      kelas,
      tahun,
    });
    console.log(member);
    res.status(201).json({ message: "Success Jadi Member", member });
  },
};
