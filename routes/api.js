const router = require("express").Router();
const apiController = require("../controllers/apiController");
// const { uploadSingle } = require("../middlewares/multer");

router.get("/book-page", apiController.bookPage);
// router.get('/detail-page/:id', apiController.detailPage);
router.post("/member-page", apiController.memberPage);
module.exports = router;
