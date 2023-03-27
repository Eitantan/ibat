const express = require('express');
const Database = require("replpersist")
const rand = require("unique-string")
let userbase = new Database("users")

const app = express();
app.use(express.static("public"))

app.get("/signupmidpoint/:email/:password", (req, res)=>{
	console.log(decodeURIComponent(req.params.email))
	console.log(decodeURIComponent(req.params.password))
	let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	if (userbase.data[email] !== undefined) {
		res.send("<script>alert('Username taken'); setTimeout(()=>{window.location='sessions.eitanim.repl.co/signup.html'},2000)</script>")
	} else {
		userbase.data[email] = {"pass": password}
		userbase.data[email].logins = 1
    userbase.data[email].currentSessionID = rand()
	}
	res.redirect("/app")
})

app.get("/loginmidpoint/:email/:password", (req, res)=>{
	console.log(decodeURIComponent(req.params.email))
	console.log(decodeURIComponent(req.params.password))
	let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	res.send(JSON.stringify(userbase))
	if (userbase.data[email]["pass"] !== password) {
		res.send("<script>alert('Incorrect creditentials'); setTimeout(()=>{window.location='sessions.eitanim.repl.co/login.html'},2000)</script>")
	} else {
		userbase.data[email].logins += 1
		res.redirect("/app")
	}
})

app.get("/app/:sessionid", (req, res)=>{
  console.log(Object.values(userbase.data))
  // for (each in userbase.data) {
  //   con
  // }
	res.send(`
 		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta http-equiv="X-UA-Compatible" content="IE=edge">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>account-system | Home</title>
		</head>
		<body>
			<h1>account-system</h1>
	 	<p>u looggfed in</p>
		</body>
		</html>
 `)
})

app.listen(3000, () => {
  console.log('server started');
})