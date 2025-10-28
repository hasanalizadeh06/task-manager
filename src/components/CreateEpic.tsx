import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogOverlay, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { parseCookies } from "nookies";
import { FaPlus } from "react-icons/fa";

const epicSchema = z.object({
	name: z.string().min(1, "Epic name is required"),
	goal: z.string().min(1, "Goal is required"),
	priority: z.string().min(1, "Priority is required"),
	endDate: z.string().min(1, "Due date is required"),
	storyPoints: z.number().min(0, "Story point is required"),
	projectId: z.string().min(1, "Project is required"),
});

type EpicFormData = z.infer<typeof epicSchema>;

export default function CreateEpicDialog({ onEpicCreated }: { onEpicCreated?: () => void }) {
	const [isOpen, setIsOpen] = useState(false);
	const [projects, setProjects] = useState<{ id: string; title: string }[]>([]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
		} = useForm<EpicFormData>({
			resolver: zodResolver(epicSchema),
			defaultValues: {
				name: "",
				goal: "",
				priority: "To Do",
				endDate: "",
				storyPoints: 0,
				projectId: "",
			},
		});

	useEffect(() => {
		const fetchProjects = async () => {
			try {
				const response = await clxRequest.get<{ items: { id: string; title: string }[] }>("/projects?page=1&limit=1000");
				setProjects(response.items || []);
			} catch (error) {
				console.error("Error fetching projects:", error);
			}
		};
		fetchProjects();
	}, []);

	const onSubmit = async (data: EpicFormData) => {
		try {
			const cookies = parseCookies();
			const accessToken = cookies.accessToken;
			if (!accessToken) throw new Error("Access token not found.");
			const payload = {
				name: data.name,
				goal: data.goal,
				priority: data.priority,
				endDate: data.endDate,
				storyPoints: data.storyPoints,
				projectId: data.projectId,
			};
			await clxRequest.post("/epic", payload, {
				headers: { Authorization: `Bearer ${accessToken}` },
			});
			onEpicCreated?.();
			setIsOpen(false);
			reset();
		} catch (error) {
			alert("Failed to create epic");
			console.error(error);
		}
	};

	const handleCancel = () => {
		setIsOpen(false);
		reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className="bg-[#00C951] flex gap-2 items-center hover:bg-[#00c20a] rounded-3xl text-white px-4 py-2 font-semibold text-sm transition">
                    <FaPlus />
                    Create new
				</button>
			</DialogTrigger>
			<DialogOverlay className="bg-black/20" />
			<DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
				<div className="p-6">
					<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<DialogTitle className="text-white text-lg font-medium">
							Create Epic
						</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
						<div>
							<label className="block text-sm text-gray-300 mb-2">Epic Name</label>
							<input {...register("name")} className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white" />
							{errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}
						</div>
						<div>
							<label className="block text-sm text-gray-300 mb-2">Goal</label>
							<input {...register("goal")} className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white" />
							{errors.goal && <p className="text-red-400 text-sm">{errors.goal.message}</p>}
						</div>
						<div>
							<label className="block text-sm text-gray-300 mb-2">Priority</label>
							<select {...register("priority")} className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white">
								<option className="text-black" value="To Do">To Do</option>
								<option className="text-black" value="In Progress">In Progress</option>
								<option className="text-black" value="Cancelled">Cancelled</option>
								<option className="text-black" value="Testing">Testing</option>
								<option className="text-black" value="Done">Done</option>
							</select>
							{errors.priority && <p className="text-red-400 text-sm">{errors.priority.message}</p>}
						</div>
						<div>
							<label className="block text-sm text-gray-300 mb-2">Due Date</label>
							<input type="date" {...register("endDate")} className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white" />
							{errors.endDate && <p className="text-red-400 text-sm">{errors.endDate.message}</p>}
						</div>
						<div>
							<label className="block text-sm text-gray-300 mb-2">Story Points</label>
							  <input type="number" {...register("storyPoints", { valueAsNumber: true })} min={0} className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white" />
							{errors.storyPoints && <p className="text-red-400 text-sm">{errors.storyPoints.message}</p>}
						</div>
						<div>
							<label className="block text-sm text-gray-300 mb-2">Project</label>
							<select {...register("projectId")} className="w-full bg-[#ffffff3a] border border-gray-600 rounded-md px-3 py-2.5 text-white">
								<option value="" disabled>Select project</option>
								{projects.map((p) => (
									<option key={p.id} value={p.id} className="text-black">{p.title}</option>
								))}
							</select>
							{errors.projectId && <p className="text-red-400 text-sm">{errors.projectId.message}</p>}
						</div>
					</form>
				</div>
				<DialogFooter className="bg-gray-750 px-6 py-4 flex justify-end space-x-3">
					<Button type="button" variant="ghost" onClick={handleCancel} className="text-gray-300 hover:text-white hover:bg-gray-700">Cancel</Button>
					<Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSubmitting} className="bg-lime-500 hover:bg-lime-600 text-black font-medium">{isSubmitting ? "Creating..." : "Create"}</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
