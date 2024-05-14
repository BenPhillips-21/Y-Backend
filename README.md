# 'Y' Social Media Application Docs

[Frontend Repository](https://github.com/BenPhillips-21/Y-Frontend)

Developed by **Benjamin Phillips**

## Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Built With](#built-with)
- [Authentication](#authentication)
- [API Routes](#api-routes)

## About The Project

Social media website in the vein of 'X' (formerly Twitter). Completed as the final project in the Node.js portion of 'The Odin Project' Full Stack Web Development course.

### Key Features

#### RESTful Architecture

The backend for Y is designed following RESTful principles, which means it uses standard HTTP methods (GET, POST, PUT, DELETE) to perform CRUD (Create, Read, Update, Delete) operations on resources. Each resource is identified by a unique URL, and responses are typically formatted in JSON.

#### JWT-based Authentication and Authorization
Y implements JWT-based authentication and authorization using Passport.js. This approach allows users to securely authenticate and access protected resources. When a user logs in, the server issues a JSON Web Token (JWT) that is then stored in the frontend. This token is used to authenticate subsequent requests to protected routes.

#### Image Storage using Cloudinary
For image storage, Y utilizes Cloudinary, a cloud-based media management platform. By integrating Cloudinary, the app can efficiently handle media assets, such as profile pictures and post images.

#### User Profile Management
The API includes comprehensive user profile management features. Users can update their profiles, including profile pictures, usernames, and their bio. Profile data is stored securely in the database and can be accessed and modified through RESTful endpoints.

#### Post Management
Y supports comprehensive post management functionalities. Users can create new posts, comment on posts, and view post histories. This feature allows for dynamic interaction and content sharing within the community, enhancing user engagement and connectivity.

#### Integration with Frontend Client
The backend API seamlessly integrates with the frontend client, enabling a responsive and interactive user experience. This integration enhances user engagement and responsiveness within Y.

## Built With

##### - MongoDB
##### - Express.js
##### - Node.js

## Authentication

Y utilizes JSON Web Tokens (JWTs) to authenticate requests for protected routes. Upon successful login, an access token in the format "Bearer <token>" is issued to the client. This token must be included in the Authorization header of subsequent requests to access protected routes.

Login URL: https://y-alpha-beige.vercel.app/login

POST /login

Body Parameters:
    - username
    - password

Returns:

```
{
  "success": true,
  "message": "Authentication successful",
  "token": (( 188 Character String ))
}

```

## API Routes

Once the user has logged in, they can use the various routes to make posts, see other user posts, update their profile etc.

Backend Base URL: https://y-alpha-beige.vercel.app

GET All Users

/getallusers

Returns
```
[
    {
        "profilePic": {
            "public_id": "fauxru9124f4ty1vvfdk",
            "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1715129724/fauxru9124f4ty1vvfdk.jpg"
        },
        "_id": "66319d9fd45ecf051475a87e",
        "username": "SIUUUU"
    },
    {
        "profilePic": {
            "public_id": "fh14w5zwu4oyhvcs2adw",
            "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1713316628/fh14w5zwu4oyhvcs2adw.png"
        },
        "_id": "6631a808e6c173c39450e02c",
        "username": "speed2"
    },
    etc
]
```

GET My Profile

/myprofile

Returns 
```
{
    "profilePic": {
        "public_id": "ggidu9dsyzboncb4e1jc",
        "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1715128715/ggidu9dsyzboncb4e1jc.jpg"
    },
    "_id": "6631c622082c68d89ae85ec1",
    "username": "RONALDO",
    "password": "$2a$10$cps7wbRwbixLeV.vSZCsDeSzBIAmArZJsgSnhIjb4SNdqBkQONwoa",
    "bio": "SIUUUUUUUUUUU",
    "friends": [Array of friends],
    "friendRequests": [Array of friend requests],
    "sentFriendRequests": [Array of sent friend requests"],
    "posts": [Array of posts],
    "admin": Boolean
}
```

POST Update Username

/updateusername

Body Parameters:
```
{
    "username": "newUsername"
}
```

Returns the updated user object with a success message.

POST Update Bio
/updatebio

Body Parameters:
```
{
    "bio": "new updated bio!!"
}
```

Returns the updated user object with a success message.

POST Update Profile Picture
Body Parameters: The request body must be sent as form-data.
```
Content-Type: multipart/form-data
image: (attach picture file here)
```
Returns the updated user object with a success message.

GET Other User

/getuser/:userid

Returns 
```
{
    "profilePic": {
        "public_id": "ggidu9dsyzboncb4e1jc",
        "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1715128715/ggidu9dsyzboncb4e1jc.jpg"
    },
    "_id": "6631c622082c68d89ae85ec1",
    "username": "RONALDO",
    "bio": "SIUUUUUUUUUUU",
    "friends": [Array of friends],
    "friendRequests": [Array of friend requests],
    "sentFriendRequests": [Array of sent friend requests"],
    "posts": [Array of posts],
    "admin": Boolean
}
```

GET Friend Requests

/friendrequests

Returns an array of users which the user is friends with.

GET Send Friend Request

/sendfriendrequest/:userid

If not already friends with user...
Returns
```
{
    "success": true,
    "msg": "Friend request sent successfully"
}
```
else 
Returns 
```
"User already requested"
```

GET Sent Friend Requests

/sentfriendrequests

Returns an array of users which have been sent a friend request from the user.

GET Send Friend Request

/acceptfriendrequest/:userid

Returns 
```
"Friend request accepted"
```

GET My Friends

/myfriends

Returns an array of users which are friends with the user.

GET All Posts

/getposts

Returns an array of all the user's posts and all of the user's friend's posts.

POST Create Post

/createpost

Returns
```
{
    "success": true,
    "message": "Post saved!",
    "newPost": {
        "poster": "6642e5c06c3804fdb5bb49d1",
        "postContent": "post content !!! ",
        "dateSent": "2024-05-14T11:36:50.029Z",
        "likes": [],
        "comments": [],
        "image": {
            "url": "https://res.cloudinary.com/dlsdasrfa/image/upload/v1715686609/ql3urpf3nddtcxvrcges.jpg"
        },
        "_id": "66434cd235239b7ec0f194e8",
        "__v": 0
    }
}
```

GET Like Post

/likepost/:postid

Returns 
```
{
    "success": true,
    "msg": "Post liked successfully"
}
```

GET Delete Post

/deletepost/:postid

Returns
```
{
    "success": true,
    "msg": "Post deleted successfully"
}
```

POST Create Comment

/postcomment/:postid

Returns
```
{
  "success": true,
  "message": "Comment saved!",
  {(the comment object)}
}
```

POST Delete Comment

/deletecomment/:postid/:commentid

Returns
```
{
success: true,
msg: "comment deleted successfully"
}
```





