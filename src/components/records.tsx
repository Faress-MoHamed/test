import { useState, useMemo, useEffect } from "react";
import {
	useReactTable,
	getCoreRowModel,
	getPaginationRowModel,
	flexRender,
	ColumnDef,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import Modal from "react-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Pagination from "./Pagination";
import PopUp from "./PopUp";

// Define the type for leave records
type LeaveRecord = {
	even: any;
	id: number;
	date: string;
	employee: string;
	fromTime: string;
	toTime: string;
	duration: string;
	reason: string;
	discount: string;
};

// Sample data
const sampleData: LeaveRecord[] = Array.from({ length: 100 }, (_, i) => ({
	id: i + 1,
	date: `12/${(i % 30) + 1}/2023`, // Unique day for variation
	employee: i % 2 === 0 ? "Ahmed Mahmoud" : "Mohamed Ali",
	fromTime: `${(i % 12) + 1}:00 ${i % 2 === 0 ? "م" : "ص"}`, // Alternating AM/PM
	toTime: `${((i + 1) % 12) + 1}:00 ${i % 2 === 0 ? "م" : "ص"}`,
	duration: `${(i % 9) + 1}:00`,
	reason: i % 3 === 0 ? "معاد طبي" : i % 3 === 1 ? "اجتماع" : "ظرف طارئ",
	discount: `${100 + (i % 50) * 5}`, // Varying discount
	even: i % 2 === 0,
}));

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		padding: 0,
		border: "0",
	},
	overlay: {
		background: "rgb(241,241,241,0.5)",
	},
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement("#yourAppElement");

