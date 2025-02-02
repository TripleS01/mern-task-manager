import User from "../../models/auth/UserModel.js";

export const getUser = async (request, response) => {
    const user = await User.findById(request.user._id).select("-password");

    if (user) {
        response.status(200).json(user);
    } else {
        response.status(404).json({ message: "User not found" });
    }
};

// update user
export const updateUser = async (request, response) => {
    const user = await User.findById(request.user._id);

    if (user) {
        const { name, bio, photo } = request.body;

        user.name = request.body.name || user.name;
        user.bio = request.body.bio || user.bio;
        user.photo = request.body.photo || user.photo;

        const updated = await user.save();

        response.status(200).json({
            _id: updated._id,
            name: updated.name,
            email: updated.email,
            role: updated.role,
            photo: updated.photo,
            bio: updated.bio,
            isVerified: updated.isVerified,
        });
    } else {
        response.status(404).json({ message: "User not found" });
    }
};