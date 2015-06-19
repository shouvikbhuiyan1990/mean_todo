var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var mongojs = require('mongojs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.listen(3000);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


var db = mongojs('test',['shouvik']);

app.use('/', routes);
app.use('/users', users);

app.get('/records/todo',function( rq,res ){
    db.shouvik.find(function(err, docs) {
        res.send(docs);
        // docs is an array of all the documents in mycollection 
    });
});


app.get('/todo/delete',function(req,res){
  db.shouvik.remove({done:true},function(err,doc){
    res.send(doc);
  })
});

app.get('/todo/active',function(req,res){
  db.shouvik.find({done:false} , (function(err, doc){   
          res.send(doc);
  }) );
})

app.post('/records/getone',function(req,res){
  
  //res.send(req.body.id);

  db.shouvik.findOne(
  {
    _id : mongojs.ObjectId(req.body.id)
  },function(err,doc){
    res.send(doc);
  }

    );

});

app.post('/records/modify',function(req,res){
  db.shouvik.findAndModify({
    query : { _id : mongojs.ObjectId(req.body.id) },
    update : { $set : {done:!req.body.doneCount} }
  },function(err,doc){
    res.send(doc)
  })
})


app.post('/records/update',function(req,res){
  console.log('This is fuakiing imp'  + req.body  + 'End of Fouaking imp');
  res.send(req.body);
  db.shouvik.save(req.body);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
