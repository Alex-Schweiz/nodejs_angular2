var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://localhost/testtodo');

//Get todos
router.get('/todos',function(req,res,next){
    db.todos.find(function (err, todos) {
        if(err){
            res.send(err);
        } else {
            res.json(todos);
        }
    });
});

//Get single todo
router.get('/todo/:id',function(req,res,next){
    db.todos.findOne({
        _id: mongojs.ObjectID(req.params.id)
    },function (err, todo) {
        if(err){
            res.send(err);
        } else {
            res.json(todo);
        }
    });
});

//Save Todos
router.post('/todo', function (req, res, next) {
    var todo = req.body;
    if(!todo.text || !(todo.isCompleted + '')){
        res.status(400);
        res.json({
            "error": "Invalid data"
        });
    } else {
        db.todos.save(todo, function (err, result) {
            if(err){
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }
});

//Update todos
router.put('/todo/:id', function (req, res, next) {
    var todo = req.body;
    var updObj = {};

    if(todo.isCompleted){
        updObj.isCompleted = todo.isCompleted;
    }

    if(todo.text){
        updObj.text = todo.text;
    }

    if(!updObj){
        res.status(400);
        res.json({
            "error": "Invalid data"
        });
    } else {
        db.todos.update({
            _id: mongojs.ObjectID(req.params.id)
        }, updObj,{}, function (err, result) {
            if(err){
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }
});

//Delete todos
router.delete('/todo/:id', function (req, res, next) {
    db.todos.remove({
        _id: mongojs.ObjectID(req.params.id)
    },'', function (err, result) {
        if(err){
            res.send(err);
        } else {
            res.json(result);
        }
    });
});

module.exports = router;