import type { Product } from "../../entities/types";
import { addToCart } from "../../features/cart/cartSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

interface ProductItemProps {
  products: Product[];
}

export default function ProductItem({ products }: ProductItemProps) {
  const dispatch = useAppDispatch();
  return (
    <>
      {products.map((product) => (
        <article
          key={product.id}
          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
        >
          <a className="block overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
            <img
              src={product.image_url}
              className="h-44 w-full object-cover transition duration-300 hover:scale-[1.02]"
              loading="lazy"
            />
          </a>
          <a>
            <h3 className="mt-3 text-lg font-semibold text-gray-900 hover:text-gray-700">
              {product.name}
            </h3>
          </a>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-base font-bold text-emerald-600">
              {product.price}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
              Ton kho: {product.stock}
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <a className="rounded-md border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50">
              Xem chi tiet
            </a>
            <button
              onClick={() => dispatch(addToCart(product))}
              type="button"
              className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-700"
            >
              Them vao gio
            </button>
          </div>
        </article>
      ))}
    </>
  );
}