export default function LeaveRecordTable() {
	const [selectedEmployee, setSelectedEmployee] = useState<
		string | undefined
	>();
	const [selectedMonth, setSelectedMonth] = useState<string | undefined>();
	const [globalFilter, setGlobalFilter] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const pageSize = 10;
	const totalPages = Math.ceil(sampleData.length / pageSize);

	// Table columns
	const columns = useMemo<ColumnDef<LeaveRecord>[]>(
		() => [
			{ accessorKey: "date", header: "التاريخ" },
			{ accessorKey: "employee", header: "الموظف" },
			{ accessorKey: "fromTime", header: "من" },
			{ accessorKey: "toTime", header: "إلى" },
			{ accessorKey: "duration", header: "مدة الاستئذان" },
			{ accessorKey: "reason", header: "السبب" },
			{ accessorKey: "discount", header: "الخصم" },
		],
		[]
	);

	// Table data
	const filteredData = useMemo(() => {
		return sampleData.filter((record) => {
			const matchesEmployee =
				!selectedEmployee || record.employee === selectedEmployee;
			const matchesMonth =
				!selectedMonth || record.date.includes(selectedMonth);
			return matchesEmployee && matchesMonth;
		});
	}, [selectedEmployee, selectedMonth]);

	// Use react-table hooks
	const table = useReactTable({
		data: filteredData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel({
			initialSync: true,
		}),
		initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
	});

	const handlePageChange = (page: any) => {
		console.log(page);
		if (page >= 1 && page <= totalPages) setCurrentPage(page);
	};
	useEffect(() => {
		console.log(currentPage);
	}, [currentPage]);
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
	const [modalIsOpen, setIsOpen] = useState(false);

	function openModal() {
		setIsOpen(true);
	}

	function closeModal() {
		setIsOpen(false);
	}

	return (
		<>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-xl">سجل استئذان</CardTitle>
					<Button
						onClick={openModal}
						className="bg-emerald-500 hover:bg-emerald-600 w-[148px] h-[44px] text-[16px] flex items-center gap-[10px] cursor-pointer rounded-[8px]"
					>
						<img src="./add.svg" className="h-6 w-6 mr-2" />
						استأذان
					</Button>
				</CardHeader>
				<CardContent>
					{/* Filters */}
					<div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
						{/* <div className="relative w-full md:w-1/3">
							<Search className="absolute right-3 top-2.5 h-4 w-4 text-black" />
							<Input
								placeholder="ابحث هنا"
								className="pr-10"
								value={globalFilter}
								onChange={(e) => setGlobalFilter(e.target.value)}
							/>
						</div> */}
						<div className="flex flex-col md:flex-row gap-5">
							<div className="flex flex-col gap-2">
								<label className="text-[16px] text-black font-[500]">
									الموظف
								</label>
								<Select
									value={selectedEmployee}
									onValueChange={setSelectedEmployee}
								>
									<SelectTrigger className="min-w-[240px] min-h-[48px] rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] placeholder:text-black text-right flex text-black">
										<SelectValue placeholder="الكل" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Ahmed Mahmoud">أحمد محمود</SelectItem>
										<SelectItem value="Mohamed Ali">محمد علي</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="flex flex-col gap-2">
								<label className="text-[16px] text-black font-[500]">
									التاريخ
								</label>
								{/* <Select value={selectedMonth} onValueChange={setSelectedMonth}>
									<SelectTrigger className="w-[180px] border-[#D9D9D9]">
										<SelectValue placeholder="أغسطس/2023" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="10/2023">أكتوبر/2023</SelectItem>
										<SelectItem value="09/2023">سبتمبر/2023</SelectItem>
										<SelectItem value="08/2023">أغسطس/2023</SelectItem>
									</SelectContent>
								</Select> */}
								<Input
									placeholder="تأخير"
									className="min-w-[240px] h-[48px] rounded-[8px] py-3 pr-3 pl-4 bg-white border-[#D9D9D9] placeholder:text-black text-right flex justify-end"
									type="month"
									// value={globalFilter}
									// onChange={(e) => setGlobalFilter(e.target.value)}
								/>
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-x-auto">
						<table className="w-full border-collapse rounded-[8px]">
							<thead className="bg-[#D0F3E5] border-b-[1px] border-[#14250D66]">
								{table.getHeaderGroups().map((headerGroup) => (
									<tr key={headerGroup.id} className="text-center ">
										{headerGroup.headers.map((header) => (
											<th
												key={header.id}
												className="p-[11px] text-center border-b text-[18px] font-[400]"
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
											</th>
										))}
									</tr>
								))}
							</thead>
							<tbody>
								{table.getRowModel().rows.map((row) => (
									<tr
										key={row.id}
										className="border-b hover:bg-muted/50 text-center"
									>
										{row.getVisibleCells().map((cell) => {
											console.log(cell.getContext().row.original);
											return (
												<td
													key={cell.id}
													className={cn(
														`p-3 text-[16px] tec border-y-[1px] border-[#14250D66]`,
														`${
															(cell.getContext().row.id as unknown as number) %
																2 !==
															0
																? "bg-[#D0F3E5]"
																: ""
														}`
													)}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</td>
											);
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between mt-6">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<ChevronRight className="h-4 w-4 ml-1" />
							<span>السابق</span>
						</Button>
						<div className="flex flex-row-reverse items-center justify-center space-x-2">
							{pages.map((page, index) => (
								<Button
									key={index}
									variant={page === currentPage ? "default" : "ghost"}
									className={cn(
										"w-10 h-10 p-0",
										page === currentPage && "bg-black text-white"
									)}
									onClick={() =>
										typeof page === "number" && handlePageChange(page)
									}
									disabled={page === "..."}
								>
									{page}
								</Button>
							))}
						</div>{" "}
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span>التالي</span>
							<ChevronLeft className="h-4 w-4 mr-1" />
						</Button>
					</div>
				</CardContent>
			</Card>
			<Modal
				isOpen={modalIsOpen}
				// onAfterOpen={afterOpenModal}
				onRequestClose={closeModal}
				style={customStyles}
				className={""}
				contentLabel="Example Modal"
			>
				<PopUp onClose={closeModal} />
			</Modal>
		</>
	);
}
