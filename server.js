const express = require('express');


/*
    -> This app starts a server & listen on process.env.PORT or 3000 for 
       connections
    -> The app responds with 'Hello World!' on root URL or route
    -> It also responds to /contact route
    -> Every other path will respond with "404 Not Found"

*/

const app = express();

const port = process.env.PORT || 3000;

// Home route
app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
})

// Contact route
app.get('/contact', (req, res) => {
    res.send('<ul>Contact me</ul> <li>santoshswansi@gmil.com</li> <li>99XXX23X3</li> ')
})


app.listen(port, () => console.log(`Listening on port ${port}`));




// COMPONENTS OF URL
// ----------------------------------------------------------------------------
/*
    -> A URL(Uniform Resource Locator) is an specific type of URI(Universal
       Resource Identifier)
    -> A URL normally locates an existing resource on the internet   
    -> A URL is used when a web client makes a request to the server for a
       resource    


    URI
    ----
    -> A URI is defined as any character string that identifies a resource
    -> A URL is defines as those URIs that identify a resource by its
       location or by the means used to access it, rather than by a name
       or other attribute of the resource


    >>  A URL for HTTP (or HTTPS) is normally made up of three or four
        components
    -------------------------------------------------------------------------
     1) A SCHEME
     ------------
      -> The scheme identifies the protocol to be used to access the resource
         on the Internet
      -> It can be
               i)  HTTP ( Without SSL)   
               ii) HTTPS (With SLL)
               
      2) A HOST
     ----------------    
       -> The host name identifies the host that holds the resource
       -> Example: www.example.com
       -> A server provides services in the name of host, but hosts & servers
          does not have one-to-one mapping
       -> Host names can also be followed by port number
       -> Well-known port numbers for a service are normally omitted from the
          URL
       -> Most servers use the well-known port numbers for HTTP and HTTPS, 
          so most HTTP URLs omit the port number   
          
      
      3) A PATH
     -------------
       -> The path identifies the specific resource in the host that the
          web client wants to access
       -> Example: /software/htp/cics/index.html
       
      
      4) A QUERY STRING
     -------------------------
       -> If a query string contains, it follows the path component
       -> It contains key & value  pairs like key=value
       -> Name & value pairs are separated by & like key1=value1&key2=value2
       
       
    NOTES
    ----------------
     -> Scheme & Hostname (Case Insensitive)
     -> Path & Query String (Case Sensitive)
     -> Typically whole URL is specified in lowercase    


    >> The components of the URL are combined & delimited as :-
    ---------------------------------------------------------------------
       i) scheme://   (scheme is followed by colon & two forward slashes)
       ii) host:port  (If port number is specified, it follows host name 
                       followed by :)
       iii) /path     (The path begins with a single forward slash)
       iv) ?query     (If a query string is specified, it is preceded by a
                       question mark)    
                       
                       

      >> EXAMPLES
     -------------------
      1) HTTP URL
        http://www.example.com/software/index.html
       
      2) HTTP URL with port number specified
        http://www.example.com:1030/software/index.html    


     NOTES
    -------
     -> A URL can be followed by a fragment identifier
     -> The separator between URL & fragment identifier is  # character
     -> A fragment identifier is used to point  to a reference or function
        in item that web browser has just retrieved
     -> For example
        - If the URL identifies an HTML page, a fragment identifier can be 
          used to indicate a subsection within the page, using the ID of the 
          subsection
        - In this case, the web browser typically displays the page to the
          user so that the subsection is visible
                  
*/



// ROUTING
// ------------------------------------------------------------------------------
/*
   -> Routing refers to determining how an application responds to a client
      request to a particular endpoint, which is a URI(or path) & a specific
      HTTP request methods (GET, POST, PUT, DELETE)

   -> Each route can have multiple handler functions, which are executed 
      when the route matches
      
   -> ROUTE DEFINITION SYNTAX
      ------------------------------
        app.METHOD(PATH, HANDLER)
        
                 -> 'app' is an instance of Express
                 -> 'METHOD' is any HTTP request method (In lowercase)
                 -> 'PATH' is a path on the server
                 -> 'HANDLER' a function which gets executed when the 
                     route is matched
            

*/


// ROUTE METHODS
// ---------------------------------------------------------------------------

const express = require('express');
const app = express();
const uuid = require('uuid');


const students = [{
      id: 1,
      name: "Santosh Swansi",
      email: "santoshswansi091@gmail.com"
   },
   {
      id: 2,
      name: "Subhash Swansi",
      email: "subhashswansi091@gmail.com"
   },
   {
      id: 3,
      name: "Sangeeta Kumari Swansi",
      email: "sangeeta.kumari.swansi091@gmail.com"
   }
];



