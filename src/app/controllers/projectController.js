const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth')

const Project = require('../models/project')
const Task = require('../models/task')

router.use(authMiddleware)

router.get('/', async (req,res)=>{
    try{

        const projects = await Project.find().populate(['user', 'tasks']);

        return res.send({projects})


    }catch(err){
        res.status(500).send({Error: "[PROJECT] Erro on list projects"})
    }
})

router.get('/:projectId', async (req,res)=>{
    try{

        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);
        return res.send({project})


    }catch(err){
        res.status(500).send({Error: "[PROJECT] Erro on load project"})
    }
})

router.post('/', async (req,res)=>{
    try{
        
        const {title, description, tasks} = req.body
        const project = await Project.create({title, description, user:req.userId});

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id})

            await projectTask.save()

            project.tasks.push(projectTask)
        }))

        await project.save();

        return res.send(project)


    }catch(err){
        res.status(500).send({Error: "[PROJECT] Erro to create new project"})
    }
})

router.put('/:projectId', async (req,res)=> {
    try{
        
        const {title, description, tasks} = req.body
        const project = await Project.findByIdAndUpdate(req.params.projectId, {
            title, 
            description, 
        }, {new : true}); // retorna o projeto atualizado


        project.tasks = [];
        await Task.remove({
            project: project._id
        })

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({...task, project: project._id})

            await projectTask.save()

            project.tasks.push(projectTask)
        }))


        await project.save();

        return res.send(project)


    }catch(err){
        res.status(500).send({Error: "[PROJECT] Erro on update project"})
    }
})

router.delete('/:projectId', async (req,res)=> {
    try{

        await Project.findByIdAndRemove(req.params.projectId)

        tasks = await Task.find({project : req.params.projectId})

        tasks.forEach(async task => {
            await Task.findByIdAndRemove(task._id)
        });

        return res.send(200)

    }catch(err){
        console.log(err)
        res.status(500).send({Error: "[PROJECT] Erro on delete project"})
    }
})

module.exports = app => app.use('/projects', router)