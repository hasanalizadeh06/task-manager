import { StaticImageData } from "next/image";

interface Note {
  image: StaticImageData;
  username: string;
  note: string;
  project: string;
  time: string;
}

export interface NotesProps {
  data: Note[];
}