import mongoose, { Document, Schema } from 'mongoose';

export interface ISessionModel extends Document {
    _id: string;
    name: string;
    sessionId: string;
    userId: string;
    courseId: string;
    totalModulesStudied: number;
    averageScore: number;
    timeStudied: number;
    createdAt: Date;
    updatedAt: Date;
}

export const sessionSchema = new Schema(
    {
        name: String,
        sessionId: {
            type: String,
            unique: true,
            dropDups: true
        },
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
        totalModulesStudied: Number,
        averageScore: Number,
        timeStudied: Number,
        createdAt: Date,
        updatedAt: Date,
    },
    { timestamps: true },
);

export const SessionModel = mongoose.model<ISessionModel>('Session', sessionSchema);
