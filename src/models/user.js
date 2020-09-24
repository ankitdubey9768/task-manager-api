const mongoose = require('mongoose')
const validator= require('validator')
const bcrypt = require('bcryptjs')
const jwt =require('jsonwebtoken')
const Task=require('./Task')
const userSchema= new mongoose.Schema({
	name:{
		type:String,
		required: true,
		trim:true
	},
	email:{
		type:String,
		required:true,
		unique:true,
		trim:true,
		lowercase:true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('put the correct email')
			}

		}
	},
	password:{
		type:String,
		required:true,
		trim:true,
		minlength:7,
		validate(value){
			if(value.toLowerCase().includes("password")){
				throw new Error('password cannot be "password or less than 7 characters')
			}
		}
	},
	age:{
		type:Number
	},
	avatar:{
		type:Buffer
	},
	tokens:[{
		token:{
			type:String,
			required:true
		}
	}]
},{
	timestamps:true
})
userSchema.virtual('tasks',{
	ref:'Task',
	localField:'_id',
	foreignField: 'owner'
})
userSchema.methods.generateAuthToken = async function(){
	const user=this
	const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
	user.tokens=user.tokens.concat({token})
	await user.save()
	return token 
}
userSchema.methods.toJSON= function(){
	const user=this
	const userObject=user.toObject()//to object is the mongoose method which returns the toatal value
	delete userObject.password
	delete userObject.tokens
	delete userObject.avatar
	return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('happy to have to you ')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(user.password)
    console.log(user)
    console.log(password)
    console.log(isMatch)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

// userSchema.statics.findByCredentials= async (email,password)=>{
// 	const user =await User.findOne({ email })
// 	if(!user){
// 		throw new Error('unable to login')
// 	}
// 	const isMatch= await bcrypt.compare(password,user.password)


// 	if(!isMatch){
// 		throw new Error('unable to login')
// 	}
// 	return user 
// }
//we have two option pre or post pre is for before the user 
//we did hashing of a plain text password
userSchema.pre('save', async function (next) {
	const user=this

	if(user.isModified('password')){
		user.password=await bcrypt.hash(user.password, 8)
	}
	next()
})
//Delete user task when the user is removed
userSchema.pre('remove',async function(next){
	const user= this
	await Task.deleteMany({owner:user._id})
	next()

})
const User=mongoose.model('User',userSchema)
module.exports=User