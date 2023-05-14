const Event = require("../models/Event");
const User = require("../models/User");
const createEvent = async (req, res) => {
  try {
    const { title, description, start, end, isPublic, guests } = req.body;
    const event = new Event({
      title,
      description,
      start,
      end,
      isPublic,
      creator: req.user._id,
      guests: guests
        ? await User.find({ email: { $in: guests } }).select("_id")
        : [],
    });
    await event.save();
    res.status(201).json({ event, message: "Event Created Successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const updateEvent = async (req, res) => {
  try {
    const { title, description, start, end, isPublic, guests, id } = req.body;
    const event = await Event.findByIdAndUpdate(
      id,
      {
        ...(title && { title }),
        ...(description && { description }),
        ...(start && { start }),
        ...(end && { end }),
        ...(isPublic && { isPublic }),
        ...(guests && {
          guests: await User.find({ email: { $in: guests } }).select("_id"),
        }),
      },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ event, message: "Event Updated Succesfuly" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    await Event.deleteOne({ _id: id });
    res.status(200).json({ message: "Event Deleted Succesfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getEvents = async (req, res) => {
  try {
    const { title, start, end } = req.query;

    // Build the search query object based on the query parameters
    const searchQuery = {};
    if (title) {
      searchQuery.title = { $regex: new RegExp(title, "i") };
    }
    if (start && end) {
      searchQuery.start = { $gte: start, $lte: end };
    }
    const events = await Event.find({
      isPublic: true,
      ...searchQuery,
    }).populate("creator", "name");
    res.json({ events, message: "Events Fetched Succesfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrivateEvents = async (req, res) => {
  try {
    const userId = req.user._id;
    const { title, start, end } = req.query;
    const searchQuery = {};

    if (title) {
      searchQuery.title = { $regex: new RegExp(title, "i") };
    }
    if (start && end) {
      searchQuery.start = { $gte: start, $lte: end };
    }
    const guestEvents = await Event.find({
      isPublic: false,
      guests: userId,
      ...searchQuery,
    })
      .populate("creator", "_id name email")
      .populate("guests", "_id name email")
      .exec();
    const ownerEvents = await Event.find({ creator: userId, ...searchQuery })
      .populate("creator", "_id name email")
      .populate("guests", "_id name email")
      .exec();
    const events = guestEvents.concat(ownerEvents);
    res.json({ events, message: "Private Events Fetched Succesfuly" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getPrivateEvents,
};
