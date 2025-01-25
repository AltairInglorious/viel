import type { Project, Task, UserData } from "~/lib/fetch";

type Props = {
	project: Project;
	owner?: UserData;
};

function ProjectCard({ project, owner }: Props) {
	return (
		<div className="card card-bordered shadow-md">
			<div className="card-body">
				<h2 className="card-title justify-center text-center">
					{project.title}
				</h2>
				{project.description && <p>{project.description}</p>}
				<div className="flex items-center justify-between">
					<span>Owner</span>
					<span>{owner?.name || "Unknown"}</span>
				</div>
				<div className="text-sm text-neutral-500 flex items-center justify-between">
					<span>Created at</span>
					<span>
						{Intl.DateTimeFormat("ru", {
							dateStyle: "short",
							timeStyle: "medium",
						}).format(new Date(project.createdAt))}
					</span>
				</div>
				<div className="card-actions justify-end">
					<button type="button" className="btn">
						Open
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProjectCard;
