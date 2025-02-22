import User from "../models/user.model";
import { NotFoundError } from "../utils/AppError";

export const getMeService = async (userId: string) => {
    const user = await User.findById(userId)
        .populate("currentWorkspace")
        .select("-password");
    if (!user) {
        throw new NotFoundError("User not found");
    }
    return { user };
};
