var express = require("express")
var app = express()
const PORT = process.env.PORT || 3000;
var path = require("path")
var hbs = require('express-handlebars');

var sortup = "checked";
var sortdown = "";
var login = false;
var loginSuccess = true;
var users = [
    { id: 1, login: "admin", password: "admin", wiek: 99, uczen: "unchecked", plec: "undefined" },
    { id: 2, login: "student", password: "zaq1@WSX", wiek: 18, uczen: "checked", plec: "m" },
    { id: 3, login: "Jan", password: "PASSWORD", wiek: 30, uczen: "unchecked", plec: "m" },
    { id: 4, login: "Anna", password: "password", wiek: 32, uczen: "unchecked", plec: "k" }
]

app.use(express.static('static'))
app.use(express.urlencoded({
    extended: true
}));

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');

app.get("/", function (req, res) {
    if (login)
        res.render('index.hbs', { layout: "mainLogOn.hbs" });
    else
        res.render('index.hbs');
})

app.get("/register", function (req, res) {
    if (login)
        res.render('register.hbs', { layout: "mainLogOn.hbs" });
    else
        res.render('register.hbs');
})

app.post("/handleRegister", function (req, res) {
    console.log(req.body)
    for (let i = 0; i < users.length; i++) {
        if (users[i].login == req.body.login) {
            setTimeout(() => { res.redirect('/register'); }, 2000);
            //
            break;
        }
    }
    let user = new Object
    user.id = users[users.length - 1].id + 1
    user.login = req.body.login
    user.password = req.body.password
    user.wiek = req.body.wiek
    if ('uczen' in req.body)
        user.uczen = "checked"
    else
        user.uczen = "unchecked"
    if ('plec' in req.body)
        user.plec = req.body.plec
    else
        user.plec = "undefined"
    console.log(user)
    users.push(user)
    console.log(users)
    setTimeout(() => { res.redirect('/login'); }, 2000);
})

app.get("/login", function (req, res) {
    if (login)
        res.render('login.hbs', { layout: "mainLogOn.hbs", loginSuccess });
    else
        res.render('login.hbs', {loginSuccess} );
    console.log("suc: "+loginSuccess)
})

app.post("/handleLogin", function (req, res) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].login == req.body.login && users[i].password == req.body.password) {
            login = true
            loginSuccess = true
            res.redirect('/')
            //res.send("Logging in...")
            break;
        }
    }
    if (!login) {
        loginSuccess = false
        res.redirect("/login")
    }

})

app.get("/logout", function (req, res) {
    //res.send("Logging out...")
    login = false
    //setTimeout(() => { res.redirect('/'); }, 2000);
    res.redirect('/')
})

app.get("/admin", function (req, res) {
    if (login)
        res.render('admin.hbs', { layout: "mainLogOn.hbs" });
    else
        res.render('adminNotLogin.hbs', { layout: null });
})

app.get("/admin/sort", function (req, res) {
    if (sortup == "checked") {
        for (let j = users.length - 1; j > 0; j--) {
            let m = 0;
            for (let i = 1; i <= j; i++)
                if (users[i].wiek > users[m].wiek)
                    m = i;
            let pom;
            pom = users[j];
            users[j] = users[m];
            users[m] = pom;
        }
    } else {
        for (let j = users.length - 1; j > 0; j--) {
            let m = 0;
            for (let i = 1; i <= j; i++)
                if (users[i].wiek < users[m].wiek)
                    m = i;
            let pom;
            pom = users[j];
            users[j] = users[m];
            users[m] = pom;
        }
    }
    console.log(users)
    res.render('admin-sort.hbs', { layout: "sort.hbs", users, sortup, sortdown });
})
app.post("/admin/sort", function (req, res) {
    console.log(req.body.sort)
    if (req.body.sort == "up") {
        sortup = "checked";
        sortdown = "";
    }
    else {
        sortup = "";
        sortdown = "checked";
    }
    res.redirect("/admin/sort")
})

app.get("/admin/gender", function (req, res) {
    let men = []
    let unmen = []
    users.forEach(element => {
        if (element.plec == "m")
            men.push(element)
        else
            unmen.push(element)
    });
    console.log(unmen)
    res.render('admin-gender.hbs', { layout: "sort.hbs", men, unmen });
})

app.get("/admin/show", function (req, res) {
    res.render('admin-show.hbs', { layout: "sort.hbs", users });
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})