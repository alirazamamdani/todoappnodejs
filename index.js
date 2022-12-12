const express = require("express");
const app = express();
const PORT = 5000;
const cors = require("cors");
const mongoose = require("mongoose");
const body = require("body-parser");
const TodoModels = require("./Models/TodoModels");
const { userAuthSchema } = require("./Models/UserModel");
const bcrypt = require("bcryptjs");
const jwtToken = require("jsonwebtoken");
const middlewares = require("./Middleware/middleware");

app.use(cors());
app.use(express.json());
const baseURI =
  "mongodb+srv://admin2:admin12345@cluster1.2qtzrhd.mongodb.net/jawanPakistanBackend";

mongoose
  .connect(baseURI)
  .then(() => console.log("mongo connect"))
  .catch(() => console.log("not connect"));
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    res.json({
      message: "all fields required",
    });
    return;
  }
  const hashpassword = await bcrypt.hash(password, 10);
  let signupData = {
    firstname: firstName,
    lastname: lastName,
    email: email,
    password: hashpassword,
  };
  userAuthSchema.findOne({ email }, (error, user) => {
    if (error) {
      res.json({
        message: "Something went wrong!!!!",
      });
    } else {
      if (user) {
        res.json({
          message: "User Email Already Exist",
        });
      } else {
        userAuthSchema.create(signupData, (error, response) => {
          if (error) {
            res.json({
              message: "Something went wrong!!",
              error,
            });
          } else {
            res.json({
              message: "User Successfully Register",
              response,
              isExecuted: true,
            });
          }
        });
      }
    }
  });
});
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  userAuthSchema.findOne({ email }, async (error, data) => {
    if (error) {
      res.json({
        message: "user not exist",
      });
    } else {
      let hashpassowrdCompare = await bcrypt.compare(password, data.password);
      if (hashpassowrdCompare) {
        const tokenObj = {
          ...data,
        };
        const token = jwtToken.sign(tokenObj, "authapp");
        res.json({
          message: "User has successfully login",
          data,
          token,
          isExecuted: true,
        });
      } else {
        res.json({
          message: "Credentials Error",
        });
      }
    }
  });
});
app.get("/", (req, res) => {
  res.send("Hello");
  console.log("Hello this is route");
});
app.get("/api/alltodo", middlewares.authMiddleware, (req, res) => {
  TodoModels.find({}, (error, data) => {
    if (error) {
      res.json(error);
    } else {
      res.json({
        message: `all get data ${data.length} `,
        data,
      });
    }
  });
});
app.post("/api/gettodo", middlewares.authMiddleware, (req, res) => {
  console.log(req);
  let id = { _id: "63960ec7e02b1d852f1074df" };
  TodoModels.find(id, (error, todo) => {
    if (error) {
      res.json(error);
    } else {
      res.json({
        message: `Todo Found `,
        todo,
      });
    }
  });
});
app.put("/api/todo/:id", middlewares.authMiddleware, (req, res) => {
  console.log(req.body);
  let data = req.body;
  let id = req.params.id;
  TodoModels.findOneAndUpdate(id, data, { new: true }, (error, data) => {
    if (error) {
      res.json(error);
    } else {
      res.json({
        message: "update done",
        data,
      });
    }
  });
});
app.post("/api/todo", middlewares.authMiddleware, (req, res) => {
  console.log(req.body);
  let body = req.body;
  TodoModels.create(body, (error, data) => {
    if (error) {
      res.json(error);
    } else {
      res.send({
        message: "Todo Item add successfully",
        data,
      });
    }
  });
});
app.delete("/api/todo/:id", middlewares.authMiddleware, (req, res) => {
  let id = req.params.id;
  TodoModels.findByIdAndDelete(id, (error, data) => {
    if (error) {
      res.json(error);
    } else {
      res.json({
        message: "Successfully Delete",
        data,
      });
    }
  });
});
app.post("/test", middlewares.authMiddleware, (req, res) => {
  res.send("Api Hit");
});
app.listen(PORT, () => console.log(`Your Server is Running ${PORT}`));
