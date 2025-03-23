import Header from "./components/Header";
import PopUp from "./components/PopUp";
import LeaveRecordTable from "./components/records";

function App() {
	return (
		<div className="px-[80px] font-tajwail">
			<Header />
			<LeaveRecordTable />
			{/* <PopUp /> */}
		</div>
	);
}

export default App;
