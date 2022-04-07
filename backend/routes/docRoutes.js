const express = require('express')
const docCtrl = require('../controllers/docCtrl')
const { protect } = require('../middleware/authMid')

const router = express.Router()

router.route('/')
    .get(protect, docCtrl.getDocs)
    .post(protect, docCtrl.createDoc)

router.route('/:id')
    .get(protect, docCtrl.getDoc)
    .patch(protect, docCtrl.updateDoc)
    .delete(protect, docCtrl.deleteDoc)

module.exports = router