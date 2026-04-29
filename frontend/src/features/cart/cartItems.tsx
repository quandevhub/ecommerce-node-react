import { useState } from "react"
import { useAppSelector } from "../../hooks/useAppSelectot"
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { addToCart, clearCart, removeCartItem } from "./cartSlice";
import { deCreaseQuantity } from "./cartSlice";
import api from "../../services/api";
import { parseApiError } from "../../utils/parseApiError";
import { Link, useNavigate } from "react-router-dom";

type OrderStatus = "idle" | "loading" | "success" | "error"

export default function CartItems() {
    const navigate = useNavigate()
    const cartItems = useAppSelector(state => state.cart.items);
    const { userId } = useAppSelector(state => state.auth);
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const dispatch = useAppDispatch();
    const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle")
    const [orderError, setOrderError] = useState<string | null>(null)

    const createOrder = async () => {
        if (!userId) {
            navigate("/login?redirect=/cart")
            return
        }

        setOrderStatus("loading")
        setOrderError(null)

        try {
            const orderData = {
                user_id: userId,
                products: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                }))
            };
            await api.post('/orders', orderData);
            dispatch(clearCart());
            setOrderStatus("success")
        } catch (error) {
            setOrderError(parseApiError(error, "Đặt hàng thất bại, vui lòng thử lại"))
            setOrderStatus("error")
        }
    };


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

                {orderStatus === "success" && (
                    <div className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        Đặt hàng thành công! Cảm ơn bạn đã mua hàng.
                    </div>
                )}

                {orderStatus === "error" && orderError && (
                    <div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {orderError}
                    </div>
                )}

                <div className="mt-6 rounded border p-4">
                    <p>Tong so luong: {totalQuantity}</p>
                    <p>Tong tien: {totalPrice}</p>
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={createOrder}
                            disabled={orderStatus === "loading" || cartItems.length === 0}
                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:opacity-50"
                        >
                            {orderStatus === "loading" ? "Đang xử lý..." : "Thanh toán"}
                        </button>
                        <Link to="/" className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}