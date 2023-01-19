var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.query("use bloodbank", function (err, result) {
      if (err) throw err;
      console.log("Database accessed " + result);
    });
});
const express = require("express");
const bodyParser= require("body-parser");
app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');

var username;


app.get("/",function(req,res){
  res.sendFile(__dirname + "/index1.html");
});
app.get("/index",function(req,res){
  res.sendFile(__dirname,"/index.html");
});
app.get("/signuppage1",function(req,res){
  res.render("signuppage1",{temp:""});
});
app.get("/receiverpage",function(req,res){
  res.render('receiverpage',{temp:""});
});
app.get("/loginpage",function(req,res){
  //res.sendFile(__dirname + "/loginpage.html");
  res.render("loginpage",{temp:""});
});

app.get("/city-names",function(req,res){
  var result1=0,result2=0;
  res.render("city-names",{result1,result2,msg:"",msg1:""});
});
app.get("/compatable",function(req,res){
  res.sendFile(__dirname + "/compatable.html");
});

app.listen(3000,function(){
    console.log("ello hmea");
});



app.post('/signuppage1',function(req,res){
  var fname = String(req.body.fname);
  var lname = String(req.body.lname);
  var user = String(req.body.uname);
  var email= String(req.body.email);
  var password = String(req.body.password);
  var bg= String(req.body.bloodgroup);
  var city= String(req.body.city);
  var zipcode= String(req.body.zipcode);
  var State= String(req.body.state);
  var Country= String(req.body.country);
  var phone = String(req.body.phone);
  var test= "select email,username from user1 where email like"+mysql.escape(email)+";";
  con.query(test,function(err,result,fields){
    if (err) throw err;
    var size= Object.keys(result).length;
    if (size==0){
      //var query = "insert into user values " + "(" + mysql.escape(fname) + "," + mysql.escape(lname) + "," + mysql.escape(user) + "," +mysql.escape(email) + "," +mysql.escape(city) +"," +mysql.escape(zipcode)+","+mysql.escape(State)+","+mysql.escape(Country)+","+mysql.escape(phone)+","+mysql.escape(password)+","+mysql.escape(bg)+');';   
      // console.log(fname+lname+email+phone+password);
      var query1= "insert into user1 values "+"("+ mysql.escape(fname) + ","+mysql.escape(lname)+","+ mysql.escape(user)+","+mysql.escape(email) +","+mysql.escape(zipcode)+","+mysql.escape(password)+ ","+mysql.escape(bg)+");";
      con.query(query1, function (err, result, fields) {
        if (err) throw err;
        console.log("data inserted successfully");
        res.sendFile(__dirname + "/index.html");
      });
      var test2="select * from user2 where pincode = "+mysql.escape(zipcode)+";";
      con.query(test2,function(err,result,fields){
        if (err) throw err;
        var size= Object.keys(result).length;
        if (size==0){
          var query2="insert into user2 values "+"("+ mysql.escape(zipcode)+","+mysql.escape(city)+","+mysql.escape(State)+");";
          con.query(query2, function (err, result, fields) {
            if (err) throw err;
            console.log("data inserted successfully user t2");
          });
        }else{
          console.log('pincode already exists');
        }
        
         // res.sendFile(__dirname + "/index.html");
        

      });
      res.render("loginpage",{temp:""});
      
    }
    else{
      res.render("signuppage1",{temp:"User name or email already exists."})
    }
  

    
  });


});
  
//   var query = "insert into user values " + "(" + mysql.escape(fname) + "," + mysql.escape(lname) + "," + mysql.escape(user) + "," +mysql.escape(email) + "," +mysql.escape(city) +"," +mysql.escape(zipcode)+","+mysql.escape(State)+","+mysql.escape(Country)+","+mysql.escape(phone)+","+mysql.escape(password)+","+mysql.escape(bg)+');';
// // console.log(fname+lname+email+phone+password);
// con.query(query, function (err, result, fields) {
//   if (err) throw err;
//   console.log("data inserted successfully");
//   res.sendFile(__dirname + "/index.html");
// });
// res.render("loginpage",{temp:""});
// });
app.post('/loginpage',function(req,res){
  var email = String(req.body.email);
  var password = String(req.body.password);
  var query = "select * from user1 where email like "+mysql.escape(email)+";";
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    var s = Object.keys(result).length; 
    if(s==0 || email!=result[0].email || password!=result[0].password){
      res.render("loginpage",{temp:"Please check your email and password and try again."});
    }
    else{
      // fname = result[0].fname;
      username = result[0].username;
      res.sendFile(__dirname + "/index.html");
    }
  } );
});
app.post('/receiverpage',function(req,res){
  var name = String(req.body.Name);
  // var uname = String(req.body.username);
  var phno = String(req.body.Phonenum);
  var age = String(req.body.Age);
  var health = String(req.body.health);
  if(health=="Yes" || age<18){
    res.render('receiverpage',{temp:"You are not eligible for donation"});
  }
  else{
  var query = "insert into donor values " + "(" + mysql.escape(name) + "," + mysql.escape(username) + "," + mysql.escape(phno) + "," +mysql.escape(age) + "," +mysql.escape(health)+');';
  //var query2 =  insert into donor2 values "+"
  // console.log(fname+lname+email+phone+password);
  con.query(query, function (err, result, fields) {
    if (err) throw err;
    console.log("data inserted successfully");
  });
  res.sendFile(__dirname + "/index.html");
  }
  
  });

