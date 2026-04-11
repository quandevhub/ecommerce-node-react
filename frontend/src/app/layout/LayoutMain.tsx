import HeaderMenu from "./HeaderMenu"
import { Outlet } from "react-router-dom"

export default function LayoutMain() {
    return (
        <>
            <HeaderMenu />
            <Outlet />
        </>
    )
}