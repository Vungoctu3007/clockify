
import { Button } from "./ui/button"
import { ReloadIcon } from "@radix-ui/react-icons"

interface LoadingButtonProps {
    loading: boolean,
    text: string
}

const LoadingButton = ({ loading, text } : LoadingButtonProps) => {

    return (
        <Button disabled={loading} className="text-xs bg-blue-500 text-white hover:bg-blue-700 py-2 shadow-button rounded-md">
            { loading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null }
            { loading ? 'Đang xử lý' : text }
        </Button>
    )
}

export default LoadingButton
