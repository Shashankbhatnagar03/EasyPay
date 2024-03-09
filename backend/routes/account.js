const express = require('express');
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');
const router = express.Router();



router.put('/add', authMiddleware, async (req, res) => {
    try {
      // Find the account associated with the user ID
      const account = await Account.findOne({ userId: req.userId });
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      // Update the account balance (for demonstration, we're adding a fixed amount)
      account.balance += 10000; // Add 10000 to the balance
      // Save the updated account
      await account.save();
      // Respond with the updated balance
      res.status(200).json({ balance: account.balance });
    } catch (error) {
      console.error("Error adding funds:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.get("/balance" ,authMiddleware, async (req ,res )=>{

    const account = await Account.findOne({
        userId : req.userId
    });

    res.status(200).json({
        balance:(account.balance/100)
    })

})

router.post("/transfer", authMiddleware, async (req, res) => {
   const session = await mongoose.startSession();

   session.startTransaction();

   
   const {amount ,to}=req.body;

   const account = await Account.findOne({userId: req.userId }).session(session);

   if(!account || (account.balance)/100 < amount || amount==0){
    await session.abortTransaction();

    return res.status(400).json({
        message : "Insufficient balance"
    });
   }

   const toAccount = await Account.findOne({userId:to}).session(session);

   if(!toAccount)
   {
    res.status(400).json({
        message:"Invalid account"
    });
   }

   await Account.updateOne({userId: req.userId} , {$inc:{balance: -amount*100}}).session(session);
   await Account.updateOne({userId: to} , {$inc:{balance: amount*100}}).session(session);


   await session.commitTransaction();
   res.json({
    message: " Tranfer Successful"
   });
});


module.exports = router;