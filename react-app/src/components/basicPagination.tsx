import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function BasicPagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const generatePages = () => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1); // Luôn có trang đầu tiên

            if (currentPage > 3) {
                pages.push("ellipsis-start");
            }

            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("ellipsis-end");
            }

            pages.push(totalPages); // Luôn có trang cuối cùng
        }

        return pages;
    };

    return (
        <Pagination className="pt-3">
            <PaginationContent>
                {/* Nút Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        className="cursor-pointer"
                        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
                    />
                </PaginationItem>

                {/* Render các số trang và dấu `...` */}
                {generatePages().map((page, index) =>
                    typeof page === "number" ? (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={currentPage === page}
                                onClick={() => onPageChange(page)}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={index}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )
                )}

                {/* Nút Next */}
                <PaginationItem>
                    <PaginationNext
                        className="cursor-pointer"
                        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
