import Link from "next/link";
import { Button } from "../ui/button";

const BuyMeACoffeeButton: React.FC<{ city?: string }> = ({
	city,
}: { city?: string }) => {
	return (
		<Link target="_blank" href={"https://buy.stripe.com/28obKo9s91infWU002"}>
			<Button variant="default" size="sm">
				{"Buy me a coffee"}
			</Button>
		</Link>
	);
};

export default BuyMeACoffeeButton;