// Get all students
app.get('/api/students', (req, res) => {
   res.send(students);
});


// Get single member
app.get('/api/students/:id', (req, res) => {
   var found = students.some(std => std.id === parseInt(req.params.id));


   if (found) {
      var student = students.filter(std => std.id === parseInt(req.params.id));
      res.json(student);
   } else {
      res.status(400).json({
         msg: `Student with id ${parseInt(req.params.id)} not available!`
      });
   }
});



// Body Parser Middleware to parse body of put, post HTTP requests
// ------------------------------------------------------------------------------

// Recognize the incoming request as JSON Object
app.use(express.json());

// Recognize the incoming request as JSON Object
// The extended options is used to specify whether express should parse 
// URL-encoded data with qs (extended: true) or querystring (extended: false). 
app.use(express.urlencoded({
   extended: false
}));



// Post a new student
app.post('/api/students', (req, res) => {

   const newStudent = {
      id: uuid.v4(),

      // request contains all the essential information of the new student
      name: req.body.name,
      email: req.body.email
   };

   if (!req.body.name || !req.body.email) {
      return res.status(400).json({
         msg: "Please enter name & email"
      });
   }

   students.push(newStudent);
   res.send(students);
});


// Update name & email of a user with given id
app.put("/api/students/:id", (req, res) => {
   var found = students.some(std => std.id === parseInt(req.params.id));

   if (found) {
      const updatedStudent = req.body;

      students.forEach(std => {
         if (std.id === parseInt(req.params.id)) {
            std.name = updatedStudent.name ? updatedStudent.name : std.name,
               std.email = updatedStudent.email ? updatedStudent.email : std.email;

            res.json({
               msg: 'Member updated!',
               std
            });
         }
      });
   } else {

      res.status(400).json({
         msg: `Student with id ${parseInt(req.params.id)} not available!`
      });

   }
});




// Delete particular student
app.delete('/api/students/:id', (req, res) => {

   var found = students.some(std => std.id === parseInt(req.params.id));

   if (found) {
      var student = students.filter(std => std.id === parseInt(req.params.id));

      // delete one student from given index 
      students.splice(students.indexOf(student), 1);
      res.send(students);
   } else {
      res.status(400).json({
         msg: `Student with id ${req.params.id} not found!`
      });
   }
})



app.listen(3000, () => console.log('Listening on port: 3000'));




// app.all() 
/*
   -> It is used to load middleware functions at a path of all HTTP request 
      methods(GET, POST, PUT, PATCH, DELETE, etc.)
   -> Following example will respond to all HTTP methods having '/secret'
      as route
*/
app.all('/secret', (req, res, next) => {
   console.log('Accessing the secret section...');
   next();
});




// ROUTE PATHS
// -----------------------------------------------------------------------------
/*
   -> Route paths along with a request method, define the endpoints at which
      requests can be made
   -> Route paths can be strings, string patterns, or regular expressions
   -> The hyphen(-) and the dot(.) are interpreted literally [ By 
      string-based paths ]
   -> If we need $ in a path string, we should put in []   
   -> Query strings are not part of route path
*/

// Examples

// root route
app.get('/', (req, res) => {
   res.send('Home Route');
});




// '/ab?cd' { /acd, /abcd} routes
app.get('/ab?cd', (req, res) => {
   res.send('ab?cd');
});    


// '/ab+cd' { /abcd, /abbcd, /abbbcd, ...} routes
app.get('/ab+cd', (req, res) => {
   res.send('ab+cd');
});


// '/ab+cd' { /abcd, /abagdhd, /absusnkd, ...} routes
app.get('/ab*cd', (req, res) => {
   res.send('ab*cd');
});


// '/ab+cd' { /abcd, /abagdhd, /absusnkd, ...} routes
app.get('/ab(cd)?e', (req, res) => {
   res.send('ab(cd)?e');
});



// Path Route based on regular expression
// ---------------------------------------------------------------------------
// path /.*santo$/ {kersanto, mrfsanto} but not {gksantoawesome, santomnc}
app.get(/.*santo$/, (req, res) => {
   res.send('/.*santo$/');
});





