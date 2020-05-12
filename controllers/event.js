const Event = require('../data/event');

module.exports = {
  getEvent,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
};

/**
 * @api {get} /events/:id Get Event by id
 * @apiName GetEvent
 * @apiGroup Event
 *
 * @apiUse Authentication
 * @apiParam {String} id id of Event to retrieve
 * @apiUse PopulateQueryParam
 * @apiUse ModelEvent
 */
async function getEvent(req, res) {
  try {
    const id = req.swagger.params.id.value;

    const anyPermission = req.access.can(req.role).readAny('Event');
    const ownPermission = req.access.can(req.role).readOwn('Event');

    const event = await Event.getEvent(id, req.query);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (anyPermission.granted) {
      res.permission = anyPermission;
      return res.json(Event);
    }

    if (ownPermission.granted && await req.helpers.hasEvent(req.user.id, id)) {
      res.permission = ownPermission;
      return res.json(event);
    }

    return res.status(403).json({ message: 'operation not allowed' });
  } catch (error) {
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to fetch Event' });
  }
}

/**
 * @api {get} /events Get all Events
 * @apiName GetEvents
 * @apiGroup Event
 *
 * @apiUse Authentication
 * @apiUse ListQueryParams
 * @apiUse ModelQueryEvent
 * @apiUse OtherModelParams
 * @apiUse ModelEvents
 */
async function getEvents(req, res) {
  try {
    if (req.user.role == 'admin') {
      const events = await Event.getEvents(req.query);
      return res.json(events);
    }

    if (req.user.role == 'user' && req.user._id == req.query.user) {
      console.log(req.query)
      const events = await Event.getEvents({ ...req.query, user: req.user._id });
      return res.json(events);
    }

    return res.status('403').json({ message: 'operation not allowed' });
  } catch (error) {
    console.log(error);
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to fetch Events' });
  }
}

/**
 * @api {post} /events Create new Event
 * @apiName CreateEvent
 * @apiGroup Event
 *
 * @apiUse Authentication
 * @apiUse ModelCreateEvent
 * @apiUse ModelEvent
 */
async function createEvent(req, res) {
  try {
    if (req.user.role == 'admin') {
      const event = await Event.createEvent(req.body);
      return res.json(event);
    }
    if (req.user.role == 'user' && req.user._id == req.body.user) {
      const event = await Event.createEvent(req.body);
      return res.json(event);
    }

    return res.status('403').json({ message: 'operation not allowed' });
  } catch (error) {
    console.log(error);
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to create Event' });
  }
}

/**
 * @api {put} /events/:id Update Event by id
 * @apiName UpdateEvent
 * @apiGroup Event
 *
 * @apiUse Authentication
 * @apiParam {String} id id of Event to update
 * @apiUse ModelUpdateEvent
 * @apiUse ModelEvent
 */
async function updateEvent(req, res) {
  try {
    const id = req.swagger.params.id.value;

    const updateAnyPermission = req.access.can(req.role).updateAny('Event');
    const updateOwnPermission = req.access.can(req.role).updateOwn('Event');

    let data = {};

    let event = await Event.getEvent(id);

    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (updateAnyPermission.granted) {
      data = updateAnyPermission.filter(req.body);
    } else if (
      updateOwnPermission.granted
      && req.user.id === String(event.user)
    ) {
      data = updateOwnPermission.filter(req.body);
    } else {
      return res.status(403).json({ message: 'operation not allowed' });
    }

    event = await Event.updateEvent(id, data);
    return res.json(event);
  } catch (error) {
    console.log(error);
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to update Event' });
  }
}

/**
 * @api {delete} /events/:id Delete Event by id
 * @apiName DeleteEvent
 * @apiGroup Event
 *
 * @apiUse Authentication
 * @apiParam {String} id id of Event to delete
 * @apiUse PopulateQueryParam
 * @apiUse ModelEvent
 */
async function deleteEvent(req, res) {
  try {
    const id = req.swagger.params.id.value;

    const anyPermission = req.access.can(req.role).readAny('Event');
    const ownPermission = req.access.can(req.role).readOwn('Event');

    const event = await Event.deleteEvent(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (anyPermission.granted) {
      res.permission = anyPermission;
      return res.json(event);
    }

    if (ownPermission.granted && await req.helpers.hasEvent(req.user.id, id)) {
      res.permission = ownPermission;
      return res.json(event);
    }

    return res.status(403).json({ message: 'operation not allowed' });
  } catch (error) {
    return res.status(error.message ? 400 : 500).json({ message: error.message || 'failed to fetch Event' });
  }
}