const express = require("express");
const router = express.Router();
const UserController = require('../controllers/userController')
const controller = new UserController();
const checkAuth = require('../middleware/check-auth')

// Return all users
router.get("/", async (req, res, next) => controller.getAllUsers(req, res, next));
router.post("/signup", async (req, res, next) => controller.signUp(req, res, next));
router.get("/login", async (req, res, next) => controller.login(req, res, next));

/* Example body to send to update client name:
{
    "userId": <replace with id>,
    "operations": [
        {
            "propName": "name",
            "value": "Updated name"
        }
    ]
}
*/
router.patch("/updateUser", checkAuth, async (req, res, next) => controller.updateUser(req, res, next));
router.patch("/disableUser", checkAuth, async (req, res, next) => controller.disableUser(req, res, next));
router.delete("/deleteUser", async (req, res, next) => controller.deleteUser(req, res, next));

module.exports = router;
