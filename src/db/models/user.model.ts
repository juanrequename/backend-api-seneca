import mongoose, { Document } from 'mongoose';
import { baseEntitySchema } from './base-entity-schema';

export interface IUserModel extends Document {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
}

export const userSchema = new mongoose.Schema(
    {
        ...baseEntitySchema,
        email: String,
    },
    { timestamps: true },
);

export const UserModel = mongoose.model<IUserModel>('User', userSchema);
