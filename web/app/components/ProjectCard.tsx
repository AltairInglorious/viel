import { Link, useOutletContext } from "react-router";
import type { LayoutContext } from "~/layouts/Layout";
import type { Project, UserData } from "~/lib/fetch";

type Props = {
	project: Project;
	owner?: UserData;
};

function ProjectCard({ project, owner }: Props) {
	const { me } = useOutletContext<LayoutContext>();

	return (
		<div className="card card-bordered shadow-md">
			<div className="card-body">
				<h2 className="card-title justify-center text-center">
					{project.title}
				</h2>
				{project.description && <p>{project.description}</p>}
				<div className="flex flex-col text-sm text-neutral-500">
					<div className="flex items-center justify-between">
						<span>Owner</span>
						<span className={project.owner === me.id ? "text-green-500" : ""}>
							{owner?.name || "Unknown"}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<span>Created at</span>
						<span>
							{Intl.DateTimeFormat("ru", {
								dateStyle: "short",
								timeStyle: "medium",
							}).format(new Date(project.createdAt))}
						</span>
					</div>
				</div>
				<div className="card-actions justify-end">
					<Link to={`/dashboard/projects/${project.id}`} className="btn">
						Open
					</Link>
				</div>
			</div>
		</div>
	);
}

export default ProjectCard;
