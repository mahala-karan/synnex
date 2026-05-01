const express = require('express');
const router = express.Router();

// Apne controller se functions import kar rahe hain (🔥 deleteMeeting add kiya)
const { saveMeetingLink, getMeetingLink, getAllMeetings, deleteMeeting } = require('../controllers/meetingController');

// 1. Nayi meeting save karne ke liye (POST request)
router.post('/', saveMeetingLink);

// 2. Latest meeting dekhne ke liye (GET request - Students ke popup ke liye)
router.get('/', getMeetingLink);

// 3. Saari meetings ki history dekhne ke liye (GET request - Admin panel ke liye)
router.get('/all', getAllMeetings);

// 4. 🔥 NAYA: Meeting delete karne ke liye (DELETE request - Admin panel ke liye)
router.delete('/:id', deleteMeeting);

module.exports = router;
