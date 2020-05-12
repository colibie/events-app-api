const { Event } = require('../models');
const { generateSearchQuery, generateGetSingleQuery } = require('./utils');

const createEvent = async (data) => {
  try {
    const event = new Event(data);
    return await event.save();
  } catch (error) {
    throw error;
  }
};

const getEvents = async (cond) => {
  try {
    return await generateSearchQuery(Event, cond);
  } catch (error) {
    throw error;
  }
};

/**
 * Finds a single Event
 * @param {String|Object} cond Event id or query
 * @param {Object} options
 */
const getEvent = async (cond, options) => {
  try {
    return await generateGetSingleQuery(Event, cond, options);
  } catch (error) {
    throw error;
  }
};

const getEventByEmail = async (email) => {
  try {
    return await Event.findOne({ email: new RegExp(`^${email}$`, 'i') });
  } catch (error) {
    throw error;
  }
};

/**
 * Updates a single Event
 * @param {String|Object} cond Event id or query
 */
const updateEvent = async (cond, data) => {
  try {
    const update = Object.assign({}, data, { updatedAt: new Date() });
    switch (typeof cond) {
      case 'string':
        return await Event.findByIdAndUpdate(cond, update, { new: true });
      default:
        return await Event.updateMany(cond, update);
    }
  } catch (error) {
    throw error;
  }
};


/**
 * Delete a single Event
 * @param {String|Object} cond Event id or query
 */
const deleteEvent = async (cond) => {
  try {
    return await Event.findByIdAndDelete(cond);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getEvent,
  getEvents,
  getEventByEmail,
  createEvent,
  updateEvent,
  deleteEvent
};