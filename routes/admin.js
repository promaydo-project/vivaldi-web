var express = require("express");
var router = express.Router();
const adminController = require("../controllers/adminController");
const { uploadSingle, uploadMultiple } = require("../middleware/multer");
const auth = require("../middleware/auth");

router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.use(auth);
router.get("/logout", adminController.actionLogout);
router.get("/dashboard", adminController.viewDashboard);
router.get("/charts", adminController.viewCharts);

// Endpoint MEMBER
router.get("/member", adminController.viewMember);
router.post("/member", adminController.addMember);
router.put("/member", adminController.editMember);
router.delete("/member/:id", adminController.deleteMember);

// endpoint book
router.get("/book", adminController.viewBook);
router.post("/book", uploadSingle, adminController.addBook);
router.put("/book", uploadSingle, adminController.editBook);
router.delete("/book/:id", adminController.deleteBook);

// Endpoint Petugas
router.get("/petugas", adminController.viewOfficer);
router.post("/petugas", adminController.addOfficer);
router.put("/petugas", adminController.editOfficer);
router.delete("/petugas/:id", adminController.deleteOfficer);

//Endpoint Peminjaman Buku
router.get("/peminjaman", adminController.viewLoan);
router.post("/peminjaman", adminController.addLoan);
router.put("/peminjaman", adminController.editLoan);
router.delete("/peminjaman/:id", adminController.deleteLoan);

//Endpoint Pengembalian Buku
router.get("/pengembalian", adminController.viewReturn);
router.post("/pengembalian", adminController.addReturn);
router.delete("/pengembalian/:id", adminController.deleteReturn);

module.exports = router;
