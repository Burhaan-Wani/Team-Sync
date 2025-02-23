import mongoose, { Schema } from "mongoose";
import { ProviderEnumType, ProviderEnum } from "../enums/providerEnum";
import User from "../models/user.model";
import Workspace from "../models/workspace.model";
import Account from "../models/account.model";
import Role from "../models/rolePermissions.model";
import Member from "../models/member.model";
import { Roles } from "../enums/roleEnum";
import AppError, { BadRequestError, NotFoundError } from "../utils/AppError";

export type loginOrCreateAccountServiceType = {
    provider: ProviderEnumType;
    providerId: string;
    name: string;
    picture?: string;
    email: string;
};

export type RegisterUserServiceType = {
    name: string;
    email: string;
    password: string;
};

// Google login service
export const loginOrCreateAccountService = async (
    data: loginOrCreateAccountServiceType
) => {
    const { name, email, picture, provider, providerId } = data;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        let user = await User.findOne({ email }).session(session);
        if (!user) {
            // create new user if it doesn't exist
            user = new User({
                email,
                name: name,
                profilePicture: picture || null,
            });
            await user.save({ session });

            // create account as well for the google signup user
            const account = new Account({
                userId: user._id,
                provider,
                providerId,
            });
            await account.save({ session });

            // create a workspace for the login or signup
            const workspace = new Workspace({
                name: "My Workspace",
                description: `Workspace created for ${user.name}`,
                owner: user._id,
            });
            await workspace.save({ session });

            // check for the role
            const ownerRole = await Role.findOne({
                name: Roles.OWNER,
            }).session(session);
            if (!ownerRole) {
                throw new AppError("Owner role not found", 404);
            }

            // if role exists then assign a role to login/signup user
            const member = new Member({
                userId: user._id,
                workspaceId: workspace._id,
                role: ownerRole._id,
                joinedAt: new Date(),
            });
            await member.save({ session });

            user.currentWorkspace = workspace._id as Schema.Types.ObjectId;
            await user.save({ session });
        }
        await session.commitTransaction();
        session.endSession();
        return { user };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// register
export const registerUserService = async (data: RegisterUserServiceType) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { name, email, password } = data;

        const existsUser = await User.findOne({ email }).session(session);
        if (existsUser) {
            throw new BadRequestError("User with this email already exists");
        }

        const user = new User({
            name,
            email,
            password,
        });
        await user.save({ session });

        const account = new Account({
            provider: ProviderEnum.EMAIL,
            providerId: email,
            userId: user._id,
        });
        await account.save({ session });

        const workspace = new Workspace({
            name: "My Workspace",
            description: `Workspace created for ${user.name}`,
            owner: user._id,
        });
        await workspace.save({ session });

        const role = await Role.findOne({ name: Roles.OWNER }).session(session);
        if (!role) {
            throw new NotFoundError("Owner role not found");
        }

        const member = new Member({
            userId: user._id,
            workspaceId: workspace._id,
            role: role._id,
        });
        await member.save({ session });
        user.currentWorkspace = workspace._id as Schema.Types.ObjectId;
        await user.save({ session });

        session.commitTransaction();
        session.endSession();
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Local login service
export const verifyUserService = async ({
    email,
    password,
    provider = ProviderEnum.EMAIL,
}: {
    email: string;
    password: string;
    provider?: string;
}) => {
    try {
        const account = await Account.findOne({
            provider,
            providerId: email,
        });
        if (!account) {
            throw new NotFoundError("User not found for the given account");
        }

        const user = await User.findById(account.userId);

        if (!user) {
            throw new NotFoundError("User not found for the given account");
        }
        const isMatch = await user.comparePassword(password as string);

        if (!isMatch) {
            throw new BadRequestError("Invalid email or password");
        }

        return user.omitPassword();
    } catch (error) {
        throw error;
    }
};
