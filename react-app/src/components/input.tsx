import { Input } from "@/components/ui/input";

interface basicPropsInput {
    type: string;
    placeholder?: string;
    className?: string;
    taskName?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInput = ({
    type,
    placeholder,
    className,
    taskName,
    onChange = () => {}
}: basicPropsInput) => {
    return (
        <Input
            type={type}
            placeholder={placeholder}
            className={className}
            value={taskName}
            onChange={onChange}
        />
    );
};

export default BasicInput;
