import mongoose from "mongoose";

const collection = "Users";
const schema = new mongoose.Schema(
{
    firstName: String,
    lastName: String,
    email: String,
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin', 'superadmin', 'premium'],
        default: 'user'
    },
    resetToken: {
        type: String,
        default: ''
    },
    resetTokenExpiry: {
        type: Date,
        default: ''
    },
    documents: [{
        name: {
            type: String,
            required: true
        },
        reference: {
            type: String,
            required: true
        }
    }],
    last_connection: {
        type: Date,
        default: null
    }
});

const userModel = mongoose.model(collection, schema);
export default userModel;
