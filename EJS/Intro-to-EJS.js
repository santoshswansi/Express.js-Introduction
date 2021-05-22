
// EJS - Embedded JavaScript templates
// ADDING DYNAMIC CONTENT TO HTML

const express = require('express');
const app = express();

const path = require('path');


// setting the "view engine" as 'ejs'
// BY DEFAULT: When we request templates(views) it is going to look in views
//             folder 
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    res.render('home');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/user/:name', (req, res) => {

    // We can we data from the database of the user 
    let data = {name: req.params.name, age: 20, hobbies: ['Coding', 'Watching Youtube', 'Travelling']};

    // It is going to look for 'profile.ejs' template file in 
    // views folder
    // Passing data to view(template): Use second parameter
    res.render('profile', {data: data});
})

app.listen(3000, () => console.log('Listening on port 3000'));