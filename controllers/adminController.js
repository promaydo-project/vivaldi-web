//
const Books = require("../models/Books");
const Officer = require("../models/Officer");
const Member = require("../models/Members");
const Loan = require("../models/LoanBook");
const Return = require("../models/ReturnBook");
const Users = require("../models/Users");
const fs = require("fs-extra");
const path = require("path");
const bcrypt = require("bcryptjs");

module.exports = {
  viewSignin: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      if (req.session.user == null || req.session.user == undefined) {
        res.render("index", {
          alert,
          title: "E-library | Login",
        });
      } else {
        res.redirect("/admin/dashboard");
      }
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },

  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await Users.findOne({ username: username });
      const pass = await Users.findOne({ password: password });

      if (!user) {
        req.flash("alertMessage", "User yang anda masukan tidak ada!!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin", {
          alert,
        });
      }
      if (!pass) {
        req.flash("alertMessage", "Password yang anda masukan tidak cocok!!");
        req.flash("alertStatus", "danger");
        res.redirect("/admin/signin", {
          alert,
        });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
      };

      res.redirect("/admin/dashboard");
    } catch (error) {
      res.redirect("/admin/signin");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin/signin");
  },

  viewDashboard: async (req, res) => {
    try {
      const member = await Member.find();
      const book = await Books.find();
      const loan = await Loan.find()
        .populate("booksId")
        .populate("memberId")
        .populate("officerId");
      const back = await Return.find()
        .populate("booksId")
        .populate("memberId")
        .populate("officerId");
      res.render("admin/dashboard/view_dashboard", {
        member,
        book,
        loan,
        back,
        title: "E-Library | Dashboard",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/dashboard");
    }
  },
  viewCharts: async (req, res) => {
    try {
      const member = await Member.find();
      const book = await Books.find();
      res.render("admin/charts/view_charts", {
        member,
        book,
        title: "E-Library | Charts",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/charts");
    }
  },
  // Start CRUD MEMBER
  viewMember: async (req, res) => {
    try {
      const member = await Member.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/member/view_member", {
        member,
        alert,
        title: "E-Library | Anggota",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/member");
    }
  },
  addMember: async (req, res) => {
    try {
      const { nisn, name, kelas, tahun } = req.body;
      await Member.create({
        nisn,
        name,
        kelas,
        tahun,
      });
      req.flash("alertMessage", "Success Add Anggota");
      req.flash("alertStatus", "success");
      res.redirect("/admin/member");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/member");
    }
  },
  editMember: async (req, res) => {
    try {
      const { id, nisn, name, kelas, tahun } = req.body;
      const member = await Member.findOne({ _id: id });
      member.name = name;
      member.nisn = nisn;
      member.kelas = kelas;
      member.tahun = tahun;
      await member.save();
      req.flash("alertMessage", "Success Edit Anggota");
      req.flash("alertStatus", "success");
      res.redirect("/admin/member");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/member");
    }
  },
  deleteMember: async (req, res) => {
    try {
      const { id } = req.params;
      const member = await Member.findOne({ _id: id });
      await member.remove();
      req.flash("alertMessage", "Success Delete Anggota");
      req.flash("alertStatus", "success");
      res.redirect("/admin/member");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/member");
    }
  },

  // Start CRUD Books
  viewBook: async (req, res) => {
    try {
      const book = await Books.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/book/view_book", {
        book,
        alert,
        title: "E-Libray | Book",
        user: req.session.user,
      });
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  addBook: async (req, res) => {
    try {
      const { code, title, penerbit, category, jumlah } = req.body;
      await Books.create({
        code,
        title,
        penerbit,
        category,
        jumlah,
        image: `images/${req.file.filename}`,
      });
      req.flash("alertMessage", "Success Add Book");
      req.flash("alertStatus", "success");
      res.redirect("/admin/book");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  editBook: async (req, res) => {
    try {
      const { id, code, title, penerbit, category, jumlah } = req.body;
      const book = await Books.findOne({ _id: id });
      if (req.file == undefined) {
        book.code = code;
        book.title = title;
        book.penerbit = penerbit;
        book.category = category;
        await book.save();
        req.flash("alertMessage", "Success Update Book");
        req.flash("alertStatus", "success");
        res.redirect("/admin/book");
      } else {
        await fs.unlink(path.join(`public/${book.image}`));
        book.code = code;
        book.title = title;
        book.penerbit = penerbit;
        book.category = category;
        book.jumlah = jumlah;
        book.image = `images/${req.file.filename}`;
        await book.save();
        req.flash("alertMessage", "Success Update Book");
        req.flash("alertStatus", "success");
        res.redirect("/admin/book");
      }
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  deleteBook: async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Books.findOne({ _id: id });
      fs.unlinkSync(path.join(`public/${book.image}`));
      await book.remove();
      req.flash("alertMessage", "Success Delete Book");
      req.flash("alertStatus", "success");
      res.redirect("/admin/book");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/book");
    }
  },
  // Start CRUD Officer
  viewOfficer: async (req, res) => {
    try {
      const officer = await Officer.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/petugas/view_petugas", {
        officer,
        alert,
        title: "E-Library | Petugas",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/petugas");
    }
  },
  addOfficer: async (req, res) => {
    try {
      const { name, code, gender, lahir } = req.body;
      await Officer.create({ name, code, gender, lahir });
      req.flash("alertMessage", "Success Add Petugas");
      req.flash("alertStatus", "success");
      res.redirect("/admin/petugas");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/petugas");
    }
  },
  editOfficer: async (req, res) => {
    try {
      const { id, name, code, gender, lahir } = req.body;
      const officer = await Officer.findOne({ _id: id });
      officer.name = name;
      officer.code = code;
      officer.gender = gender;
      officer.lahir = lahir;
      await officer.save();
      req.flash("alertMessage", "Success Edit Petugas");
      req.flash("alertStatus", "success");
      res.redirect("/admin/petugas");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/petugas");
    }
  },
  deleteOfficer: async (req, res) => {
    try {
      const { id } = req.params;
      const officer = await Officer.findOne({ _id: id });
      await officer.remove();
      req.flash("alertMessage", "Success Delete Petugas");
      req.flash("alertStatus", "success");
      res.redirect("/admin/petugas");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/petugas");
    }
  },

  // Start CRUD Loan
  viewLoan: async (req, res) => {
    try {
      const loan = await Loan.find()
        .populate("booksId")
        .populate("memberId")
        .populate("officerId");
      const book = await Books.find();
      const member = await Member.find();
      const officer = await Officer.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/peminjaman/view_pinjaman", {
        loan,
        book,
        member,
        officer,
        alert,
        title: "E-Library | Peminjaman Buku",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/peminjaman");
    }
  },
  addLoan: async (req, res) => {
    try {
      const { dateLoan, dateReturn, memberId, officerId, booksId } = req.body;
      const newItem = {
        dateLoan,
        dateReturn,
        memberId,
        officerId,
        booksId,
      };
      await Loan.create(newItem);
      req.flash("alertMessage", "Success Add Peminjaman Buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/peminjaman");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/peminjaman");
    }
  },
  editLoan: async (req, res) => {
    try {
      const { id, dateLoan, dateReturn, booksId, memberId, officerId } =
        req.body;
      const loan = await Loan.findOne({ _id: id });
      loan.dateLoan = dateLoan;
      loan.dateReturn = dateReturn;
      loan.booksId = booksId;
      loan.memberId = memberId;
      loan.officerId = officerId;
      await loan.save();
      req.flash("alertMessage", "Success Edit Peminjam Buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/peminjaman");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/peminjaman");
    }
  },
  deleteLoan: async (req, res) => {
    try {
      const { id } = req.params;
      const loan = await Loan.findOne({ _id: id });
      await loan.remove();
      req.flash("alertMessage", "Success Delete Peminjaman Buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/peminjaman");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/peminjaman");
    }
  },

  // Start CRUD Return
  viewReturn: async (req, res) => {
    try {
      const back = await Return.find()
        .populate("booksId")
        .populate("memberId")
        .populate("officerId");
      const book = await Books.find();
      const member = await Member.find();
      const officer = await Officer.find();
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };
      res.render("admin/pengembalian/view_pengembalian", {
        back,
        book,
        member,
        officer,
        alert,
        title: "E-Library | Peminjaman Buku",
        user: req.session.user,
      });
    } catch (error) {
      res.redirect("/admin/pengembalian");
    }
  },
  addReturn: async (req, res) => {
    try {
      const { dateReturn, memberId, officerId, booksId } = req.body;
      const newItem = {
        dateReturn,
        memberId,
        officerId,
        booksId,
      };
      await Return.create(newItem);
      req.flash("alertMessage", "Success Add Pengembalian Buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/pengembalian");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/pengembalian");
    }
  },
  deleteReturn: async (req, res) => {
    try {
      const { id } = req.params;
      const back = await Return.findOne({ _id: id });
      await back.remove();
      req.flash("alertMessage", "Success Delete Pengembalian Buku");
      req.flash("alertStatus", "success");
      res.redirect("/admin/pengembalian");
    } catch (error) {
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/pengembalian");
    }
  },
};
