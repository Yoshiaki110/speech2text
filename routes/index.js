var speech2text = require('./page/speech2text');
var voiceRecognitionSystem = require('./api/voiceRecognitionSystem');
var health = require('./health.js')

module.exports = function (app) {
  app.get('/', function(req, res) {
    res.redirect('/speech2text');
  });
  app.use('/speech2text', speech2text);  
  app.use('/api/voice-recognition',voiceRecognitionSystem);
}

