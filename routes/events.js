var express = require('express');
var router = express.Router();
const eventsController = require('../controllers/event');

/* GET events listing. */
router.get('/', eventsController.getEvents);

/* Create event */
router.post('/', eventsController.createEvent);

/* GET events by id. */
router.get('/:id', eventsController.getEvent);

/* UPDATE events listing. */
router.put('/update/:id', eventsController.updateEvent);

/* DELETE event listing. */
router.delete('/delete/:id', eventsController.deleteEvent);

module.exports = router;
