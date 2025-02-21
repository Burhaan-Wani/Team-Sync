import { Schema, Types, Document, model } from "mongoose";
import bcrypt from "bcryptjs";

export interface UserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    profilePicture: string | null;
    isActive: boolean;
    lastLogin: Date | null;
    currentWorkspace: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (value: string) => Promise<boolean>;
    omitPassword: () => Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            trim: true,
            select: false,
        },
        profilePicture: {
            type: String,
            default: null,
        },
        currentWorkspace: {
            type: Schema.Types.ObjectId,
            ref: "Workspace",
            required: true,
        },
        isActive: { type: Boolean, default: true },
        lastLogin: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password as string, 12);
    next();
});

userSchema.methods.comparePassword = async function (value: string) {
    return await bcrypt.compare(value, this.password);
};

userSchema.methods.omitPassword = function (): Omit<UserDocument, "password"> {
    const user = this.toObject();
    delete user.password;
    return user;
};

const User = model<UserDocument>("User", userSchema);

export default User;
