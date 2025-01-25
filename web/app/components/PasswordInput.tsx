import type React from "react";
import { useState } from "react";

import eyeOff from "../assets/eye-off.svg";
import eye from "../assets/eye.svg";

function PasswordInput({
	children,
	className,
	type,
	...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
	const [show, setShow] = useState(false);
	return (
		<div className="flex gap-2 input input-bordered items-center">
			<input type={show ? "text" : "password"} className="grow" {...props} />
			<button
				type="button"
				className="btn btn-ghost btn-sm btn-circle p-1"
				onClick={() => setShow((p) => !p)}
			>
				<img alt="Toggle password visibility" src={show ? eyeOff : eye} />
			</button>
		</div>
	);
}

export default PasswordInput;
