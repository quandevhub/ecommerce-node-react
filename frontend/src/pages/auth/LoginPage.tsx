import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "../../hooks/useAppDispatch"
import { useAppSelector } from "../../hooks/useAppSelectot"
import { loginThunk, clearAuthError } from "../../features/auth/authSlice"
import type { LoginForm } from "../../entities/types"

interface FormErrors {
    email?: string
    password_hash?: string
}

function validate(form: LoginForm): FormErrors {
    const errors: FormErrors = {}

    if (!form.email) {
        errors.email = "Email là bắt buộc"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Email không hợp lệ"
    }

    if (!form.password_hash) {
        errors.password_hash = "Mật khẩu là bắt buộc"
    } else if (form.password_hash.length < 6) {
        errors.password_hash = "Mật khẩu tối thiểu 6 ký tự"
    }

    return errors
}

export default function LoginPage() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const redirectTo = searchParams.get("redirect") || "/"
    const dispatch = useAppDispatch()
    const { loading, error: apiError, token } = useAppSelector((state) => state.auth)
    const [form, setForm] = useState<LoginForm>({ email: "", password_hash: "" })
    const [errors, setErrors] = useState<FormErrors>({})

    useEffect(() => {
        dispatch(clearAuthError())
    }, [dispatch])

    useEffect(() => {
        if (token) navigate(redirectTo, { replace: true })
    }, [token, navigate, redirectTo])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()

        const validationErrors = validate(form)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }

        dispatch(loginThunk(form))
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
                <h1 className="mb-2 text-center text-2xl font-bold text-gray-900">Đăng nhập</h1>
                <p className="mb-6 text-center text-sm text-gray-500">
                    Chưa có tài khoản?{" "}
                    <Link to="/register" className="font-medium text-blue-600 hover:underline">
                        Đăng ký
                    </Link>
                </p>

                {apiError && (
                    <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="example@email.com"
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                            }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="password_hash" className="mb-1 block text-sm font-medium text-gray-700">
                            Mật khẩu
                        </label>
                        <input
                            id="password_hash"
                            type="password"
                            name="password_hash"
                            value={form.password_hash}
                            onChange={handleChange}
                            placeholder="Tối thiểu 6 ký tự"
                            className={`w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.password_hash ? "border-red-400 bg-red-50" : "border-gray-300"
                            }`}
                        />
                        {errors.password_hash && (
                            <p className="mt-1 text-xs text-red-500">{errors.password_hash}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>
            </div>
        </div>
    )
}
