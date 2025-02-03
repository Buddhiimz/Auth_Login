import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

// Register a new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all required fields are provided
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  // Validate email format using regex (optional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid email format" });
  }

  try {
    // Check if the email is already registered
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token in the response cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevent JavaScript access to the token
      secure: process.env.NODE_ENV === "production", // Ensure the cookie is only sent over HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // SameSite policy to prevent CSRF
      maxAge: 3600000, // Set cookie expiration to 1 hour
    });

    // Sending a welcome email to the user
    const mailOptions = {
      from: '"Buddhimz Support" <' + process.env.SENDER_EMAIL + ">",
      to: email,
      subject: "Welcome to Buddhimz",
      html: `
                <html>
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <!-- Header image with publicly hosted URL -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="https://vrofile-poto.s3.us-east-1.amazonaws.com/photo_2025-01-22_22-19-57.jpg" alt="Buddhimz Logo" style="width: 200px; height: auto; border-radius: 4px;" />
                            </div>
                            <!-- Welcome message -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <p style="font-size: 16px; color: #333;">Welcome to <strong>Buddhimz</strong>! Your account has been created with Email ID: <strong>${email}</strong>.</p>
                            </div>
                            <!-- Thank you message -->
                            <div style="text-align: center;">
                                <p style="font-size: 14px; color: #555;">Thank you for joining us.</p>
                                <p style="font-size: 14px; color: #555;">Best regards,<br>Team Buddhimz</p>
                            </div>
                        </div>
                    </body>
                </html>`,
    };

    try {
      // Attempt to send the email
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      // Log the error and return a response if email fails to send
      console.error("Error sending email:", mailError);
      return res.status(500).json({
        success: false,
        message: "User registered, but email could not be sent",
        error: mailError.message || mailError,
      });
    }

    // Respond to the client indicating that the user has been successfully registered
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    // Catch any server-side errors during the registration process
    console.error("Error in registration process:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

// Login the user
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    // Check if a user with the provided email exists in the database
    const user = await userModel.findOne({ email });
    if (!user) {
      // If the email is not found, return an 'Invalid email' error
      return res.status(401).json({
        success: false,
        message: "Invalid email.",
      });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // If the password does not match, return an 'Invalid password' error
      return res.status(401).json({
        success: false,
        message: "Invalid password.",
      });
    }

    // Generate a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as a cookie in the response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 3600000, // Cookie expiry time: 1 hour
    });

    // Return a success response for a successful login
    return res.status(200).json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    // Log the error and return a generic server error message
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Logout the user
export const logout = (req, res) => {
  try {
    // Clear the token cookie securely
    res.clearCookie("token", {
      httpOnly: true, // Protect against client-side JavaScript accessing the cookie
      secure: process.env.NODE_ENV === "production", // Ensure the cookie is only sent over HTTPS in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Cross-site request protection
    });

    // Send a response confirming logout
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Logout error:", error);

    // Return a server error response
    return res.status(500).json({
      success: false,
      message: "An error occurred during logout. Please try again.",
    });
  }
};

// Send OTP to verify Email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await userModel.findById(userId);

    // Check if the user is already verified
    if (user.isAccountVerified) {
      return res
        .status(200)
        .json({ success: false, message: "Account is already verified" });
    }

    // Generate a random 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save OTP and expiration time in the user document
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // Email configuration
    const mailOption = {
      from: '"Buddhimz Support" <' + process.env.SENDER_EMAIL + ">",
      to: user.email,
      subject: "Verify your account",
      html: `
                <html>
                    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="https://vrofile-poto.s3.us-east-1.amazonaws.com/photo_2025-01-22_22-19-57.jpg" alt="Buddhimz Logo" style="width: 200px; height: auto; border-radius: 4px;" />
                            </div>
                            <div style="text-align: center; margin-bottom: 20px;">
                                <p style="font-size: 16px; color: #333;">Your verification OTP is:</p>
                                <p style="font-size: 24px; color: #007BFF; font-weight: bold;">${otp}</p>
                                <p style="font-size: 14px; color: #555;">Please verify your account within <strong>10 minutes</strong>.</p>
                            </div>
                            <div style="text-align: center;">
                                <p style="font-size: 14px; color: #555;">Thank you for choosing Buddhimz.</p>
                                <p style="font-size: 14px; color: #555;">Best regards,<br>Team Buddhimz</p>
                            </div>
                        </div>
                    </body>
                </html>
            `,
    };

    // Send the email
    await transporter.sendMail(mailOption);

    // Respond to the client with a success message
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      email: user.email,
      otpSent: true, // Optional, for debugging or testing purposes
    });
  } catch (error) {
    // Respond with an error message
    return res.status(500).json({
      success: false,
      message: "An error occurred while sending OTP",
      error: error.message,
    });
  }
};

