const express = require('express')

const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const twilio = require('twilio')
const User = require('../models/User')

// Register - New Route
router.post('/register', async (req, res) => {
  try {
    const {username, password, phoneNumber} = req.body

    if (!username || !password || !phoneNumber) {
      res.status(400).json({error_msg: 'Please provide all fields'})
      return
    }

    // Check if user already exists
    let user = await User.findOne({username})
    if (user) {
      res.status(400).json({error_msg: 'User already exists'})
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    user = new User({
      username,
      password: hashedPassword,
      phoneNumber,
    })

    await user.save()
    res.json({message: 'User registered successfully'})
  } catch (err) {
    console.error(err.message)
    res.status(500).json({error_msg: 'Server Error'})
  }
})

// Initialize Twilio - only if valid SID present
let client
if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_ACCOUNT_SID.startsWith('AC')
) {
  client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
} else {
  console.warn(
    'TWILIO_ACCOUNT_SID is missing or invalid. OTP SMS will not be sent.',
  )
}

// Initiate Login - Step 1: Check Credentials & Send OTP
router.post('/login', async (req, res) => {
  try {
    const {username, password} = req.body

    if (!username || !password) {
      res.status(400).json({error_msg: 'Invalid Request'})
      return
    }

    const user = await User.findOne({username})
    if (!user) {
      res.status(400).json({error_msg: 'Invalid Username'})
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({error_msg: 'Invalid Password'})
      return
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

    // Save OTP to user
    user.otp = otp
    user.otpExpiry = otpExpiry
    await user.save()

    // Send OTP via Twilio if configured
    try {
      if (client) {
        await client.messages.create({
          body: `Hi ${user.username}, your Nxt Trends OTP is: ${otp}. It will expire in 5 minutes.`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phoneNumber,
        })
        console.log(`OTP ${otp} sent to ${user.phoneNumber} via Twilio`)
      } else {
        console.log(
          `[DEV MODE] Twilio not configured. OTP for ${user.username} is: ${otp}`,
        )
      }
      res.json({
        message: 'OTP Sent Successfully',
        mfa_required: true,
        username: user.username,
      })
    } catch (twilioError) {
      console.error(
        'Twilio Error (Status:',
        twilioError.status,
        '):',
        twilioError.message,
      )
      // For development, if twilio fails, we'll still log the OTP in terminal so you can continue
      console.log(
        `[FALLBACK] Twilio failed, but here is your OTP for ${user.username}: ${otp}`,
      )
      res.status(500).json({error_msg: `Twilio Error: ${twilioError.message}`})
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({error_msg: 'Server Error'})
  }
})

// Verify OTP - Step 2: Check OTP & Return JWT
router.post('/verify-otp', async (req, res) => {
  try {
    const {username, otp} = req.body

    if (!username || !otp) {
      res.status(400).json({error_msg: 'Invalid Request'})
      return
    }

    const user = await User.findOne({username})
    if (!user) {
      res.status(400).json({error_msg: 'Invalid User'})
      return
    }

    // Check if OTP is valid and not expired
    if (user.otp === otp && user.otpExpiry > new Date()) {
      // OTP is correct - Clear it and return token
      user.otp = undefined
      user.otpExpiry = undefined
      await user.save()

      const payload = {
        user: {id: user.id},
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET || 'supersecretjwtkey_12345',
        {expiresIn: '30d'},
        (err, token) => {
          if (err) throw err
          res.json({jwt_token: token})
        },
      )
      return
    }
    res.status(400).json({error_msg: 'Invalid or Expired OTP'})
  } catch (err) {
    console.error(err.message)
    res.status(500).json({error_msg: 'Server Error'})
  }
})

module.exports = router
