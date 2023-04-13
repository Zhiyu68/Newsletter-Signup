// jshint esversion: 6

const express = require('express');
const bodyParser = require("body-parser");
const https = require("https");
const { url } = require('inspector');

const app = express();

const port = 3000

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
//-----------------------------------------------------

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html");
})

app.post('/',(req,res) =>{
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:lastName
        }
      }
    ] 
  };

  const jsonData = JSON.stringify(data);

  // console.log(firstName,lastName,email);

  const url = "https://us12.api.mailchimp.com/3.0/lists/ca9f80df2f";

  const options = {
    method: "POST",
    auth: "zhiyu1:7354c26feaa009be123e5f52f120a99e-us12"
  }

  const request = https.request(url,options,function(response){

    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html")
    } else{
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data",function(data){
      console.log(JSON.parse(data));

    })
  })
  request.write(jsonData);
  request.end();
});

// ------------ failure -------------------------------

app.post("/failure",function(req,res){
  // 重新定向
  res.redirect("/")
})

// ------------- at the end ----------------------------
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });

  // API Key
  // 7354c26feaa009be123e5f52f120a99e-us12

  // list id
  // ca9f80df2f