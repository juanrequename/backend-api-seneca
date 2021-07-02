import mongoose, { Document } from 'mongoose';
import { baseEntitySchema } from './base-entity-schema';

export interface ICourseModel extends Document {
    _id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export const courseSchema = new mongoose.Schema(
    {
        ...baseEntitySchema,
        description: String,
    },
    { timestamps: true },
);

export const CourseModel = mongoose.model<ICourseModel>('Course', courseSchema);
