import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Pagination = ({
	currentPage,
	totalPages,
	onPageChange,
}: {
	currentPage: number;
	totalPages: number;
	onPageChange: any;
}) => {
	const maxVisiblePages = 3;
	const pages = [];

	for (let i = 1; i <= totalPages; i++) {
		if (
			i === 1 ||
			i === totalPages ||
			(i >= currentPage - 1 && i <= currentPage + 1)
		) {
			pages.push(i);
		} else if (pages[pages.length - 1] !== "...") {
			pages.push("...");
		}
	}

	return (
		<div className="flex items-center space-x-2">
			{pages.map((page, index) => (
				<Button
					key={index}
					variant={page === currentPage ? "default" : "ghost"}
					className={cn(
						"w-10 h-10 p-0",
						page === currentPage && "bg-black text-white"
					)}
					onClick={() => typeof page === "number" && onPageChange(page)}
					disabled={page === "..."}
				>
					{page}
				</Button>
			))}
		</div>
	);
};

export default Pagination;
