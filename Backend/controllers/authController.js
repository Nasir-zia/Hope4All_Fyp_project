
import User from '../model/user_model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
  try {
  
    const { username, email, password, role } = req.body;

    // Validate input
    if (!username || !email || !password || !role) {
      console.log(' Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'All fields (username, email, password, role) are required' 
      });
    }

    // Check if user already exists by email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      console.log(' User with email already exists:', email);
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    // Check if user already exists by username
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      console.log(' User with username already exists:', username);
      return res.status(400).json({ success: false, message: 'User with this username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    console.log(' Attempting to save new user:', { username, email, role });
    await newUser.save();
    console.log(' User saved successfully:', newUser._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      user: { id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role, status: newUser.status }
    });
  } catch (error) {
    console.error(' Error registering user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error registering user', 
      error: error.message 
    });
  }
};


// Login user

export const login = async (req, res) => {
  try {
    console.log(' Login request received:', { email: req.body.email });

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log(' Missing email or password');
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error(' JWT_SECRET is not configured');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
    }

    // Special handling for admin login
    if (email === 'nasir171@gmail.com' && password === 'lakki123') {
      console.log(' Admin login detected');
      
      // Create admin user object
      const adminUser = {
        _id: 'admin-fixed-id',
        username: 'Admin',
        email: 'nasir171@gmail.com',
        role: 'admin'
      };

      // Generate JWT for admin
      const token = jwt.sign({ id: adminUser._id, role: adminUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      console.log(' Admin login successful');
      return res.status(200).json({
        success: true,
        message: 'Admin login successful',
        token,
        user: adminUser
      });
    }

    // Normal user authentication
    console.log(' Finding user by email:', email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log(' User not found:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Check password
    console.log(' Verifying password...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(' Password mismatch for:', email);
      return res.status(400).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT
    console.log(' Generating JWT token...');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      success: true, 
      message: 'Login successful', 
      token, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role, status: user.status } 
    });
  } catch (error) {
    console.error(' Error logging in:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error logging in', 
      error: error.message 
    });
  }
};


