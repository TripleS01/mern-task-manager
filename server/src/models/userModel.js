import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please add email"],
        unique: true,
        trim: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Please add a valid email"],
    },
    username: {
        type: String,
        required: [true, "Please add username!"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add password!"],
        minLength: 6,
    },
    photo: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "New user.",
    },
    role: {
        type: String,
        enum: ["user", "admin", "creator"],
        default: "user",
    },
    isVerified: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true, minimize: true });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;

    next();
});

const User = mongoose.model('User', userSchema);

export default User;