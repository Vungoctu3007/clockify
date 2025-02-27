import { Button } from "@/components/ui/button"

interface buttonProps {
    content: any,
    label?: string,
    className?: string,
    onClick?: any
}

const BasicButton = ({ content, label, className, onClick }: buttonProps) => {
  return <Button onClick={onClick} className={`border-collapse bg-inherit hover:bg-slate-100 text-blue-400 uppercase ${className}`}>{content} {label}</Button>
}

export default BasicButton
