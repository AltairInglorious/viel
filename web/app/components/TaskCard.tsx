import { useOutletContext } from "react-router";
import type { LayoutContext } from "~/layouts/Layout";
import type { Task, TaskStatus, UserData } from "~/lib/fetch";

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
				{task.description && (
					<p className="bg-slate-100 rounded  p-2">{task.description}</p>
				)}
				<div className="flex flex-col text-sm text-neutral-500">
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
					<div className="flex items-center justify-between">
						<span>Status</span>
						<span className={TaskColorMap[task.status]}>
							{TaskLabelMap[task.status]}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span>Created at</span>
						<span>
							{Intl.DateTimeFormat("ru", {
								dateStyle: "short",
								timeStyle: "medium",
							}).format(new Date(task.createdAt))}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span>Updated at</span>
						<span>
							{Intl.DateTimeFormat("ru", {
								dateStyle: "short",
								timeStyle: "medium",
							}).format(new Date(task.updatedAt))}
						</span>
					</div>
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

const TaskColorMap: Record<TaskStatus, string> = {
	todo: "text-yellow-500",
	"in-work": "text-blue-500",
	complete: "text-green-500",
};

const TaskLabelMap: Record<TaskStatus, string> = {
	todo: "TODO",
	"in-work": "In work",
	complete: "Complete",
};

export default TaskCard;
