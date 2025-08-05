import clsx from "clsx";
import type { ReactNode } from "react";

interface PageHeadingProps {
	tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
	className?: string;
	children: ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({
	tag = "h1",
	className,
	children,
}) => {
	const Tag = tag;

	const classes = {
		h1: "text-[136px] font-poiret font-black",
		h2: "text-3xl font-poiret",
		h3: "text-2xl font-poiret",
		h4: "text-xl font-poiret",
		h5: "text-lg font-poiret",
		h6: "text-base font-poiret",
	};

	return <Tag className={clsx(classes[Tag], className)}>{children}</Tag>;
};

export default PageHeading;