// ROUTE PARAMETERS
// -------------------------------------------------------------------------------
/*
   -> They are named URL segments that are used to capture the values
      specified at their position in the URL 
   -> The captured values are in 'req.params' object & we can access 
      values passed by the client by adding '.routeParameterName' 

   -> Naming Convention:
         - Word characters = [A-Za-z0-9_]  

    [
         Route path = /users/: userId / books /: bookId
         Request URL = http: //localhost:3000/users/34/books/8989
         req.params = {
               "userId": "34",
               "bookId": "8989"
         }
                                                                   ]
*/

//  '/files/:name' route
app.get('/files/:name', (req, res) => {

   var options = {
      root: path.join(__dirname, 'test')
   };
   var fileName = req.params.name;

   res.sendFile(fileName, options, err => {
      if (err)
         console.error(err.message);
      else
         console.log('File ', fileName, 'sent');
   });
});


/*
   [ Since the hyphen(-) & the dot(.) are interpreted literally ]

   [
      Route Path = /flights/:from-:to
      Request URL = http://localhost:3000/flights/BLR-DL
      req.params = {
         "from": "BLR",
         "to": "DL" 
      }
                                                                     ]


   [
      Route Path = /plantae/:genus.:species
      Request URL= http://localhost:3000/plantae/Prunus.persica
         req.params: {
            "genus": "Prunus",
            "species": "persica"
         }
                                                                     ]   
                                                                     
                                                                     
   -> To have more control over the exact string that can be matched
      by a route parameter, we can append regular expression in 
      parenthesis ()     
      
      [
         Route Path = /user/:userId(\d+)
         Request URL = http://localhost:3000/user/42
         req.params = { "userId": "42" }
                                                                     ]


   NOTE: Because regex is part of literal string, append \ to meta
         characters containing \   
         i.e. \\d+                                                                  
*/





// ROUTE HANDLERS
// -------------------------------------------------------------------------------
// we can have multiple route handlers that act like middleware

app.get('/', (req, res, next) => {
   console.log('Middeleware-1');
   next();
}, (req, res) => {
   req.send('Hello');
});



// Array of middlewares
const mid1 = (req, res, next) => {
   console.log('Middleware-1');
   next();
};

const mid2 = (req, res, next) => {
   console.log('Middleware-2');
   next();
};

const mid3 = (req, res) => {
   req.send('Hello')
};

app.get('/', [mid1, mid2, mid3]);




// RESPONSE METHODS
// ---------------------------------------------------------------------------

/*
   -> The methods of the response object can send the response to the client,
      & terminate the request-response cycle 

      Method                                     Description
   --------------------------------------------------------------------------
   i)    res.download()                     Prompt a file to be downloaded
   ii)   res.end()                          End the response process
   iii)  res.json()                         Send a JSON response
   iv)   res.jsonp()                        Send a JSON response with 
                                              JSONP support
   v)    res.redirect()                     Redirect a request
   vi)   res.render()                       Render a view template
   vii)  res.send()                         Send a response of various types
   viii) res.sendFile()                     Send a file as an octet stream
   ix)   res.sendStatus()                   Set the response status code and
                                             send its string representation 
                                             as the response body

*/



// app.route()
// --------------------------------------------------------------------------
// Using it, we can create chainable route handlers for a route

const studentRoute = app.route('/student');
studentRoute.get((req, res) => {
               res.send('Get a random student');
            })
            .post((req, res) => {
               res.send('Added a book');
            })
            .put((req, res) => {
               res.send('Updated a book');
            })



// express.Router
// ---------------------------------------------------------------------------
/*
   -> Use the express.Router class to create modular, mountable route 
      handlers
   -> A Router instance is a complete middleware and routing system;
      for this reason, it is often referred to as a“ mini - app”.
*/

// In one file  'students.js'
// ------------------------------------------
var router = express.Router();

// middleware that is specific to this router
router.use('/', function timeLogger(req, res, next) {
      console.log(Date.now());
      next();
});

// Define the home page route
router.get('/', (req, res) => {
   res.send('Students Home Page');
})


// Define the /about page route
router.get('/about', (req, res) => {
   res.send('About Students');
})


module.exports = router;


// In other file  
// ------------------------------------------------
var students = require('./students');

// ...
app.use('/students', students);

// The app will now be able to handle requests to /students and 
//  /students/about, as well as call the timeLog middleware function 
// that is specific to the route



// SERVING STATIC FILES IN EXPRESS
// ----------------------------------------------------------------------------
/*
   -> To serve static files such as images, CSS files, JavaScript files, 
      use:
         [ express.static]   built-in middleware function in Express
   -> SYNTAX 
      express.static(root, [options]) 
            - 'root' argument specifies the root directory from which
               to serve static assets  
                
*/


