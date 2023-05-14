const express = require("express");
const router = express.Router();
const { validateEvent } = require("../middlewares/validation");
const { isAdmin,isUser } = require("../middlewares/authorization");
const {createEvent, deleteEvent, getEvents, getPrivateEvents, updateEvent
} = require("../controllers/eventController");
// create new event
router.post("/event", isAdmin,validateEvent(''), createEvent);
// update event
router.put("/event", isAdmin,validateEvent('edit'),updateEvent);
router.delete("/event/:id", isAdmin,deleteEvent);
router.get("/event",getEvents);
router.get("/privateEvent",isUser,getPrivateEvents);
module.exports = router;