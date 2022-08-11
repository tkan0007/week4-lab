const { request } = require('express');
let express = require('express');
let app = express();

//Setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//Setup the static assets directories
app.use(express.static('images'));
app.use(express.static('css'));
//parse application json
app.use(express.urlencoded({extended: true}));
app.use(express.json())

// db
let db = [];
let rec = {};
rec = {
    title:"Monash",
    author:"Jonh Monash",
    topic:"University",
    cost:100,
};
db.push(rec);

rec = {
    title:"Monash",
    author:"lee",
    topic:"University",
    cost:100,
};
db.push(rec);

rec = {
    title:"Monash",
    author:"Jp lee",
    topic:"University",
    cost:100,
};
db.push(rec);

rec = {
    title:"Monash",
    author:"Jonhlee",
    topic:"University",
    cost:100,
};
db.push(rec);

//get params from URL then

//page

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/:page',function(req,res){
    let baseURL = "http://" + req.headers.host+"/";
    let url = new URL(req.url,baseURL);
    let page = req.params.page;
    let params = url.searchParams;

    if(page.match(/seachByAuthor/)){
        page = 'searchByAuthor';
    }

    switch(url.pathname){
        case '/addbooks':
            res.render('addbooks');
            break;
        case '/listbooks':
            res.render('listbooks',{bookdb:db});
            break;
        case '/searchByAuthor': // extra task
            let name = params.get("name");
            res.render('searchbook',{authorName: name,result:searchbook(name)});
            break;
        default:
            res.render('404');
            break;
    }
})

//data operation

app.post('/:func',function(req,res){
    switch(req.params.func){
        case 'data':
            if(req.body.title.length < 3 || req.body.author.length < 3 || req.body.cost < 0){
                res.render('invalid');
                break;
            }else{
                let newRec = {
                    title:req.body.title,
                    author:req.body.author,
                    topic:req.body.topic,
                    cost:req.body.cost,
                };
                db.push(newRec);
                res.render('addbooks');
                break;
            }
        default:
            res.render("404"); // forget to write this code in submitted file.
    }
})

function searchbook(authorName){
    let searchdb = [];
    for(let i = 0; i < db.length;i++){
        if(db[i].author == (authorName)　|| db[i].author.includes(authorName)){
            /* what I need to care are
            user input: just last name:
            1. firstname + space + "lastname"
            2. lastname  <--OK

            should not show like:
            1.firstname+lastname
            2.wrong name
            */
            searchdb.push(db[i]);
        }
    }
    return searchdb;
}


app.listen(8080);