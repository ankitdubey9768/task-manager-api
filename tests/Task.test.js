const request=require('supertest')
const Task=require('../src/models/task')
const app=require('../src/app')
const {	userOneId,userOne,setupDatabase,taskOne,taskTwo,taskThree,userTwoId,userTwo}=require('./fixtures/db')

beforeEach(setupDatabase)

test('should create a task for user',async()=>{
	const response=await request(app)
	.post('/Tasks')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.send({
		description:'from my test'
	}).expect(201)
	const task=await Task.findById(response.body._id)
	expect(task).not.toBeNull()
	expect(task.completed).toEqual(false)

})
test('should fetch user task',async()=>{
	const response=await request(app)
	.get('/Tasks')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.send()
	.expect(200)
	expect(response.body.length).toEqual(2)
})
test('should not delete other users task',async()=>{
	const response= await request(app)
	.delete(`/Tasks/${taskOne._id}`)
	.set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
	.send()
	.expect(404)
	const task= await Task.findById(taskOne._id)
	expect(task).not.toBeNull()
})
