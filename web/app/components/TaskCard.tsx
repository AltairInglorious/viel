import { useOutletContext } from "react-router";
import type { LayoutContext } from "~/layouts/Layout";
import type { Task, UserData } from "~/lib/fetch";

type Props = {
	task: Task;
	owner?: UserData;
	assignTo?: UserData;
};

function TaskCard({ task, owner, assignTo }: Props) {
	const { me } = useOutletContext<LayoutContext>();

	return (
		<div className="card card-bordered shadow-md">
			<div className="card-body">
				<h2 className="card-title justify-center text-center">{task.title}</h2>
				{task.description && <p>{task.description}</p>}
				<div className="flex items-center justify-between">
					<span>Owner</span>
					<span className={task.owner === me.id ? "text-green-500" : ""}>
						{owner?.name || "Unknown"}
					</span>
				</div>
				{task.assignTo && (
					<div className="flex items-center justify-between">
						<span>Assign to</span>
						<span className={task.assignTo === me.id ? "text-green-500" : ""}>
							{assignTo?.name || "Unknown"}
						</span>
					</div>
				)}
				<div className="text-sm text-neutral-500 flex items-center justify-between">
					<span>Created at</span>
					<span>
						{Intl.DateTimeFormat("ru", {
							dateStyle: "short",
							timeStyle: "medium",
						}).format(new Date(task.createdAt))}
					</span>
				</div>
				<div className="text-sm text-neutral-500 flex items-center justify-between">
					<span>Updated at</span>
					<span>
						{Intl.DateTimeFormat("ru", {
							dateStyle: "short",
							timeStyle: "medium",
						}).format(new Date(task.updatedAt))}
					</span>
				</div>
				<div className="card-actions justify-end">
					<button type="button" className="btn btn-success">
						Complete
					</button>
				</div>
			</div>
		</div>
	);
}

export default TaskCard;
