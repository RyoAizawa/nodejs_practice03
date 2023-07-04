const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
// const detail = require("./detail.json");

const port = 3000;

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "rehabilitation_db",
});

// cssファイルの取得
app.use(express.static("assets"));

// mysqlからデータを持ってくる
app.get("/", (req, res) => {
    const sql = "select * from clients";

    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render("index", {
            users: result,
        });
    });
});

app.post("/", (req, res) => {
    const sql = "INSERT INTO clients SET ?";
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect("/");
    });
});

app.get("/create", (req, res) => {
    res.sendFile(path.join(__dirname, "html/form.html"));
});

// 課題③
// app.get("/detail/:id", (req, res) => {
//     const sql = "SELECT * FROM clients WHERE id = ?";
//     con.query(sql, [req.params.id], function (err, result, fields) {
//         if (err) throw err;
//         const selectedUser = [];
//         for (let index in detail) {
//             if (String(detail[index].id) === req.params.id) selectedUser.push(detail[index]);
//         }
//         console.log(result)
//         res.render("detail",  {selectedUser: selectedUser});
//     });
// });

// 課題④
app.get("/detail/:id", (req, res) => {
    const sql = "SELECT * FROM clients_detail WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
        if (err) throw err;
        const selectedUser = [];
        console.log(result);
        res.render("detail", { selectedUser: result });
    });
});

app.get("/edit/:id", (req, res) => {
    const sql = "SELECT * FROM clients WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
        if (err) throw err;
        res.render("edit", {
            user: result,
        });
    });
});

app.post("/update/:id", (req, res) => {
    console.log(req.params.id);
    const sql = "UPDATE clients SET ? WHERE id = " + req.params.id;
    con.query(sql, req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect("/");
    });
});

app.get("/delete/:id", (req, res) => {
    const sql = "DELETE FROM clients WHERE id = ?";
    con.query(sql, [req.params.id], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect("/");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
