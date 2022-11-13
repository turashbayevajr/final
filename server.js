var express = require('express');
var env = require('dotenv').config()
var ejs = require('ejs');
var path = require('path');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb+srv://randomhero:azharnurda@cluster0.cw0qz.mongodb.net/notesDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});

const tasksSchema ={
    number: String,
    title: String,
    completed: String
}
const Task = mongoose.model('Task',tasksSchema);


router.get('/', function (req, res, next) {
return res.render('index.ejs');
});
router.get('/16days', function (req, res, next) {
return res.render('16days.ejs');
});
router.get('/new', ((req, res) => {
  res.sendFile(__dirname+ 'new.html');
}))
app.get('/16days', (req, res) => {

  Task.find({},function (err, tasks) {
      res.render('16days.ejs', {
          tasksList: tasks
      })
  })
})

app.post('/new', function (req,res){
  let newTask = new Task({
      number: req.body.number,
      title: req.body.title,
      completed: req.body.completed
  })
  newTask.save();
  res.redirect('/16days');
})


app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));





var index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 6969;
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+PORT);
});
