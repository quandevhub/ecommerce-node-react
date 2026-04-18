import { useAppSelector } from "../../hooks/useAppSelectot"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addToCart, clearCart, removeCartItem } from "./cartSlice";
import { deCreaseQuantity } from "./cartSlice";

export default function CartItems() {
    const cartItems = useAppSelector(state => state.cart.items);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const dispatch = useAppDispatch();

    return (
        <div>
            <main className="mx-auto max-w-4xl p-4" >
                <div className="mb-6 flex items-center justify-between" >
                    <h1 className="text-2xl font-bold" > Gio hang </h1>
                    < button
                        onClick={() => dispatch(clearCart())}
                        type="button" className="rounded bg-red-500 px-4 py-2 text-white">
                        Xoa tat ca
                    </button>
                </div>

                < div className="space-y-4" >
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-center justify-between rounded border p-4">
                            <div>
                                <h3 className="font-semibold" > {item.name} </h3>
                                <p> Gia: {item.price} </p>
                                <p> So luong: {item.quantity} </p>
                            </div>

                            <div className="flex gap-2" >
                                <button
                                    onClick={() => dispatch(deCreaseQuantity(item.id))}
                                    type="button" className="rounded bg-gray-200 px-3 py-1">
                                    -
                                </button>

                                <button
                                    onClick={() => dispatch(addToCart(item))}
                                    type="button" className="rounded bg-gray-900 px-3 py-1 text-white">
                                    +
                                </button>

                                < button
                                    onClick={() => dispatch(removeCartItem(item.id))}
                                    type="button" className="rounded bg-red-500 px-3 py-1 text-white"
                                >
                                    Xoa
                                </button>
                            </div>
                        </div>

                    ))}
                </div>

                < div className="mt-6 rounded border p-4" >
                    <p>Tong so luong: {totalQuantity} </p>
                    <p> Tong tien: {totalPrice} </p>
                    <button className="rounded bg-green-500 px-4 py-2 text-white">
                        Thanh toan
                    </button>
                    <button className="rounded bg-gray-500 px-4 py-2 text-white">
                        Tiep tuc mua sam
                    </button>
                </div>
            </main>
        </div>
    )
}