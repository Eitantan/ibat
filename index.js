const express = require('express');
const Database = require("replpersist")
const { generate } = require("randomstring")
const rand = generate
let userbase = new Database("users")

const app = express();
app.use(express.static("public"))

// function resetSessions() {
//   for (let a in userbase.data) {
//     userbase.data[a].currentSessionID = "invalid";
//   }
// }

// function zed() {
//   let dat = new Date();
//   let time = dat.getHours();
//   if (time == Math.round(Math.random()*24)) {
//     resetSessions()
//   }
// }

// setInterval(zed, 300000)

app.get("/signupmidpoint/:email/:password", (req, res)=>{
  let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	if (userbase.data[email] !== undefined) {
		res.send("<script>alert('Username taken'); setTimeout(()=>{window.location='https://sessions.eitanim.repl.co/signup.html'},2000)</script>")
	} else {
    var randsessid = rand()
		userbase.data[email] = {"pass": password}
		userbase.data[email].logins = 1
    userbase.data[email].currentSessionID = randsessid
	}
	res.redirect("/app/" + randsessid)
})

app.get("/loginmidpoint/:email/:password", (req, res)=>{
	console.log(decodeURIComponent(req.params.email))
	console.log(decodeURIComponent(req.params.password))
	let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	res.send(JSON.stringify(userbase))
	if (userbase.data[email]["pass"] !== password) {
		res.send("<script>alert('Incorrect creditentials'); setTimeout(()=>{window.location='https://sessions.eitanim.repl.co/login.html'},2000)</script>")
	} else {
		userbase.data[email].logins += 1
    userbase.data[email].currentSessionID = rand()
		res.redirect("/app/" + userbase.data[email].currentSessionID)
	}
})

app.get("/error/:errorcode/:errorreason", (req, res)=>{
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Error ${req.params.errorcode}</title>
</head>
<body>
  <h1>Error ${req.params.errorcode}</h1>
  <b>We could not find the webpage you were looking for, because <span style="color:red;background-color:black">${decodeURIComponent(req.params.errorreason)}</span></b>
  <a href="https://sessions.eitanim.repl.co">ET Go Home</a>
</body>
</html>`)
})

app.get("/app/:sessionid", (req, res)=>{
  let currUser = ""
  let sessFound = false;
  for (let user in userbase.data) {
    if (userbase.data[user].currentSessionID == req.params.sessionid) {
      currUser = user;
      sessFound = true;
    } else {
     if (sessFound == false) res.redirect("/error/487/your%20session%20id%20was%20invalid.")
    }
  }
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
			<h1>sessions</h1>
	 	<p>hallo ${currUser}</p>
		</body>
		</html>
 `)
})

app.listen(3000, () => {
  console.log('server started');
})