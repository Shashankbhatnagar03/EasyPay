const express = require('express');
const {User,Account} = require("../db");
const app =express();
const zod = require("zod");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const JWT_SECRET = require('../config');
const { authMiddleware } = require('../middleware');
const router = express.Router();
const jwt = require('jsonwebtoken');
const signupSchema = zod.object({
    username : zod.string().email() ,
    firstName : zod.string(),
    lastName : zod.string(),
    password:zod.string() 
})
const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName:zod.string().optional(),
    lastName:zod.string().optional()
})

router.post('/signup', async (req, res) => {
    try {
        const body = req.body;
        const { success } = signupSchema.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Email already taken/Incorrect inputs"
            });
        }

        const user = await User.findOne({
            username: body.username
        });

        if (user) {
            return res.status(411).json({
                message: "Email already taken/Incorrect inputs"
            });
        }

        let hashedPassword = "";
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(body.password, salt);
            hashedPassword = hash;
        } catch (error) {
            console.error("Error hashing password:", error);
            return res.status(500).json({
                message: "Server error"
            });
        }

        const dbUser = await User.create({
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            password: hashedPassword
        });

        const balance = Math.floor(1 + Math.random() * 9999);
        await Account.create({
            userId: dbUser._id,
            balance: balance * 100
        });

        const token = jwt.sign({
            userId: dbUser._id
        }, JWT_SECRET);

        res.status(201).json({
            message: "User created successfully",
            token: token
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/signin", async (req, res) => {
    const body = req.body;
    const { success } = signinBody.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message: "Invalid inputs"
        });
        return;
    }

    try {
        const user = await User.findOne({ username: body.username });

        if (!user) {
            res.status(401).json({ message: "Invalid username or password" });
            return;
        }

        try {
            const result = await bcrypt.compare(body.password, user.password);
            if (result) {
                const token = jwt.sign({ userId: user._id }, JWT_SECRET);
                res.status(200).json({ token: token });
            } else {
                res.status(401).json({ message: "Invalid username or password" });
            }
        } catch (error) {
            console.error("Error comparing passwords:", error);
            res.status(500).json({ message: "Internal server error" });
        }
        
    } catch (error) {
        console.error("Error while signing in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/" ,authMiddleware, async (req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success)
    {
        res.status(411).json({
            message : "Error will updating information"
        })
    }

    await User.updateOne(req.body , {
        id:req.userId
    })

    res.status(200).json({
        message : "Updated Succesfully"
    })
})

router.get("/bulk" , async (req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})


router.get("/details", authMiddleware, async (req, res) => {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }
    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    });
  });
module.exports  = router;