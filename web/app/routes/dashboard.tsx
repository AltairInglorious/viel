import { useOutletContext } from "react-router";
import type { LayoutContext } from "~/layouts/Layout";

function Dashboard() {
	const { me } = useOutletContext<LayoutContext>();
	return <div>Dashboard for {JSON.stringify(me)}</div>;
}

export default Dashboard;
