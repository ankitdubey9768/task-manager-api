const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const User=require('../../src/models/user')
const userOneId=mongoose.Types.ObjectId()
const Task=require('../../src/models/Task')
const userOne={
	_id:userOneId,
	name:'Amit',
	email:'mike@example.com',
	password:'Mypass777:',
	tokens:[{
		token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
	}]
}
const userTwoId=mongoose.Types.ObjectId()
const userTwo={
	_id:userTwoId,
	name:'jess',
	email:'jess@example.com',
	password:'Mypass777:',
	tokens:[{
		token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
	}]
}
const taskOne={
	_id:new mongoose.Types.ObjectId(),
	description:'First task',
	completed: false,
	owner:userOne._id

}
const taskTwo={
	_id:new mongoose.Types.ObjectId(),
	description:'Second task',
	completed: true,
	owner:userOne._id

}
const taskThree={
	_id:new mongoose.Types.ObjectId(),
	description:'Third task',
	completed: true,
	owner:userTwo._id
	
}
const setupDatabase=async()=>{
	await User.deleteMany()
	await Task.deleteMany()
	await new User(userOne).save()
	await new User(userTwo).save()
	await new Task(taskOne).save()
	await new Task(taskTwo).save()
	await new Task(taskThree).save()

}
module.exports={
	userOneId,
	userOne,
	setupDatabase,
	taskOne,
	taskTwo,
	taskThree,
	userTwoId,
	userTwo
}
