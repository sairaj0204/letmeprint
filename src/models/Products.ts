import mongoose, { Schema, Document } from "mongoose";

export interface IProduct {
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: string;
    dimensions: string;
    model: string; // now safe, no clash
}

const productSchema = new Schema<IProduct>({
    name: String,
    description: String,
    price: Number,
    image: String,
    stock: Number,
    category: String,
    dimensions: String,
    model: String,
});

export default mongoose.models.Product ||
    mongoose.model<IProduct>("Product", productSchema);
