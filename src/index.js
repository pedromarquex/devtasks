// importando bibliotecas
const express = require('express');

// iniciando server com express
const server = express();

// indicando que a estrutura de dados para comunicação será JSON
server.use(express.json());

// array de projetos
const projects = [{ id: "0", title: "Projeto teste", tasks: ["fazer cafe", "acessar bulma.io"] }]

// número de requisições ao servidor
var requests = 0;


// Middleware global que fará os logs e contagem de requisições
server.use((req, res, next) => {
    requests++;
    console.log(`${req.method} at ${req.url}, total of requests: ${requests}`);

    return next();
});

// Middleware que checa se um projeto com o id informado já existe no array
// caso o projeto JÁ EXISTA, um erro é retornado
// usado no momento da criação de um novo projeto para garantir que os ids não se repitam
function checkProjectExists(req, res, next) {
    const { id } = req.body;
    const project = projects.find(project => {
        return project.id === id;
    });

    if (project) {
        return res.status(400).json({ error: `project with id ${id} alread exists` });
    }

    return next();
}

// Middleware que checa se um projeto com o id informado já existe no array
// caso o projeto NÃO EXISTA, um erro é retornado
// usado nas requisições onde o id é passado por parâmetro na url
function checkProjectInArray(req, res, next) {
    const { id } = req.params;
    const project = projects.find(project => {
        return project.id === id;
    });

    if (!project) {
        return res.status(400).json({ error: `project with id ${id} does not exists` });
    }

    return next();
}

// lista todos os projetos
server.get("/projects", (req, res) => {
    return res.json(projects);
});

// lista um projeto com o id informado
server.get("/projects/:id", checkProjectInArray, (req, res) => {

    const { id } = req.params;

    const project = projects.find(project => {
        return project.id === id;
    });

    return res.json(project);

});

// cria um projeto com
server.post("/projects", checkProjectExists, (req, res) => {
    const { id, title } = req.body;

    projects.push({ id, title, tasks: [] });

    return res.json(projects);
});

// altera o title do projeto com o id informado
server.put("/projects/:id", checkProjectInArray, (req, res) => {

    const { id } = req.params;
    const { title } = req.body;

    projects.forEach(project => {
        if (project.id === id) project.title = title;
    });

    return res.json(projects);

});

// apaga um projeto com o id informado
server.delete("/projects/:id", checkProjectInArray, (req, res) => {
    const { id } = req.params;

    projects.forEach(project => {
        if (project.id == id) projects.splice(id, 1);
    });

    return res.send();
});

// adiciona uma tarefa ao array de tarefas do projeto com id informado
server.post("/projects/:id/tasks", checkProjectInArray, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    projects.forEach(project => {
        if (project.id === id) project.tasks.push(title);
    });

    return res.json(projects);
});


// indica que o server deve ouvir a porta 3000
server.listen(3000);