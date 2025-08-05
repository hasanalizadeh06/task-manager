import React from "react";
import Image from "next/image";
import { NotesProps } from "@/interfaces/Notes";

const Notes: React.FC<NotesProps> = ({ data }) => {
  return (
    <div className="rounded-lg text-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold ">Latest notes</h2>
        <button className="text-gray-300 hover:text-white text-sm transition-colors">
          See all notes
        </button>
      </div>

      <div className="max-h-60 scrollbar overflow-y-auto space-y-4 pr-2">
        {data.map((note, index) => (
          <div key={index} className="pb-4 bg-[#ffffff1a] rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 self-center">
                <Image
                  src={note.image}
                  alt={note.username}
                  width={40}
                  height={40}
                  className="rounded-full size-13"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 text-gray-300">
                  <span className="font-medium">{note.username}</span>
                </div>
                <div className="mb-2">
                  <p className="italic">&quot;{note.note}&quot;</p>
                </div>
                <div className="text-gray-400 flex justify-between items-center text-sm">
                  <span>{note.time}</span>
                  <span className="text-green-400 text-xs font-medium uppercase tracking-wide">
                    {note.project}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No notes available</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
