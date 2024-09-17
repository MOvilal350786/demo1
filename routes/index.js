var express = require('express');
var router = express.Router();

const userModel=require('./users');
const postModel=require('./posts');
const upload=require('./multer');


const passport=require('passport');

const localStrategy=require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));//these two line responsible for user ligin

/* GET home page. */
router.get('/', function(req, res) {//register page
  res.render('index', {nav:false});
});

router.get('/login', function(req, res){//login page
  res.render('login', {nav:false});
});

router.get('/edit', isloggedIn, async function(req, res){
  const user=await userModel.findOne({username:req.session.passport.user});
  res.render('edit', {user, nav:false});
})


router.get('/help', function(req, res){

  res.render('help', {nav:false});
});

router.post('/update', upload.single('image'), async function(req, res){

  const user= await userModel.findOneAndUpdate(
    {username:req.session.passport.user},
    {username:req.body.username, name:req.body.name, Bio:req.body.Bio},
    {new: true});

    if(req.file){
      user.ProfileImage = req.file.filename;
    }

  await user.save();
  res.redirect("/profile");
});


  router.post('/register', function(req, res, next){
    const data=new userModel({
      fullname:req.body.fullname,
      username:req.body.username,
      email:req.body.email,
     
       
      
    })
    userModel.register(data, req.body.password).then(function(){
      passport.authenticate("local")(req, res, function(){
        res.redirect('/profile');
      });
    });
  });




//@@@@@@@@@@@@@@@@@ login-Section here @@@@@@@@@@@@@@@@@@
router.post('/login', passport.authenticate("local", {
  successRedirect:'/profile',
  failureRedirect:'/login'
}), function(req, res, next){});



router.get('/profile', isloggedIn, async function(req, res){//profile page
  const user= await userModel.findOne({username:req.session.passport.user})
  .populate('posts');

   res.render('profile', {user, nav:true});
 });

 router.get('/feed', isloggedIn, async function(req, res){//profile page
  const user= await userModel.findOne({username:req.session.passport.user})
 
  const posts=await postModel.find().populate("user");// every post contain a id that name is => user  user: type:mongoose.Schema.Types.ObjectId, ref:'user'},
//AND ALL post come into the posts 
   res.render('feed', {user, posts, nav:true}); // RENDER those all posts
 });




 router.get('/show/posts', isloggedIn, async function(req, res){//profile page
  const user= await userModel.findOne({username:req.session.passport.user}).populate('posts');

   res.render('show', {user, nav:true});
 });

// router.get('/show', async function(req, res){//profile page
//   const user= await userModel.findOne({username:req.session.passport.user});
//    res.render('show', {user, nav:true});
//  });


 
router.get('/add', isloggedIn, async function(req, res){//profile page
  const user= await userModel.findOne({username:req.session.passport.user});

   res.render('add', {user, nav:true});
 });



 router.post('/upload', isloggedIn, upload.single("image"), async function(req, res, next){
const user=await userModel.findOne({username: req.session.passport.user});
user.profileImage=req.file.filename; // Any file who is uploaded that file's unique name saves  within req.file.filename and req.file.filename ko user.profileImage property mein assign kar rahe hain, jo user ke profile image ko update karta hai.
await user.save();//await user.save() use karke updated user object ko database mein save karte hain.
res.redirect("/profile")
  
 });

// in add routes create posts of add section
 router.post('/CreatePost', isloggedIn, upload.single("Postimage"), async function(req, res, next){//<form action="/CreatePost" method="post" enctype="multipart/form-data"><input class="block  m-5" type="file" name="Postimage"> // here Postimage in name field
  const user=await userModel.findOne({username: req.session.passport.user});
 const post=await postModel.create({// below left side come from postModel and right side name come from ejs name attribute


  user:user._id,    // user:{type:mongoose.Schema.Types.ObjectId, ref:'user'},   gave the user_id to user that present in postfield in postModel=> post knows user  
  title:req.body.title,
  Description:req.body.Description,
  image:req.file.filename

  
  

 });
 user.posts.push(post._id);// user knows what post => posts:[{type:mongoose.Schema.Types.ObjectId, ref:'post'}] since this is userModel
 await user.save();// user save post._id in database
 res.redirect('/profile');
    
   });

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})



function isloggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}
module.exports = router;
