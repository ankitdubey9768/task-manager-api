const express=require('express')
// const bcrypt = require('bcryptjs')
require('./db/mongoose')
const userRouter= require('./routers/user')
const taskRouter= require('./routers/task')

const app=express() 
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports=app




// // app.use((req,res,next)=>{
// // 	if(req.method==='GET'){
// // 		res.send('get requests are disabled')
// // 	}
// // 	else{
// // 	console.log(req.method,req.path)
// // 	next()
// // }
// // })
// app.use((req,res,next)=>{
// 	if(req.method){
// 		res.status(503).send('site is under maintanance mode')
// 	}
// })

// const jwt =require('jsonwebtoken')
// const myFunction= async()=>{
// 	const token=jwt.sign({id:'abc123'},'thisismynewcourse',{expiresIn:'7 days'})
// 	console.log(token)

// 	const data=jwt.verify(token,'thisismynewcourse')
// 	console.log(data)


	// const password='Red12345!'
	// const hashpassword= await bcrypt.hash(password,8)
	// console.log(password)
	// console.log(hashpassword)

	// const ismatch=await bcrypt.compare(password,hashpassword)
	// console.log(ismatch)
// }
// myFunction()

// const Task = require('./models/Task')
// const User= require('./models/user')
// const main = async () => {
//     // const task = await Task.findById('5f69e2be9ea60a10c44596bd')
//     // await task.populate('owner').execPopulate()// settng  the relation between models 
//     // console.log(task.owner)
//     const user= await User.findById('5f69dd571681041338a83bcc')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
// }
// main()



// const multer= require('multer')
// const upload= multer({
// 	dest:'images'
// })
// app.post('/upload',upload.single('upload'),(req,res)=>{
// 	res.send()
// })
