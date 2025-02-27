import { RootState } from "@/redux/store"
import { PropsWithChildren } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchUser } from "@/services/authService"
import { useEffect } from "react"
import { useNavigate } from "react-router"
import { setAuthLogin, setAuthLogout } from "@/redux/slice/authSlice"

type ProtectedRouteProps = PropsWithChildren

const AuthMiddleware = ({children} : ProtectedRouteProps) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    useEffect(() => {
        const checkAuthenticate = async () => {
            if(!isAuthenticated || user === null){
                const userData = await fetchUser()
                console.log(userData)
                if(userData){
                    dispatch(setAuthLogin(userData))
                }else{
                    dispatch(setAuthLogout())
                    navigate('/login')
                }
            }
        }
        checkAuthenticate()
    }, [isAuthenticated, user, dispatch, navigate])

    return isAuthenticated && user ? children : null
}
export default AuthMiddleware
