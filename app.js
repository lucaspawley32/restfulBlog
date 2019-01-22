const express          = require('express');
const mongoose         = require('mongoose');
const bodyParser       = require('body-parser');
const methodOverride   = require('method-override');
const expressSanitizer = require('express-sanitizer');

let app = express();
//config
mongoose.connect('mongodb://localhost/restful_blog_app');
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// Blog.create({
//   title: "Test Blog",
//   image: "https://pixabay.com/get/e836b90e29fc073ed1584d05fb1d4e97e07ee3d21cac104496f5c171afefb0be_340.jpg",
//   body:"Hello this is a blog post"
// }, (err, blog) => {
//   if(err){
//     console.log(err);
//   }else{
//     console.log(blog);
//   }
// })

//routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
  Blog.find({},(err, blogs) =>{
    if(err){
      console.log(err)
    }else{
      res.render('index',{blogs:blogs});
    }
  });
});

app.post('/blogs', (req, res) => {
  //create blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog,(err, blogs) =>{
    if(err){
      console.log(err)
    }else{
      res.redirect('/');
    }
  });
});

app.get('/blogs/new', (req, res) => {
  res.render('new');
});

app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, blog) => {
    if(err){
      res.redirect('/');
    }else{
      res.render('show', {blog:blog});
    }
  });
});

app.put('/blogs/:id', (req, res) => {
  Blog.findByIdAndUpdate(req.params.id,req.body.blog, (err, blog) => {
    if(err){
      res.redirect('/blogs')
    }else{
      res.redirect('/blogs/<%=blog._id%>');
    }
  });
});

app.delete('/blogs/:id', (req, res) => {
  var blog = Blog.findByIdAndRemove(req.params.id, (err, blog) => {
    if (err) {
        console.log(err);
    }else{
      res.redirect('/');
    }
  });
});

app.get('/blogs/:id/edit', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findById(req.params.id, (err, blog) => {
    if(err){
      res.redirect('/');
    }else{
      res.render('edit', {blog:blog});
    }
  });
});

app.listen(3000, () => {
  console.log('server running');
});
