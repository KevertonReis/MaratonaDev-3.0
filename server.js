/* config servidor */
const express = require("express")
const server = express()

// habilitar body do formulario
server.use(express.urlencoded({extended: true}))

/*config a apresentação da pagina */
server.get("/", function(req, res){
    
    db.query("select * from donors", function (err, result){
        if (err) return res.send("erro de banco de dados")

        const donors = result.rows

        return res.render("index.html", {donors})
    })
    
})

server.post("/", function(req, res) {

    // pegar dados do form

    const name = req.body.name
    const email = req.body.email
    const tel = req.body.tel
    const blood = req.body.blood

    if (name == "" || email == "" || tel == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios")
    }

    // coloco valores dentro do banco de dados
    const query = `
        insert into donors ("name", "email", "tel", "blood") 
        values($1, $2, $3, $4)`
    
    const values = [name, email, tel, blood]

    db.query(query, values, function(err) {
        //fluxo de erro
        if (err) return res.send("erro no banco de dados")
        
        // fluxo ideal
        return res.redirect("/")
    })

   

})

// configurar servidor para apresentar arq extras/estaticos
server.use(express.static('public'))

//configurar a conexao com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: 'Overchild@g6',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})


// configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", { // ponto e barra indica raiz do objeto
    express: server,
    noCache: true,
}) 


/* ligar o servidor e permitir acesso a porta 3000*/
server.listen(3000, function(){
    console.log("iniciei o servidor")
})