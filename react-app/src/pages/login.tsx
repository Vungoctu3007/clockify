import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router"
import { login } from "../services/authService"
import { useSelector, useDispatch } from "react-redux"
import { setToast } from "../redux/slice/toastSlice"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { setAuthLogin } from "@/redux/slice/authSlice"
type Inputs = {
    email: string,
    password: string
};

const Login = () => {
    // const { setMessage } = useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loading, setLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (payload) => {
        setLoading(true)
        try {
            const auth = await login(payload)
            dispatch(setToast({ message: "Login successfully", type: "success" }))
            dispatch(setAuthLogin(auth))
            auth && navigate("/")
        } catch (error) {

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-24 items-center justify-center bg-gray-100">
            <div className="max-w-screen-md mx-auto">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4">
                        <h2 className="font-bold text-2xl mb-4 text-neutral-500">
                            Welcome to HT Version 1.0.0+
                        </h2>
                        <p className="mb-2 text-gray-500">
                            Perfectly designed and precisely prepared admin
                            theme with over 50 pages with extra new web app
                            views.
                        </p>
                        <p className="mb-2 text-gray-500">
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's standard dummy text ever since the 1500s.
                        </p>
                        <p className="mb-2 text-gray-500">
                            When an unknown printer took a galley of type and
                            scrambled it to make a type specimen book.
                        </p>
                    </div>
                    <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <h1 className="text-center font-bold">Login</h1>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="email"
                                    placeholder="Email"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none  focus:border-sky-500 h-11"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-xs">
                                        Email is required
                                    </span>
                                )}
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Password"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-sky-500 h-11"
                                    {...register("password", {
                                        required: true,
                                    })}
                                />
                                {errors.password && (
                                    <span className="text-red-500 text-xs">
                                        Password is required
                                    </span>
                                )}
                            </div>
                            <div className="mb-2"></div>
                            <p className="text-gray-700 mb-2 text-xs">
                                <a href="/" className="text-blue-700">
                                    Forgot password
                                </a>
                            </p>
                            <div className="description text-xs text-gray-700 pb-1">
                                Welcome version 1.0
                            </div>
                            <div className="flex justify-center">
                                <Button
                                    className="text-xs p-2 bg-blue-500 text-white hover:bg-blue-700 py-2 shadow-button rounded-md"
                                >
                                    { loading ? <Loader2 className="animate-spin" /> : null}
                                    { loading ? 'processing' : 'Submit'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
