import { Schema, Types, Document, model } from "mongoose";
import { ProviderEnum, ProviderEnumType } from "../enums/providerEnum";

export interface AccountDocument extends Document {
    provider: ProviderEnumType;
    providerId: string; // // stores email, googleId and facebookId
    userId: Types.ObjectId;
    refreshToken: string | null;
    tokenExpiry: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const accountSchema = new Schema<AccountDocument>(
    {
        provider: {
            type: String,
            required: true,
            enum: Object.values(ProviderEnum),
        },
        providerId: {
            type: String,
            required: true,
            unique: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        refreshToken: {
            type: String,
            default: null,
        },
        tokenExpiry: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_, ret) {
                delete ret.refreshtoken;
            },
        },
    }
);

const Account = model<AccountDocument>("Account", accountSchema);

export default Account;
