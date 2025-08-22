import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { clxRequest } from "@/shared/lib/api/clxRequest";
// filepath: c:\Users\PC\Desktop\Code\task-manager\src\components\AddTasksToEpic.tsx
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
    DialogFooter,
} from "@/components/ui/dialog";

const addTasksToEpicSchema = z.object({
    epicId: z.string().min(1, "Epic is required"),
    taskIds: z.array(z.string()).min(1, "Select at least one task"),
});

type AddTasksToEpicFormData = z.infer<typeof addTasksToEpicSchema>;

export default function AddTasksToEpicDialog({
    epicId,
    onAdded,
}: {
    epicId: string;
    onAdded?: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [tasks, setTasks] = useState<{ id: string; name: string }[]>([]);

    const {
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<AddTasksToEpicFormData>({
        resolver: zodResolver(addTasksToEpicSchema),
        defaultValues: {
            epicId: epicId,
            taskIds: [],
        },
    });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await clxRequest.get<{ items: { id: string; name: string }[] }>("tasks?page=1&limit=1000");
                setTasks(response.items || []);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };
        fetchTasks();
    }, []);

    const onSubmit = async (data: AddTasksToEpicFormData) => {
        try {
            await clxRequest.patch(`epic/${epicId}`, {
                taskIds: data.taskIds,
            });
            onAdded?.();
            setIsOpen(false);
            reset();
        } catch (error) {
            alert("Failed to add tasks to epic");
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        reset();
    };

    // For checkbox multiselect
    const selectedTaskIds = watch("taskIds");
    const handleTaskToggle = (taskId: string) => {
        if (selectedTaskIds.includes(taskId)) {
            setValue(
                "taskIds",
                selectedTaskIds.filter((id) => id !== taskId)
            );
        } else {
            setValue("taskIds", [...selectedTaskIds, taskId]);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <span>Add task</span>
            </DialogTrigger>
            <DialogOverlay className="bg-black/20" />
            <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[450px] p-0">
                <div className="p-6">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <DialogTitle className="text-white text-lg font-medium">
                            Add Tasks to Epic
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-300 mb-2">Tasks</label>
                            <div className="max-h-40 overflow-y-auto scrollbar space-y-2">
                                {tasks.map((task) => (
                                    <label
                                        key={task.id}
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-lime-500/20"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedTaskIds.includes(task.id)}
                                            onChange={() => handleTaskToggle(task.id)}
                                            className="accent-lime-500 w-4 h-4"
                                        />
                                        <span className="text-white font-medium">{task.name}</span>
                                    </label>
                                ))}
                            </div>
                            {errors.taskIds && (
                                <p className="text-red-400 text-sm">{errors.taskIds.message}</p>
                            )}
                        </div>
                    </form>
                </div>
                <DialogFooter className="bg-gray-750 px-6 py-4 flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                    >
                        {isSubmitting ? "Adding..." : "Add"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}