"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { addClubUrlButtonActions } from "./addClubUrlButton-actions";

const formSchema = z.object({
	url: z.string().url(),
});

export type AddClubUrlButtonProps = z.infer<typeof formSchema>;

const AddClubUrlButton: React.FC<{ city?: string }> = ({
	city,
}: { city?: string }) => {
	const [open, setOpen] = useState(false);
	const form = useForm<AddClubUrlButtonProps>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			url: "",
		},
	});

	const handleSubmit = async (data: AddClubUrlButtonProps) => {
		const potentialClubUrl = await addClubUrlButtonActions(data, city);
		if (!potentialClubUrl) return;
		setOpen(false);
		form.reset();

		toast("Club URL sent for review.", {
			description: "Come back in a few days to see the events from ",
		});
	};

	return (
		<div className="mt-2 md:mt-4">
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline">Don't see your event?</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Add a Club</DialogTitle>
						<DialogDescription>
							Add a club to our system, and we will automatically scrape the
							events from the URL.
						</DialogDescription>
					</DialogHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="rounded-md text-white flex flex-col items-start w-full text-wrap justify-start"
						>
							<FormField
								control={form.control}
								name="url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Club event list URL</FormLabel>
										<FormControl>
											<Input
												placeholder="https://ngtly.com/events"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											We'll scrape the events from this URL.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<DialogFooter className="mt-2">
								<Button type="submit">Add Club</Button>
							</DialogFooter>
						</form>
					</Form>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default AddClubUrlButton;
