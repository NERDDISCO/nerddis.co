var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('mediarecorder', { title: 'NERD DISCO' });
});

module.exports = router;
