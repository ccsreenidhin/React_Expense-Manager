const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const expenseRoutes = express.Router();
const PORT = 4000;

let Expense = require('./expense.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/expense', { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})


// todoRoutes.route('/:id').get(function(req, res) {
//     let id = req.params.id;
//     Todo.findById(id, function(err, todo) {
//         res.json(todo);
//     });
// });

expenseRoutes.route('/update').post(function(req, res) {
    const doc = {
        description: req.body.description,
        amount: req.body.amount,
        month: req.body.month,
        year: req.body.year
    };
     Expense.update({_id: req.body._id}, doc, function(err, result) {
         if (err)
           res.send(err);
         res.send('Expense successfully updated!');
     });
});

expenseRoutes.route('/add').post(function(req, res) {
    console.log('add', req.body)
    let expense = new Expense();
    expense.description = req.body.desc;
    expense.amount = req.body.amount;
    expense.month = req.body.month;
    expense.year = req.body.year;
    expense.save().then(expense => {
        res.status(200).send('Expense successfully added!');
    })
    .catch(err => {
        res.status(400).send('adding new expense failed');
    });
});

expenseRoutes.route('/getAll').get(function(req, res) {
    console.log('req', req.query)
    let monthRec = req.query.month;
    let yearRec = req.query.year;

    if(monthRec && monthRec != 'All') {
     Expense.find({$and: [ {month: monthRec}, {year: yearRec}]}, function(err, expenses) {
      if (err) {
        res.send(err);
      }  
      res.json(expenses);
     });
    } else {
     Expense.find({year: yearRec}, function(err, expenses) {
      if (err) {
        res.send(err);
      } 
      res.json(expenses);
     });
    }
});

expenseRoutes.get('/delete', function(req, res){
    let id = req.query.id;
    Expense.find({_id: id}).remove().exec(function(err, expense) {
     if(err) {
        res.send(err)
     }
     res.send('Expense successfully deleted!');
    })
   });


app.use('/expense', expenseRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});

