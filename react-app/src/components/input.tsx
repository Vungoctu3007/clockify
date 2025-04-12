import { Input } from "@/components/ui/input";

interface basicPropsInput {
    type: string;
    placeholder?: string;
    className?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BasicInput = ({
    type,
    placeholder,
    className,
    value,
    onChange = () => {}
}: basicPropsInput) => {
    return (
        <Input
            type={type}
            placeholder={placeholder}
            className={className}
            value={value}
            onChange={onChange}
        />
    );
};

export default BasicInput;