app.post('/city-names',function(req,res){
  var state = String(req.body.state);
  var city= String(req.body.city);
  var bgroup=String(req.body.bgroup);
  var bgroup1= bgroup+"%";
  var check1=String(req.body.checked);
  var check2 = String(req.body.checked1);
  
  if(check1!="True" && check2!="True")
  {
    var result1=0, result2=0;
    res.render("city-names",{result1,result2,msg:"Please select check box",msg1:"Please select checkbox"});
  }
  else if(check1=="True" && check2!="True")
  {
    var result1=0, result2=0;
    var query="select bgroup,hname,bunits from hospitals where  city like "+ mysql.escape(city)+" and bgroup like "+mysql.escape(bgroup1)+";";
    con.query(query, function (err, result1, fields) {
      if (err) throw err;
      // var result = "vid: " + result[0].vid + "vehicle type : " + result[0].type + " source location: " + result[0].source + " destnation location : " + result[0].destnation;
      var size = Object.keys(result1).length;
      console.log(result1);
      if(size==0)
      res.render("city-names",{result1,result2,msg:"no options found",msg1:""});
      else
      res.render("city-names",{result1,result2,msg:"",msg1:""});
    });
  }
  else if(check1!=="True" && check2=="True")
  { 
    var result1=0, result2=0;
    // select name,donor.phone from donor join user on  donor.uname=user.username where bloodgroup like'O%'and city like'Visakhapatnam';
    var join="select name,donor.phone from user1,user2,donor where donor.uname=user1.username and  user1.pincode=user2.pincode and bloodgroup like"+mysql.escape(bgroup1)+"and city like"+mysql.escape(city)+";";
  console.log(join);
  con.query(join, function (err, result2, fields) {
    if (err) throw err;
    // var result = "vid: " + result[0].vid + "vehicle type : " + result[0].type + " source location: " + result[0].source + " destnation location : " + result[0].destnation;
    var size = Object.keys(result2).length;
    console.log(result2);
    if(size==0)
    res.render("city-names",{result1,result2,msg:"Oops! no options available :(",msg1:""});
    else
    res.render("city-names",{result1,result2,msg:"",msg1:""});
  });


  }
  else{
    var result1=0,result2=0;
    var query="select bgroup,hname,bunits from hospitals where  city like "+ mysql.escape(city)+" and bgroup like "+mysql.escape(bgroup1)+";";
    // var result1,result2;
    con.query(query, function (err, result1, fields) {
      if (err) throw err;
      // var result = "vid: " + result[0].vid + "vehicle type : " + result[0].type + " source location: " + result[0].source + " destnation location : " + result[0].destnation;
      var size = Object.keys(result1).length;
      console.log(result1);
      // result1 = Object.assign({},result);
      // if(size==0)
      // res.render("city-names",{result1,result2,msg:"no options found",msg1:""});
      // else
      // res.render("city-names",{result1,result2,msg:"",msg1:""});
      con.query(join, function (err, result2, fields) {
        if (err) throw err;
        // var result = "vid: " + result[0].vid + "vehicle type : " + result[0].type + " source location: " + result[0].source + " destnation location : " + result[0].destnation;
        var size = Object.keys(result2).length;
        console.log(result2);
        // result2 = Object.assign({},result);
        // if(size==0)
        // res.render("city-names",{result1,result2,msg:"Oops! no options available :(",msg1:""});
        // else
        res.render("city-names",{result1,result2,msg:"",msg1:""});
      });
      
    });
    var join="select name,donor.phone from user1,user2,donor where donor.uname=user1.username and  user1.pincode=user2.pincode and bloodgroup like"+mysql.escape(bgroup1)+"and city like"+mysql.escape(city)+";";
    // console.log(join);
    
    // console.log(result1);
    // console.log(result2);
    // res.render("city-names",{result1,result2,msg:"",msg1:""});

  }
  
  
 
});






// var query1;
//   console.log("The check value is " + check1);
//   if(check=="True")
//   query1 = "select * from vehicle where type like " + mysql.escape(mode) + " and source like " + mysql.escape(source) + " and destnation like " + mysql.escape(dest) + " and depDate like " + mysql.escape(date)+";"
//   else
//   query1 = "select * from vehicle where type like " + mysql.escape(mode) + " and source like " + mysql.escape(source) + " and destnation like " + mysql.escape(dest) +";";
// console.log(query1);
//select name from donor,user1,user2 where donor.uname=user1.username and user1.pincode=user2.pincode and city like "Visakhapatnam";