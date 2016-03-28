var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'NERD DISCO' });
});

router.get('/mediarecorder', function(req, res, next) {
  res.render('mediarecorder', { title: 'NERD DISCO' });
});

router.get('/microphone-recorder', function(req, res, next) {
  res.render('microphone-recorder', { title: 'NERD DISCO' });
});

router.get('/live', function(req, res, next) {
  res.render('live', { title: 'NERD DISCO - LIVE' });
});



module.exports = router;