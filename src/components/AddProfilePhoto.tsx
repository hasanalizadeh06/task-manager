"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { parseCookies } from "nookies";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogOverlay,
    DialogFooter,
} from "@/components/ui/dialog";
import { clxRequest } from "@/shared/lib/api/clxRequest";
import { FaPen } from "react-icons/fa6";
import Image from "next/image";
const { accessToken } = parseCookies();
export function AddProfilePhotoDialog({
    onPhotoUploaded,
    onPhotoChange,
}: {
    onPhotoUploaded?: (file: File) => void;
    onPhotoChange?: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFilesSelected = (files: FileList) => {
        if (files.length > 0) {
            setSelectedFile(files[0]);
        }
    };
    const handleSubmit = async () => {
        if (!selectedFile) return;
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            try {
                const profileResponse = await clxRequest.get<{ avatarUrl?: string }>("/profile/me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                
                if (profileResponse.avatarUrl) {
                    console.log("patching")
                    await clxRequest.patchForm("/profile/photo", formData, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                } else {
                    console.log("posting")
                    await clxRequest.postForm("/profile/photo", formData, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                }
            } catch (err) {
                console.error(err);
                await clxRequest.postForm("/profile/photo", formData, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
            }
            
            onPhotoUploaded?.(selectedFile);
            onPhotoChange?.();
            setIsOpen(false);
            setSelectedFile(null);
        } catch (e) {
            console.error(e);
            // handle error (optional)
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsOpen(false);
        setSelectedFile(null);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <div className="absolute inset-0 bg-gray-800/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white">
                    <FaPen size={20} />
                  </span>
                </div>
            </DialogTrigger>
            <DialogOverlay className="bg-black/20" />
            <DialogContent className="bg-white-800/80 backdrop-blur-sm text-white border-lime-500 border-1 sm:max-w-[400px] p-0">
                <div className="p-6">
                    <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <DialogTitle className="text-white text-lg font-medium">
                            Add Profile Photo
                        </DialogTitle>
                    </DialogHeader>
                    {!selectedFile ? (
                        <FileUpload
                            onFilesSelected={handleFilesSelected}
                            acceptedFileTypes="image/*"
                            maxFiles={1}
                            fieldType="poor"
                        />
                    ) : (
                        <div className="mt-4 flex flex-col items-center">
                            <Image
                                width={128}
                                height={128}
                                src={URL.createObjectURL(selectedFile)}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-full mb-2 border border-lime-500"
                            />
                            <div className="text-sm text-gray-300">
                                Selected: {selectedFile.name}
                            </div>
                        </div>
                    )}
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
                        disabled={!selectedFile || isLoading}
                        className="bg-lime-500 hover:bg-lime-600 text-black font-medium"
                    >
                        {isLoading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}