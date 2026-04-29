import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelectot";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { logout } from "../../features/auth/authSlice";

export default function HeaderMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { token, email } = useAppSelector((state) => state.auth);
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 border-b border-gray-700 bg-gray-800/95 px-4 py-3 text-white backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="font-semibold hover:text-gray-300">
            Store
          </Link>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 hover:text-gray-300"
          >
            Cart
            <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-900">
              {totalQuantity}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <span className="text-sm text-gray-300">
                Xin chào,{" "}
                <span className="font-medium text-white">{email}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-300 transition hover:text-white"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
