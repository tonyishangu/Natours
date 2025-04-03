const express = require('express');

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUsers);
router
  .route('/:id')
  .get(userController.getUsersById)
  .patch(userController.editUsers)
  .delete(userController.deleteUsers);

module.exports = router;

