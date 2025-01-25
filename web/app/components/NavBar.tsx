import { Link } from "react-router";
import type { UserData } from "~/lib/fetch";

import logout from "~/assets/logout.svg";
import settings from "~/assets/settings.svg";

type Props = {
	me: UserData;
};

function NavBar({ me }: Props) {
	return (
		<header className="navbar bg-slate-100">
			<div className="flex-1">
				<Link to="/dashboard" className="btn btn-ghost text-xl">
					Viel
				</Link>
			</div>
			<div className="navbar-end flex items-center gap-1">
				<span>
					Hello, {me.name} [{me.role}]
				</span>
				<Link to="/dashboard" className="btn btn-ghost btn-circle">
					<img alt="Settings" src={settings} className="h-5 w-5" />
				</Link>
				<Link to="/logout" className="btn btn-ghost btn-circle">
					<img alt="Logout" src={logout} className="h-5 w-5" />
				</Link>
			</div>
		</header>
	);
}

export default NavBar;
