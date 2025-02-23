import { PermissionType, RoleType } from "../enums/roleEnum";
import { BadRequestError } from "./AppError";
import { RolePermissions } from "./rolesPermission";

export const roleGuard = (
    role: RoleType,
    requiredPermissions: Array<PermissionType>
) => {
    const permissions = RolePermissions[role];
    const hasPermission = requiredPermissions.every(permission =>
        permissions.includes(permission)
    );
    if (!hasPermission) {
        throw new BadRequestError(
            "You do not have necessary permissions to perform this action",
            401
        );
    }
};
