const express= require('express')
const Task =require('../models/Task')
const auth=require('../middleware/auth')
const router = new express.Router()




router.post('/Tasks',auth,async(req,res)=>{
    const task=new Task({
    	...req.body,
    	owner:req.user._id
    })
	try{
		await task.save()
		res.status(201).send(task)
	}
	catch(error){
		res.status(400).send(error)
	}
	// task.save().then(()=>{
	// 	res.status(201).send(task)
	// }).catch((error)=>{
	// 	res.status(400).send(error)

	// })
})	
//GET /tasks?completed=true
//GET /tasks?limit=3&skip=3
//GET /tasks?sortBy=createdAt:des
router.get('/Tasks',auth,async(req,res)=>{
	
	const match={}
	const sort={}
		if(req.query.sortBy){
			const parts=req.query.sortBy.split(':')
			sort[parts[0]]=parts[1]==='desc'?-1:1
		}
		if(req.query.completed){
			match.completed=req.query.completed==='true'
		}

	try{
		// const task=await Task.find({owner:req.user._})
		await req.user.populate({
			path:'tasks',
			match,
			options:{
				limit:parseInt(req.query.limit),
				skip:parseInt(req.query.skip),
				sort
			}
		}).execPopulate()
		res.send(req.user.tasks)
	}
	catch(error){
		res.send(error)
	}
	// Task.find({}).then((Task)=>{
	// 	res.send(Task)
	// }).catch((error)=>{
	// 	res.send(error)
	// })
})
router.get('/Tasks/:id',auth,async(req,res)=>{
	const _id =req.params.id
	try{
		// const id=await Task.findById(_id)
		const id= await Task.findOne({_id,owner:req.user._id})
		if(!id){
			return res.status(404).send()
		}
		res.send(id)
	}
	catch(error){
		res.send(error)
	}
	// Task.findById(_id).then((Task)=>{
	// 	if(!Task){
	// 		return res.status(404).send()
	// 	}
	// 	res.send(Task)
	// }).catch((error)=>{
	// 	res.send(error)
	// })
})


router.patch('/Tasks/:id',auth, async(req,res)=>{
	const updates=Object.keys(req.body)
	const allowedUpdates=['description','completed']
	const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
	if(!isValidOperation){
		return res.status(400).send({error:'invalid syntax'})
	}
	try{
		const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
				// const user=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
		if(!task){
			return res.status(404).send()
			
		}

		// updates.forEach((update)=> {
		// 	task[update]=req.body[update]
		// 	// statements
		// })
		  updates.forEach((update) => task[update] = req.body[update])

		await task.save()

		res.send(task)
	}
	catch(error){
		res.status(500).send(error)
	}
})

router.delete('/Tasks/:id',auth,async(req,res)=>{
	try{
		const user = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})

		if(!user){
			res.status(404).send()
		}
		res.send(user)
	}
	catch(error){
		res.status(500).send(error)
	}
})

module.exports =router
