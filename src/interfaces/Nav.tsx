export interface NavSubItem {
    label: string;
    icon: React.ReactNode;
    href: string;
    active?: boolean;
}

export interface NavMenuItem {
    label: string;
    icon: React.ReactNode;
    href: string;
    active?: boolean;
    subItems?: NavSubItem[];
}