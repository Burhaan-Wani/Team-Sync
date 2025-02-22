import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/db.config";
import { RolePermissions } from "../utils/rolesPermission";
import Role from "../models/rolePermissions.model";

const seedRoles = async () => {
    try {
        console.log("seeding roles started...");
        await connectDatabase();
        const session = await mongoose.startSession();
        session.startTransaction();

        // clear existing roles
        await Role.deleteMany({}, { session });

        for (const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const permissions = RolePermissions[role];

            const existingRole = await Role.findOne({
                name: roleName,
            }).session(session);

            if (!existingRole) {
                const newRole = new Role({
                    name: roleName,
                    permissions,
                });
                await newRole.save({ session });
                console.log(`Roles ${roleName} add with permissions`);
            } else {
                console.log("Roles already exists");
            }
        }
        await session.commitTransaction();
        session.endSession();
        console.log("seeding completed successfully");
        process.exit(1);
    } catch (error) {
        console.error("Error during seeding", error);
    }
};

seedRoles().catch(error => {
    console.log("error while seeding db", error);
});
