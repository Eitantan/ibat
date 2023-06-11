const express = require('express');
const Database = require("replpersist")
const { generate } = require("randomstring")
const rand = generate
let userbase = new Database("users")

const app = express();
app.use(express.static("public"))


app.use(express.urlencoded());

app.get("/signupmidpoint/:email/:password", (req, res)=>{
  let email = decodeURIComponent(req.params.email)
	let password = decodeURIComponent(req.params.password)
	console.log(userbase.data[email])
	if (userbase.data[email] !== undefined) {
		res.send("<script>alert('Username taken'); setTimeout(()=>{window.location='https://ibuiltathing.anthonymouse.repl.co/signup.html'},2000)</script>")
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
	if (userbase.data[email]["pass"] !== password) {
		res.send("<script>alert('Incorrect creditentials'); setTimeout(()=>{window.location='https://ibuiltathing.anthonymouse.repl.co/login.html'},2000)</script>")
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
  <a href="https://ibuiltathing.anthonymouse.repl.co">ET Go Home</a>
</body>
</html>`)
})

app.get("/app/:sessionid", (req, res)=>{
  let currUser = ""
  let sessFound = false;
  for (let user in userbase.data) {
		console.log(userbase.data[user])
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
			<h1>ibuiltathing</h1>
	 		<p>hello ${currUser}</p>
			<a href="/upload/${req.params.sessionid}">Upload Build</a>
			<a href="/logout/${req.params.sessionid}">Logout</a>
		</body>
		</html>
 `)
})

app.get("/logout/:sessionid", (req, res)=>{
  let currUser = ""
  let sessFound = false;
  for (let user in userbase.data) {
		console.log(userbase.data[user])
    if (userbase.data[user].currentSessionID == req.params.sessionid) {
      currUser = user;
      sessFound = true;
			userbase.data[user].currentSessionID == null;
			res.redirect("https://ibuiltathing.anthonymouse.repl.co")
    } else {
     if (sessFound == false) res.redirect("/error/487/your%20session%20id%20was%20invalid.")
    }
  }
})

app.get("/upload/:sessionid", (req, res)=>{
  let currUser = ""
  let sessFound = false;
  for (let user in userbase.data) {
		console.log(userbase.data[user])
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
	 		<style>
				#display_image{
				  width: 500px;
				  height: 325px;
				  border: 2px solid black;
				  background-position: center;
				  background-size: cover;
				}
			</style>
		</head>
		<body>
			<script src="https://cdn.socket.io/4.6.0/socket.io.min.js" integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+" crossorigin="anonymous"></script>
			<h1>ibuiltathing</h1>
	 		<p>hello ${currUser}</p>
			<form action="#" method="POST">
				<input name="title" placeholder="Title">
		 		<textarea placeholder="Description" id="desc" name="desc"></textarea>
				<p>Upload Images</p>
				<input type="file" id="image_input" accept="image/jpeg, image/png, image/jpg" multiple=true>
		  	<div id="display_image"></div>
				<input id="submit" type="submit">
			</form>
	 <script>
			document.getElementById("submit").addEventListener(function(e){
	 
			})
 		</script>
		
			<a href="/logout/${req.params.sessionid}">Logout</a>
		</body>
		</html>
 `)
})

app.post("/upload/:sessionid", (req, res)=>{
  let currUser = ""
  let sessFound = false;
  for (let user in userbase.data) {
		console.log(userbase.data[user])
    if (userbase.data[user].currentSessionID == req.params.sessionid) {
      currUser = user;
      sessFound = true;
    } else {
     if (sessFound == false) res.redirect("/error/487/your%20session%20id%20was%20invalid.")
    }
  }
	res.send(req.body)
})

/* <!--	 
<script>
const image_input = document.querySelector("#image_input");

image_input.addEventListener("change", function() {
  const file_reader = new FileReader();
  file_reader.addEventListener("load", () => {
    const uploaded_image = file_reader.result;
		alert(uploaded_image.length)
    document.querySelector("#display_image").style.backgroundImage = "url(" + uploaded_image + ")";
  });
  file_reader.readAsDataURL(this.files[0]);
});
</script> --> */

/* 			<!--  --> */

app.listen(3000, () => {
  console.log('server started');
})