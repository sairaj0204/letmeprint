// src/components/ProductCard.tsx
"use client";


export default function ProductCard({ product, onAddToCart, onBuyNow }) {
    return (
        <div className="border rounded-lg shadow-lg p-4 flex flex-col items-center hover:shadow-xl transition">
            <img src={product.image} alt={product.name} className="w-40 h-40 object-cover rounded-md" />
            <h2 className="text-lg font-semibold mt-2">{product.name}</h2>
            <p className="text-gray-600 text-sm">{product.description}</p>
            <p className="text-md font-bold mt-1">₹{product.price}</p>

            <div className="text-xs text-gray-500 mt-2">
                <p>📐 {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} cm</p>
                <p>⚖️ {product.dimensions.weight} kg</p>
            </div>

            <div className="flex gap-2 mt-3">
                <button onClick={onAddToCart}>Add to Cart</button>
                <button onClick={onBuyNow}>Buy Now</button>
            </div>
        </div>
    );
}
