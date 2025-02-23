import mongoose, { Schema } from "mongoose";
import { Roles } from "../enums/roleEnum";
import Member from "../models/member.model";
import Role from "../models/rolePermissions.model";
import User from "../models/user.model";
import Workspace from "../models/workspace.model";
import { BadRequestError, NotFoundError } from "../utils/AppError";
import Project from "../models/project.model";
import Task from "../models/task.model";
import { TaskStatusEnum } from "../enums/taskStatusEnumType";

export type createWorkspaceServiceType = {
    userId: string;
    body: {
        name: string;
        description?: string;
    };
};

export const getMemberRoleInWorkspace = async (
    userId: string,
    workspaceId: string
) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            throw new NotFoundError("Workspace not found");
        }

        const member = await Member.findOne({
            workspaceId,
            userId,
        }).populate("role");

        if (!member) {
            throw new NotFoundError("You are not a member of this workspace");
        }

        return { role: member?.role.name };
    } catch (error) {
        throw error;
    }
};

export const createWorkspaceService = async (
    body: createWorkspaceServiceType
) => {
    try {
        const {
            userId,
            body: { name, description },
        } = body;
        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const existsWorkspace = await Workspace.findOne({
            name,
            owner: user._id,
        });
        if (existsWorkspace) {
            throw new BadRequestError("Workspace already exists.");
        }

        const workspace = new Workspace({
            name,
            description: description || null,
            owner: user._id,
        });
        await workspace.save();

        const ownerRole = await Role.findOne({ name: Roles.OWNER });
        if (!ownerRole) {
            throw new NotFoundError("Owner role not found");
        }

        const member = new Member({
            userId,
            workspaceId: workspace._id,
            role: ownerRole._id,
        });
        await member.save();

        user.currentWorkspace = workspace._id as Schema.Types.ObjectId;
        await user.save();

        return { workspace };
    } catch (error) {
        throw error;
    }
};

export const getWorkspaceService = async (workspaceId: string) => {
    try {
        const workspace = await Workspace.findById(workspaceId);

        const members = await Member.find({ workspaceId }).populate("role");

        const workspaceWithMembers = {
            ...workspace?.toObject(),
            members,
        };

        return { workspace: workspaceWithMembers };
    } catch (error) {
        throw error;
    }
};

export const updateWorkspaceService = async (
    workspaceId: string,
    body: {
        name: string;
        description?: string;
    }
) => {
    try {
        const updatedWorkspace = await Workspace.findByIdAndUpdate(
            workspaceId,
            body,
            { new: true }
        );

        return { workspace: updatedWorkspace };
    } catch (error) {
        throw error;
    }
};

export const deleteWorkspaceService = async (
    workspaceId: string,
    userId: string
) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        let user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        await Project.deleteMany({ workspaceId }).session(session);
        await Member.deleteMany({ workspaceId }).session(session);
        await Task.deleteMany({ workspaceId }).session(session);
        if (`${user?.currentWorkspace}` === workspaceId.toString()) {
            const memberWorkspace = await Member.findOne({ userId }).session(
                session
            );
            user.currentWorkspace = memberWorkspace
                ? memberWorkspace.workspaceId
                : null;
            await user.save({ session });
        }
        await Workspace.deleteOne({ _id: workspaceId }).session(session);
        session.commitTransaction();
        session.endSession();
    } catch (error) {
        session.abortTransaction();
        session.endSession();
        throw error;
    }
};

export const changeMemberRoleInWorkspaceService = async (
    workspaceId: string,
    body: { memberId: string; roleId: string }
) => {
    try {
        const { memberId, roleId } = body; // memberId == userId
        const member = await Member.findOne({ userId: memberId, workspaceId });

        if (!member) {
            throw new NotFoundError("Member not found in this workspace");
        }

        const role = await Role.findById(roleId);
        if (!role) {
            throw new NotFoundError("Role not found");
        }

        member.role = role;
        await member.save();
        return { member };
    } catch (error) {
        throw error;
    }
};

export const getWorkspaceMembersService = async (workspaceId: string) => {
    try {
        const members = await Member.find({ workspaceId })
            .populate("userId", "name email profilePicture -password")
            .populate("role", "name");

        const roles = await Role.find({}, { name: 1, _id: 1 })
            .select("-permissions")
            .lean();

        return { members, roles };
    } catch (error) {
        throw error;
    }
};

export const getWorkspacesWhereUserIsMemberService = async (userId: string) => {
    try {
        const memberships = await Member.find({ userId })
            .populate("workspaceId")
            .select("-password")
            .exec();

        const workspaces = memberships.map(
            membership => membership.workspaceId
        );
        return { workspaces };
    } catch (error) {
        throw error;
    }
};

export const getWorkspaceAnalyticsService = async (workspaceId: string) => {
    try {
        const currentDate = new Date();

        const totalTasks = await Task.countDocuments({
            workspaceId,
        });

        const overdueTasks = await Task.countDocuments({
            workspaceId,
            dueDate: { $lt: currentDate },
            status: { $ne: TaskStatusEnum.DONE },
        });
        const completedTasks = await Task.countDocuments({
            workspaceId,
            status: TaskStatusEnum.DONE,
        });

        const analytics = {
            totalTasks,
            overdueTasks,
            completedTasks,
        };
        return { analytics };
    } catch (error) {
        throw error;
    }
};
