import User from "../models/userModel.js";

export const getUser = async (request, response) => {

    try {
        const user = await User.findById(request.user._id).select("-password");

        if (user) {
            response.status(200).json(user);
        } else {
            response.status(404).json({ message: "User not found" });
        }

    } catch (error) {
        console.log("Error in getUser controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};

export const updateUser = async (request, response) => {

    try {
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

    } catch (error) {
        console.log("Error in updateUser controller: ", error.message);
        response.status(500).json({ message: error.message });
    }
};