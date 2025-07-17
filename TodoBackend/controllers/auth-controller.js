// const User = require("../models/user");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const isProduction = process.env.NODE_ENV === "production";
// // Register
// const registerUser = async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password)
//     return res
//       .status(400)
//       .json({ success: false, message: "All fields required" });

//   try {
//     const userExists = await User.findOne({ $or: [{ email }, { username }] });
//     if (userExists)
//       return res
//         .status(400)
//         .json({ success: false, message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//     });

//     res
//       .status(201)
//       .json({ success: true, message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// // Login
// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1h",
//       }
//     );

//     console.log(token);
//     res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: isProduction,
//         sameSite: isProduction ? "None" : "Lax",
//       })
//       .json({
//         success: true,
//         message: "User logged in successfully",
//         user: {
//           id: user._id,
//           role: user.role,
//           email: user.email,
//         },
//       });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Internal Server Error" });
//   }
// };

// const logoutUser = async (req, res) => {
//   res.clearCookie("token").json({
//     success: true,
//     message: "User logged out successfully",
//   });
// };

// // Middlewareconst jwt = require("jsonwebtoken");

// // const authMiddleware = (req, res, next) => {
// //   const token = req.cookies.token;
// //   if (!token) {
// //     return res.status(401).json({ success: false, message: "Unauthorized" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = decoded; // Now you can access req.user.id, req.user.role
// //     next();
// //   } catch (err) {
// //     return res.status(401).json({ success: false, message: "Invalid token" });
// //   }
// // };

// const authMiddleware = async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized! Please log in.",
//     });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (e) {
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized! User",
//     });
//   }
// };
// module.exports = { registerUser, loginUser, logoutUser, authMiddleware };

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Check if production environment
const isProduction = process.env.NODE_ENV === "production";

// ============ Register User ============
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong during registration",
    });
  }
};

// ============ Login User ============
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong during login",
    });
  }
};

// ============ Logout User ============
const logoutUser = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
    })
    .status(200)
    .json({ success: true, message: "Logged out successfully" });
};

// ============ Auth Middleware ============
const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized. Please login." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
};
