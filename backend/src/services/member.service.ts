import { Roles } from "../enums/roleEnum";
import Member from "../models/member.model";
import Role from "../models/rolePermissions.model";
import Workspace from "../models/workspace.model";
import { NotFoundError } from "../utils/AppError";

export const joinWorkspaceByInviteService = async (
    userId: string,
    inviteCode: string
) => {
    // Find workspace by invite code
    const workspace = await Workspace.findOne({ inviteCode }).exec();
    if (!workspace) {
        throw new NotFoundError("Invalid invite code or workspace not found");
    }

    // Check if user is already a member
    const existingMember = await Member.findOne({
        userId,
        workspaceId: workspace._id,
    }).exec();

    if (existingMember) {
        throw new NotFoundError("You are already a member of this workspace");
    }

    const role = await Role.findOne({ name: Roles.MEMBER });

    if (!role) {
        throw new NotFoundError("Role not found");
    }

    // Add user to workspace as a member
    const newMember = new Member({
        userId,
        workspaceId: workspace._id,
        role: role._id,
    });
    await newMember.save();

    return { workspaceId: workspace._id, role: role.name };
};
