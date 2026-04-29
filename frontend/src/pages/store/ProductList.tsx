import ProductItem from "./ProductItem"
import { useState, useEffect, useCallback } from "react"
import type { Product } from "../../entities/types"
import api from "../../services/api"

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)


    const fectProducts = useCallback(async () => {
        try {
            const response = await api.get('/products')
            
            setProducts(response.data)
        } catch (error) {
            setError((error as Error).message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fectProducts()
    }, [fectProducts])

    const reFetchProducts = () => {
        setLoading(true)
        setError(null)
        fectProducts()
    }


    if (loading) {
        return <p className="text-center text-gray-500 font-bold text-lg">Loading...</p>
    }

    if (error) {
        return <p className="text-center text-red-500 font-bold text-lg">{error}</p>
    }

    return (
        <>
            <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">San pham noi bat</h1>
                        <p className="text-sm text-gray-600">
                            Tong so {products.length} san pham
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={reFetchProducts}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                    >
                        Tai lai
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {!loading && !error && <ProductItem products={products} />}
                </div>
            </main>
        </>
    )
}