// Code to serve static files in test folder
app.use(express.static('test'));


// For Home route
app.get('/', (req, res) => {
    let responseMessage = '<h1>Home Page</h1><br>';
    responseMessage += '<ul>Try these:-</ul> <li>/index.css</li> <li>/photo1.jpg, etc. </li>'
    res.send(responseMessage);
})


// Now we can load the files in 'test' directory by using :-
/*
       http: //localhost:3000/photo1.jpg
       http: //localhost:3000/styles.css
       http: //localhost:3000/index.js
*/


// To access files of multiple directories, call express.static multiple times
app.use(express.static('test'))
app.use(express.static('test2'))



// TO CREATE A VIRTUAL PATH PREFIX
// -------------------------------------------------------------------------
// Using it we can load files in test directory from the '/static' path prefix

app.use('/static', express.static('test'));


// It is safer to use absolute path using '__dirname'
app.use('/static', express.static(path.join(__dirname, 'public')))


// SIMPLE APPLICATION
// --------------------------------------------------------------------------
//  We can place various html and css files for various web pages of a
//  website inside a folder & we can make the folder static, this allows to 
//  handle multiple web pages using a single route definition

const path = require('path');
const fs = require('fs');


app.get('/', (req, res) => {
    var htmlFile = fs.readFile(path.join(__dirname, 'test', 'index.html'), 'utf8');
    res.send(htmlFile);
});


app.listen(3000, () => console.log("Listening on port 3000"));

// Now we can access different web pages by adding  /about.html, 
//  /contact.html, etc.




// MIDDLEWARE FUNCTIONS
// -----------------------------------------------------------------------------
/*
    Q. WHAT ARE MIDDLEWARE FUNCTIONS?
    ---------------------------------------
     -> They have access to request object(req), response object(res) & the
        'next' function in the application's request-response cycle
     -> The 'next' function is the function in the Express router, which
        when invoked executes the succeeding middleware
        
    Q. WHAT TASKS THEY CAN PERFORM?
    ------------------------------------------------------    
      i)   Execute any code
      ii)  Modify request & response objects
      iii) End the request-response cycle
      iv)  Call the next middleware in the stack


    NOTE: If the current middleware does not end the request-response cycle
          it must call 'next()' function to pass control to the next 
          middleware function in the stack
          Otherwise, the request will be left hanging    
*/


// ELEMENTS OF MIDDLEWARE FUNCTION CALL
/*
           ____________HTTP method for which the middleware function applies
          |     ________________ Path(route) for which middleware applies
          |    |              ___________________ HTTP response argument
          |    |             |     __________________HTTP request argument
          |    |             |    |   
          |    |             |    |      ______________callback argument to 
    ______|  __|          ___| ___| ____|              next middleware      
    app.get('/', function(req, res, next) => {
                 ________
                        |________________________ MIDDLEWARE FUNCTION
        next()
    })

    app.listen(3000);

*/



// MIDDLEWARE FUNCTION myLogger
// ----------------------------------------------------------------------------
/*
   -> To load the middleware function, call app.use(), specifying the 
      middleware function
   -> FOR EXAMPLE: The following code loads the myLogger middleware function
                   before the route to the root path (/)

   -> ORDER OF MIDDLEWARE : The Middleware functions which are loaded first
                            will be executed first
   -> Here first 'myLogger' middleware gets executed because it gets loaded
      first
      
   -> If we have placed 'myLogger' after the route to root path, it will 
      never gets executed because, route handler of the root path 
      terminates the request-response cycle     
*/

const myLogger = (req, res, next) => {
    console.log('Logged');
    next()
};

app.use(myLogger);


app.get('/', (req, res) => {
    res.send('Home Page');
})

app.listen(3000, () => console.log('Listening on port 3000!'));




// MIDDLEWARE FUNCTION 'requestTime'
// --------------------------------------------------------------------------
const requestTime = (req, res, next) => {

    // Adding property 'requestTime' to request object
    req.requestTime = Date.now();
    next();
};

app.use(requestTime)


app.get('/', (req, res) => {
    let responseText = '<h1>Hello World! </h1><br>';
    responseText += `Request Time ${req.requestTime}`;

    res.send(responseText);
});

app.listen(3000, () => console.log('Listening on port 3000!'));




// USING MIDDLEWARE
// ----------------------------------------------------------------------------------

/*
    -> An Express application can have following types of middleware:-
        i)   Application-level middleware
        ii)  Router-level middleware
        iii) Error-handling middleware
        iv)  Built-in middleware
        v)   Third-party middleware 
*/

 








