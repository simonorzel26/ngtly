import Link from "next/link";
import { Button } from "../ui/button";

const AddEventButton: React.FC<{ city?: string }> = ({
	city,
}: { city?: string }) => {
	return (
		<Link href={"/add-event"}>
			<Button variant="outline" size="sm">
				{"Add event"}
			</Button>
		</Link>
	);
};

export default AddEventButton;
