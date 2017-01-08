var express = require('express');
var jwt = require('jsonwebtoken');

var router = express.Router();

// Add user
router.post('/signup', function(req, res) {

	// Required fields
	if(!req.body.username)
		return res.json({ "status": 204, "message": "Please enter username" });
	if(!req.body.password)
		return res.json({ "status": 204, "message": "Please enter password" });
	if(!req.body.email && !req.body.mobile)
		return res.json({ "status": 204, "message": "Please enter email or mobile" });

	var cursor = db.collection("users");
	// Set default balance of a user to 0
	var user = {
		"username": req.body.username,
		"password": req.body.password,
		"email": req.body.email,
		"mobile": req.body.mobile,
		"balance": 0,
		"userType": 1
	};

	cursor.insert(user, function(err, result) {
		if(result.insertedCount == 1) {
			return res.json({
				"status": 200,
				"message": "User added"
			});
		} else {
			return res.json({
				"status": 204,
				"message": "Some problem occured, user not added"
			});
		}
	});
});

// Login - Authentication and Token creation
router.post('/authenticate', function(req, res) {

	// Allow all domains to all requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    if(!req.body.username)
    	return res.json({ "status": 204, "message": "Username not found" });
    if(!req.body.password)
    	return res.json({ "status": 204, "message": "Password not found" });
    
	db.collection("users").findOne({ username: req.body.username }, function(err, result) {
		if(err) throw err;

		if(result) {

			if(result.password == req.body.password) {
				var token = jwt.sign(result, "YOPOsecretishere", {
					expiresIn: 1440
				});
				return res.json({
					"status": 200,
					"message": {
						"token": token,
						"user": result
					}
				});

			} else {
				return res.json({
					"status": 400,
					"message": "Invalid password!"
				});
			}

		} else {
			return res.json({
				"status": 400,
				"message": "User not found!"
			});
		}
	});
});

module.exports = router;