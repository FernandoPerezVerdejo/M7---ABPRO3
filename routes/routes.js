import * as fs from "fs";
import { Router } from "express";
import { pool } from "../server.js";
import body from 'body-parser';
import { stringify } from "querystring";

const router = Router();

// ----------------------------------------- GET -----------------------------
router.get('/', async (req, res) => {
    let result = await pool.query('select email FROM usuarios');
    let resultado= [];
    //console.log(result.rows);
    result.rows.forEach(element => {
        resultado= resultado + element.email+'\n';
    });

    res.render("index",{usuarios:resultado})
})

router.get('/register', (req, res) => {
    res.render("register")
})

router.get('/login', (req, res) => {
    res.render("login")
})


// ------------------------------------ POST ---------------------------------

router.post('/register', async (req, res) => {
    //console.log(req.body.email);
    let result = await pool.query(`select count(*) from usuarios where $1=email`, [`${req.body.email}`]);
    //console.log(result.rows[0].count);
    if (result.rows[0].count < 1) {
        pool.query('Insert into usuarios (email,password) VALUES ($1,$2) RETURNING email', [`${req.body.email}`, `${req.body.password}`])
    } else { console.log('usuario ya registrado'); }
    res.redirect("register");
})

router.post('/login', async (req, res) => {
    //console.log(req.body.email);
    //console.log(req.body.password);
    let result = await pool.query(`select count(*) from usuarios where $1=email and $2=password`, [`${req.body.email}`,`${req.body.password}`]);
    //console.log(result.rows[0].count);
    if (result.rows[0].count > 0) {
        console.log('usuario encontrado');
    } else { console.log('usuario no encontrado'); }
    res.redirect("login");
})


export default router;