var crypto = require('crypto');
var mongoose = require('mongoose'),
  User = mongoose.model('User');
var Post = mongoose.model('Post');

function hashPW(pwd) {
  return crypto.createHash('sha256').update(pwd).
  digest('base64').toString();
}
exports.signup = function(req, res) {
  console.log("Begin exports.signup");
  var user = new User({ username: req.body.username });
  console.log("after new user exports.signup");
  user.set('hashed_password', hashPW(req.body.password));
  console.log("after hashing user exports.signup");
  user.set('email', req.body.email);

  if (!req.body.profilePic || req.body.profilePic.trim() == "") {
    user.set('profilePic', '/images/genIcon.jpg');
  }
  else {
    user.set('profilePic', req.body.profilePic);
  }
  console.log("after email user exports.signup");
  user.save(function(err) {
    console.log("In exports.signup");
    console.log(err);
    if (err) {
      res.session.error = err;
      res.redirect('/signup');
    }
    else {
      req.session.user = user.id;
      req.session.username = user.username;
      req.session.msg = 'Authenticated as ' + user.username;
      req.session.profilePic = user.profilePic;
      res.redirect('/');
    }
  });
};

exports.addPost = function(req, res) {
  console.log("adding post");
  if (req.session.user) {
    var timestamp = Math.round(new Date().getTime() / 1000);
    var postObj = {
      username: req.session.username,
      profilePic: req.session.profilePic,
      text: req.body.text,
      timestamp: timestamp
    }
    var post = new Post(postObj);
    post.save(function(err) {
      if (err) {
        console.log(err);
        res.redirect('/');
      }
      else {
        console.log("successfully added post");
        res.json({ id: post.id })
      }
    })
  }
  else {
    res.status(403);
    res.send("Forbidden: You do not have permission to access this page.");
  }
}
exports.login = function(req, res) {
  User.findOne({ username: req.body.username })
    .exec(function(err, user) {
      if (!user) {
        err = 'User Not Found.';
      }
      else if (user.hashed_password ===
        hashPW(req.body.password.toString())) {
        req.session.regenerate(function() {
          console.log("login");
          console.log(user);
          req.session.user = user.id;
          req.session.username = user.username;
          req.session.profilePic = user.profilePic;
          req.session.msg = 'Authenticated as ' + user.username;
          req.session.color = user.color;
          res.redirect('/');
        });
      }
      else {
        err = 'Authentication failed.';
      }
      if (err) {
        req.session.regenerate(function() {
          req.session.msg = err;
          res.redirect('/login');
        });
      }
    });
};
exports.getUserProfile = function(req, res) {
  User.findOne({ _id: req.session.user })
    .exec(function(err, user) {
      if (!user) {
        res.json(404, { err: 'User Not Found.' });
      }
      else {
        res.json(user);
      }
    });
};
exports.updateUser = function(req, res) {
  User.findOne({ _id: req.session.user })
    .exec(function(err, user) {
      user.set('email', req.body.email);
      user.set('color', req.body.color);
      user.save(function(err) {
        if (err) {
          res.sessor.error = err;
        }
        else {
          req.session.msg = 'User Updated.';
          req.session.color = req.body.color;
        }
        res.redirect('/user');
      });
    });
};
exports.deleteUser = function(req, res) {
  User.findOne({ _id: req.session.user })
    .exec(function(err, user) {
      if (user) {
        user.remove(function(err) {
          if (err) {
            req.session.msg = err;
          }
          req.session.destroy(function() {
            res.redirect('/login');
          });
        });
      }
      else {
        req.session.msg = "User Not Found!";
        req.session.destroy(function() {
          res.redirect('/login');
        });
      }
    });
};
exports.allUsers = function(req, res) {
  if (req.session.user) {
    User.find({}).exec(function(err, users) {
      res.json(users);
    })
  }
  else {
    res.status(403);
    res.send("Forbidden: You are not authorized to access this data");
  }
};

exports.allPosts = function(req, res) {
  Post.find({}).exec(function(err, posts) {
    res.json(posts);
  })
}

exports.userData = function(req, res) {
  if (req.session.user) {
    res.send(req.session.username);
  }
  else {
    res.redirect('/login');
  }
}
