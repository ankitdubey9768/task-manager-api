const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelllationEmail}=require('../emails/account')
const router= new express.Router()




router.post('/Users',async(req,res)=>{
	const user =new User(req.body)
	try{
	await user.save()
	sendWelcomeEmail(user.email,user.name)
	const token= await user.generateAuthToken()
	res.status(201).send({user,token})
	}
	catch(error){
		res.status(400).send(error)
	}
	// user.save().then(()=>{
	// 	res.status(201).send(user)
	// }).catch((error)=>{
	// 	res.status(400).send(error)
	// })


})
router.post('/Users/login',async (req,res)=>{
	try{
	const user = await User.findByCredentials(req.body.email,req.body.password)
	const token = await user.generateAuthToken()
	res.send({user,token})//short hand syntax for writing objects
	}catch(e){
		res.status(400).send()
		console.log(e)
	}
})
router.post('/Users/logout',auth,async(req,res)=>{
	try{
		req.user.tokens=req.user.tokens.filter((token)=>{
			return token.token!==req.token
		})
		await req.user.save()
		res.send()

	}
	catch(e){
		res.status(500).send()

	}
})
router.post('/User/logoutAll',auth,async(req,res)=>{
	try{
		req.user.tokens=[]
		await req.user.save()
		res.send()
	}catch(e){
		console.log(e)
		res.status(500).send()
	}
})
const upload=multer({
	// dest:'avatar',we are removing it multer will now execute the function instead directly saving the image into the directory


	limits:{
		fileSize:1000000
	},
	fileFilter(req,file,cb){
		if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
		{
			return cb( new Error('please upload a document'))
		}
		cb(undefined,true)
	}
	
})
router.post('/Users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
	const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
	req.user.avatar=buffer
	await req.user.save()
	res.send()


},(error,req,res,next)=>{
	 res.status(400).send({error:error.message})//it is compulsary to put four arguments in this function so that express could understand that it is made for handling errors
})
router.delete('/Users/me/avatar',auth,upload.single('avatar'),async(req,res)=>{
	req.user.avatar=undefined
	await req.user.save()
	res.send()
})
router.get('/Users/:id/avatar',async(req,res)=>{
	try {
		const user=await User.findById(req.params.id)
		if(!user || !user.avatar)
		{
			throw new new Error()
		}
		res.set('Content-Type','image/png')
		res.send(user.avatar)
		// statements
	} catch(e) {
		// statements
		res.status(404).send()
	}
})
router.get('/Users/me',auth,async (req,res)=>{



	res.send(req.user)
	// try{

	// 	const user =await User.find({})
	// 	res.send(user)
	// 	console.log('user existed')
	// }
	// catch(error){
	// 	res.status(400).send(error)
		
	// }
	// User.find({}).then((users)=>{
	// 	res.send(users)

	// }).catch(()=>{
	// 	res.status(400).send(error)
	// })
})
// router.get('/Users/:id',async(req,res)=>{
// 	const _id =req.params.id
// 	try{
// 	const id=await User.findById(_id)
// 	if(!id){
// 		res.status(404).send()
// 	}
// 	res.send(id)
// 	}
// 	catch(error){
// 		res.send(error)
// 	}
// 	// User.findById(_id).then((users)=>{
// 	// 	res.send(users)
// 	// })
// })
router.patch('/Users/me',auth,async(req,res)=>{
	const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

	const _id = req.params.id
	try{

		updates.forEach((update)=> {
			req.user[update]=req.body[update]
		});
		await req.user.save()
		

		// const user =await User.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
	
		res.status(201).send(req.user)
	}
	catch(error){
		res.status(500).send(error)
	}
})
router.delete('/Users/me',auth,async(req,res)=>{
	try{
		// const user = await User.findByIdAndDelete(req.user._id)
		// if(!user){
		// 	res.status(404).send()
		//}
		await req.user.remove()
		sendCancelllationEmail(req.user.email,req.user.name)
		res.send(req.user)
	}
	catch(error){
		res.status(500).send(error)
	}

})


module.exports=router



