const request= require('supertest')
const app=require('../src/app')
const User=require('../src/models/user')
const {	userOneId,userOne,setupDatabase}=require('./fixtures/db')

beforeEach(setupDatabase)



test('should signup a new user', async()=>{
	const response=await request(app).post('/Users').send({
		name:'Ankit',
		email:'andrew@example.com',
		password:'Mypass777:'
		
	}).expect(201)
	//Assert that database was changed correctly
	const user=await User.findById(response.body.user._id)
	expect(user).not.toBeNull()
	//Assertions about the response
	expect(response.body).toMatchObject({
		
		user:{
			name:'Ankit',
			email:'andrew@example.com'
		},
		token:user.tokens[0].token
	})
	expect(user.password).not.toBe('MyPass777')
})
test('should login existing user',async()=>{
	const response = await request(app).post('/Users/login').send({
		email:userOne.email,
		password:userOne.password
	}).expect(200)
	const user=await User.findById(userOneId)
	expect(response.body.token).toBe(user.tokens[1].token)

})
test('read the profile of user',async()=>{
	await request(app).get('/Users/me')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.send()
	.expect(200)
})
test('should not get profile of unauthenticated users',async()=>{
	await request(app).get('/Users/me')
	.send()
	.expect(401)
})
test('should delete the profile of authenticated user',async()=>{
	await request(app).delete('/Users/me')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.send()
	.expect(200)
	const user=await User.findById(userOneId)
	expect(user).toBeNull()
})
test('should not delete the profile of unauthenticated user',async()=>{
	await request(app).delete('/Users/me')
	
	.send()
	.expect(401)
})
test('should upload avatar image',async()=>{
	await request(app).post('/Users/me/avatar')
	.set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.attach('avatar','tests/fixtures/profile-pic.jpg')
	.expect(200)
	const user=await User.findById(userOneId)
	expect(user.avatar).toEqual(expect.any(Buffer))//to check the wheather file contain the buffer or not,to comapare two objects we use toEqual
})
test('should update valid user fields',async()=>{
	await request(app).patch('/Users/me')
	.send({
		name:'jess'
	}).set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.expect(201)
	const user= await User.findById(userOneId)
	expect(user.name).toEqual('jess')


})
test('should update valid user fields',async()=>{
	await request(app).patch('/Users/me')
	.send({
		location:'philadelphia'
	}).set('Authorization',`Bearer ${userOne.tokens[0].token}`)
	.expect(400)
	


})
