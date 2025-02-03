import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, 
        email: { type: String, required: true, unique: true }, 
        password: { type: String, required: true }, 
        verifyOtp: { type: String, default: '' }, 
        verifyOtpExpireAt: { type: Number, default: 0 }, 
        isAccountVerified: { type: Boolean, default: false }, 
        resetOtp: { type: String, default: '' }, 
        resetOtpExpireAt: { type: Date, default: null }, 
    },
    {
        timestamps: true, // Auto-manages `createdAt` and `updatedAt`
    }
);

// Prevent model recompilation in development
const userModel = mongoose.models.User || mongoose.model('user', userSchema);

export default userModel;
