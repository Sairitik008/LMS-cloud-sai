const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, bio, educationalBackground, skills, hobbies, socialLinks } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'student',
    bio,
    educationalBackground,
    skills,
    hobbies,
    socialLinks: socialLinks || { github: '', hackerrank: '', linkedin: '' },
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      educationalBackground: user.educationalBackground,
      skills: user.skills,
      hobbies: user.hobbies,
      socialLinks: user.socialLinks,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      educationalBackground: user.educationalBackground,
      skills: user.skills,
      hobbies: user.hobbies,
      socialLinks: user.socialLinks,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    
    if (req.body.bio !== undefined) user.bio = req.body.bio;
    if (req.body.educationalBackground !== undefined) user.educationalBackground = req.body.educationalBackground;
    
    if (req.body.skills !== undefined) {
      if (typeof req.body.skills === 'string') {
        try { user.skills = JSON.parse(req.body.skills); } 
        catch (e) { user.skills = req.body.skills.split(',').map(s => s.trim()).filter(Boolean); }
      } else { user.skills = req.body.skills; }
    }

    if (req.body.hobbies !== undefined) {
      if (typeof req.body.hobbies === 'string') {
        try { user.hobbies = JSON.parse(req.body.hobbies); } 
        catch (e) { user.hobbies = req.body.hobbies.split(',').map(s => s.trim()).filter(Boolean); }
      } else { user.hobbies = req.body.hobbies; }
    }

    if (req.body.socialLinks !== undefined) {
      if (typeof req.body.socialLinks === 'string') {
        try { user.socialLinks = JSON.parse(req.body.socialLinks); }
        catch (e) { /* fallback ignored */ }
      } else {
        user.socialLinks = { ...user.socialLinks, ...req.body.socialLinks };
      }
    }

    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Update avatar if new file provided via Cloudinary upload
    if (req.file) {
      user.avatar = req.file.path;
    } else if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      educationalBackground: updatedUser.educationalBackground,
      skills: updatedUser.skills,
      hobbies: updatedUser.hobbies,
      socialLinks: updatedUser.socialLinks,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