// Verify the Email using OTP
export const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;

  // Check if userId and OTP are provided
  if (!userId || !otp) {
    return res.status(400).json({
      success: false,
      message: "Missing details: userId and OTP are required",
    });
  }

  try {
    // Fetch the user by ID
    const user = await userModel.findById(userId);

    // Check if the user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the OTP matches and hasn't expired
    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Mark the account as verified
    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    // Save the user record
    await user.save();

    // Send a confirmation email
    const mailOptions = {
      from: '"Buddhimz Support" <' + process.env.SENDER_EMAIL + ">",
      to: user.email,
      subject: "Your Account is Verified",
      html: `
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
                        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                            <!-- Header image with publicly hosted URL -->
                            <div style="text-align: center; margin-bottom: 20px;">
                                <img src="https://vrofile-poto.s3.us-east-1.amazonaws.com/photo_2025-01-22_22-19-57.jpg" alt="Buddhimz Logo" style="width: 200px; height: auto; border-radius: 4px;" />
                            </div>

                            <!-- Email Body Content -->
                            <div style="padding: 20px;">
                                <p style="font-size: 16px; color: #333;">Dear <strong>${user.name} </strong>,</p>
                                <p style="font-size: 16px; color: #333;">
                                  <strong>Congratulations!</strong> Your account has been successfully verified.
                                </p>
                                <p style="font-size: 16px; color: #333;">
                                Thank you for being a part of Buddhimz. We’re excited to have you on board!
                                </p>
                            </div>

                            <!-- Footer -->
                            <div style="text-align: left;">
                                <p style="font-size: 14px; color: #555;">
                                    Warm regards,<br>Team Buddhimz.
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>
            `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (mailError) {
      console.error("Error sending email:", mailError);
      return res.status(500).json({
        success: false,
        message: "Email verified, but confirmation email could not be sent",
        error: mailError.message || mailError,
      });
    }

    // Respond to the client indicating success
    return res.status(200).json({
      success: true,
      message: "Email verified successfully. Confirmation email sent.",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error during email verification:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
};

// Check if user is Authenticated
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true });
  } catch (error) {
    res, json({ success: false, message: "Server error: " + error.message });
  }
};

// Send OTP to reset password
export const sendResetOtp = async (req, res) => {
  const { email } = req.body; // Extract the email from the request body

  // Check if email is provided in the request
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    // Find the user by email in the database
    const user = await userModel.findOne({ email });

    // If user does not exist, return an error response
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Generate a 6-digit random OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Save the OTP and expiration time in the user's document
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Email configuration
    const mailOption = {
      from: `"Buddhimz Support" <${process.env.SENDER_EMAIL}>`, // Sender's email
      to: user.email, // Recipient's email
      subject: "Password Reset OTP", // Subject line
      html: `
              <html>
                  <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                          <div style="text-align: center; margin-bottom: 20px;">
                              <img src="https://vrofile-poto.s3.us-east-1.amazonaws.com/photo_2025-01-22_22-19-57.jpg" alt="Buddhimz Logo" style="width: 200px; height: auto; border-radius: 4px;" />
                          </div>
                          <div style="text-align: center; margin-bottom: 20px;">
                              <p style="font-size: 16px; color: #333;">Your OTP for resetting your password is:</p>
                              <p style="font-size: 24px; color: #007BFF; font-weight: bold;">${otp}</p>
                              <p style="font-size: 14px; color: #555;">Use this OTP to reset your password. It is valid for <strong>10 minutes</strong>.</p>
                          </div>
                          <div style="text-align: center;">
                              <p style="font-size: 14px; color: #555;">Best regards,<br>Team Buddhimz</p>
                          </div>
                      </div>
                  </body>
              </html>
          `,
    };

    // Send the email using the configured transporter
    await transporter.sendMail(mailOption);

    // Respond with success message
    return res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    // Handle any errors during the process
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};

// Reset User Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body; // Extract email, OTP, and new password from the request body

  // Validate required fields
  if (!email || !otp || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });
  }

  try {
    // Find the user by email in the database
    const user = await userModel.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Validate the OTP
    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    // Check if the OTP has expired
    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password and reset OTP fields
    user.password = hashedPassword;
    user.resetOtp = ""; // Clear the OTP
    user.resetOtpExpireAt = 0; // Reset the expiration time

    // Save the updated user document
    await user.save();

    // Respond with success message
    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    // Handle any errors during the process
    return res.json({
      success: false,
      message: `Server error: ${error.message}`,
    });
  }
};
