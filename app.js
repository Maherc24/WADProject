var express = require("express"); 

var app = express(); 

app.set('view engine', 'ejs'); 

app.use(express.static("views")); 
app.use(express.static("style")); 
app.use(express.static("images")); 

var mysql = require('mysql');


var fs = require('fs')
var bodyParser = require("body-parser") 
app.use(bodyParser.urlencoded({extended:true}));


const fileUpload = require('express-fileupload');
app.use(fileUpload());


// ******************************** Start of SQL **************************************** //
//Reference of code: Following SQL taken from Web Application Development lecture notes, Liam McCabe 2019, attempt to connect to own DB 


const db = mysql.createConnection({
host: 'den1.mysql1.gear.host',
    user: 'canicedb',
    password: 'PKa3U_!G4xM3b',
    database: 'canicedb'
 });

db.connect((err) =>{
     if(err){
        console.log("go back and check the connection details. Something is wrong.")
        // throw(err)
    } 
     else{
        
        console.log('Looking good the database connected')
    }
    
    
})



// Url to get the products

app.get('/plans', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM canicedb';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('plans', {result})
        
    });
    
    
})

// URL to get the add product page
app.get('/addproduct', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  
        res.render('addproduct')
        
  
    
})


// post request to write info to the database


app.post('/addproduct', function(req,res){
    
 let sampleFile = req.files.sampleFile;
   filename = sampleFile.name;
    
    sampleFile.mv('./addedplans/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Image you are uploading is " + filename)
       res.redirect('/thankyou.html');
    })
    
    
    
    
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'INSERT INTO canicedb (Name, Price, Image, Activity) VALUES ("   '+req.body.name+'   ", '+req.body.price+', "'+filename+'", "'+req.body.activity+'") ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/plans')
    //res.send("You created your first Product")
    
})


// URL to get the edit product page 

app.get('/editproduct/:id', function(req,res){
    
        let sql = 'SELECT * FROM canicedb WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('editproduct', {result})
        
    });
    
    
    
    
})


// URL to edit product


app.post('/editproduct/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'UPDATE canicedb SET Name = "   '+req.body.name+'   ", Price = '+req.body.price+', Image = "'+req.body.image+'", Activity = "'+req.body.activity+'" WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/plans')
    //res.send("You created your first Product")
    
})


// Url to see individual product
app.get('/plans/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
    let sql = 'SELECT * FROM canicedb WHERE Id = "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(res);
        res.render('plans', {result})
    });
    

    
})



// URL TO delete a product

app.get('/delete/:id', function(req,res){
    
        let sql = 'DELETE FROM canicedb WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
  
    });
    
    res.redirect('/plans')
    
    
})






// ******************************** End of SQL **************************************** //




// plan upload 
//folder created to hold uploaded plans 
app.get('/upload', function(req,res){
    
    res.render('upload');
    
})
//route for games 
app.get('/games', function(req,res){
    
    res.render('games');
    
})

//route for curriculum page
app.get('/Curriculum', function(req,res){
    
    res.render('Curriculum');
    
})
// inserts the plan file to my shorttermplans folder, redirects to thank you page after upload 
app.post('/upload', function(req,res){
    
    let sampleFile = req.files.sampleFile;
   filename = sampleFile.name;
    
    sampleFile.mv('./shorttermplans/' + filename, function(err){
        
        if(err)
        
        return res.status(500).send(err);
        console.log("Plan you are uploading is " + filename)
        res.redirect('/thankyou.html');
    })
    
    
    
    
    
})



// Search

app.post('/search', function(req,res){
    
        let sql = 'SELECT * FROM canicedb WHERE Name LIKE  "%'+req.body.search+'%" ';
            let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        console.log(req.body.search);
        res.render('plans', {result})
        
    });
    
    
    
    
})








// JSON Data
//JSON Code Reference: Web Application Development Lectures, Liam McCabe NCI 2019, code has been adapted fot this application
var contact = require("./model/contact.json");

app.get('/', function(req, res) {
res.render("index"); 
console.log("Home page loaded"); 
});


app.get('/contacts', function(req,res){
    res.render("contacts", {contact}); // Get the contacts page 
    console.log("Contacts page working");
    
});


// Get the contact us [page]

app.get('/add', function(req,res){
    res.render("add");
    console.log("I found the contact us page");
    
});


// post request to send JSON data to server

app.post("/add", function(req,res){

    // Stp 1 is to find the largest id in the JSON file
    
            function getMax(contacts, id){ // function is called getMax
            var max // the max variable is declared here but still unknown
    
                for(var i=0; i<contacts.length; i++){ // loop through the contacts in the json fil as long as there are contcats to read
                    if(!max || parseInt(contact[i][id])> parseInt(max[id]))
                    max = contacts[i];
                        }
    
            return max;
             }

             
             // make a new ID for the next item in the JSON file
             
              maxCid = getMax(contact, "id") // calls the gstMax function from above and passes in parameters 
             
             var newId = maxCid.id + 1; // add 1 to old largest to make ne largest
             
             // show the result in the console
             console.log("new Id is " + newId)

             // we need to get access to what the user types in the form
             // and pass it to our JSON file as the new data
             
             var contactsx = {
                 
                 
                 id: newId,
                 name: req.body.name,
                 Comment: req.body.Comment,
                 email: req.body.email
                 
                 
             }
             
             
    fs.readFile('./model/contact.json', 'utf8',  function readfileCallback(err){
        
        if(err) {
            throw(err)
            
        } else {
            
            contact.push(contactsx); // add the new data to the JSON file
            json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
            fs.writeFile('./model/contact.json',json, 'utf8')
            
        }
        
    })         
             
     res.redirect('/contacts') ;
    
});


// Now we code for the edit JSON data 

// *** get page to edit 
app.get('/editcontact/:id', function(req,res){
    // Now we build the actual information based on the changes made by the user 
   function chooseContact(indOne){
       return indOne.id === parseInt(req.params.id)
       }


  var indOne = contact.filter(chooseContact)
    
   res.render('editcontact', {res:indOne}); 
    
});

// ** Perform the edit
app.post('/editcontact/:id', function(req,res){
    
    // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(contact)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    
    // the next three lines get the content from the body where the user fills in the form
    
    var z = parseInt(req.params.id);
    var x = req.body.name
    var y = req.body.Comment

   // The next section pushes the new data into the json file in place of the data to be updated  

    contact.splice(index, 1, {name: x, Comment: y, email: req.body.email, id: z })
    
  
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/contact.json',json, 'utf8', function(){})
    
    res.redirect("/contacts");
    
    
})

app.get('/deletecontact/:id', function(req,res){
    
    
    // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(contact)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    

    contact.splice(index, 1)
    
  
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/contact.json',json, 'utf8', function(){})
    
    res.redirect("/contacts");
    
    
})





// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Plans for schools is running");
  
});