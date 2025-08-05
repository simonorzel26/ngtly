import Logo from "~/components/Logo";

const StillUnderConstruction: React.FC = () => {
	return (
		<div className="w-full text-wrap items-center align-middle justify-center">
			<Logo size="lg" text="Under Construction" />

			<h1 className="text-xl md:text-4xl font-extrabold mb-4 md:mb-8 mt-8 md:mt-12">
				Sorry. We are still working on this feature!
			</h1>
			<p className="text-lg mb-4">Please check back tomorrow.</p>
		</div>
	);
};

export default StillUnderConstruction;
