const sgMail=require('@sendgrid/mail')



sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail=(email,name)=>{
	sgMail.send({
		to:email,
		from:'ankitdubey9768@gmail.com',
		subject:'Thank you for joining in !',
		text:`Welcome to the app, ${name} . let me know how do you go along with the app.`
	})
}
const sendCancelllationEmail=(email,name)=>{
	sgMail.send({
		to:email,
		from:'ankitdubey9768@gmail.com',
		subject:'Sory to see you go !',
		text:`good bye ${name}. I hope to see you back sometime soon `
	})
}


module.exports={
	sendWelcomeEmail,
	sendCancelllationEmail
}














// sgMail.send({
// 	to:'ankitdubey9768@gmail.com',
// 	from:'ankitdubey9768@gmail.com',
// 	subject:'This is my first crteation',
// 	text:'I hope this one actually get to you'
// })