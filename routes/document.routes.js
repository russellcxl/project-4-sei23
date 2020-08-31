const router = require("express").Router();
const User = require("../model/user.model");
const Document = require("../model/document.model");
const checkToken = require("../config/config");
const bcrypt = require("bcrypt");

// ------------------------------------ create ------------------------------------ //

// set createdBy, accessibleBy
// add document to user model
router.post("/:userid", async (req, res) => {
  try {
    let user = await User.findById(req.params.userid);
    let document = new Document(req.body);
    document.createdBy = user._id;
    document.accessibleBy.push(user._id); //could do this by validating on frontend too
    user.documents.push(document._id);
    await user.save();
    await document.save();

    res.status(200).json({
      message: "DOCUMENT successfully created",
      document,
      user
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create DOCUMENT",
    });
  }
});

// ------------------------------------ index (show all) ------------------------------------ //

router.get("/", async (req, res) => {
  try {
    let documents = await Document.find();
    res.status(200).json({
      documents,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve DOCUMENTS",
    });
  }
});

// ------------------------------------ show ------------------------------------ //

router.get("/show/:id", async (req, res) => {
  try {
    let document = await Document.findById(req.params.id);
    res.status(200).json({
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve DOCUMENT",
    });
  }
});

// ------------------------------------ edit ------------------------------------ //

router.post("/edit/:id", async (req, res) => {
  try {
    let document = await Document.findByIdAndUpdate(req.params.id, req.body);
    res.status(200).json({
      message: "DOCUMENT successfully updated",
      document,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve DOCUMENT",
    });
  }
});

// ------------------------------------ show to authorised users ------------------------------------ //

router.get("/showauthorised/:id/:userid", async (req, res) => {
  try {
    // if doc.accessibleBy includes user.id => return doc
    let document = await Document.findById(req.params.id);
    if (document.accessibleBy.includes(req.params.userid)) {
      return res.status(200).json({
        document,
      });
    }

    res.status(200).json({
      message: "You are not authorised to view this DOCUMENT",
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve DOCUMENT",
    });
  }
});

// ------------------------------------ export ------------------------------------ //

module.exports = router;