"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { parseCookies } from "nookies";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogOverlay,
    DialogFooter,
} from "@/components/ui/dialog";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import Image from "next/image";
const { accessToken } = parseCookies();
import moveIcon from "@/shared/assets/icons/arrow-square-right.png";

export function MoveSprint({ taskId, onMoved }: { taskId: string, onMoved?: () => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [sprints, setSprints] = useState<{ id: string; name: string }[]>([]);
    const [selectedSprint, setSelectedSprint] = useState<string>("");
    useEffect(() => {
        async function fetchSprints() {
            try {
                const response = await clxRequest.get<{ items: { id: string; name: string }[] }>("/sprints?page=1&limit=1000");
                setSprints(response.items || []);
            } catch (error) {
                console.error("Error fetching sprints:", error);
            }
        }
        fetchSprints();
    }, []);


    const handleCancel = () => {
        setIsOpen(false);
    };

    const handleSubmit = async () => {
        if (!selectedSprint) return;
        setIsLoading(true);
        try {
            await clxRequest.patch(`/tasks/${taskId}`, { sprintId: selectedSprint }, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setIsOpen(false);
            if (onMoved) onMoved();
        } catch (error) {
            alert("Failed to move task to sprint");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="flex w-35 items-center gap-2 cursor-pointer font-extralight whitespace-nowrap">
                    <Image
                        src={moveIcon}
                        alt="Move to Sprint"
                        width={20}
                        height={20}
                    />
                    Move to Sprint
                </button>
            </DialogTrigger>
            <DialogOverlay className="bg-black/20" />
            <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[400px] p-0">
                <DialogTitle className="px-6 pt-6 pb-2 text-lg font-semibold">Move to Sprint</DialogTitle>
                <div className="px-6 pb-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Sprint</label>
                    <select
                        className="w-full rounded-lg bg-white/10 border-0 py-2 px-3 text-white focus:ring-2 focus:ring-green-500"
                        value={selectedSprint}
                        onChange={e => setSelectedSprint(e.target.value)}
                    >
                        <option value="" className="text-black">Select sprint</option>
                        {sprints.map(sprint => (
                            <option key={sprint.id} value={sprint.id} className="text-black">{sprint.name}</option>
                        ))}
                    </select>
                </div>
                <DialogFooter className="bg-gray-750 px-6 py-4 flex justify-end space-x-3">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleCancel}
                        className="text-gray-300 hover:text-white hover:bg-gray-700"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!selectedSprint || isLoading}
                        className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                    >
                        {isLoading ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}