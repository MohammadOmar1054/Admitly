import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...values: ClassValue[]) => twMerge(clsx(values));

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(date));

export const generateId = () => {
  const year = new Date().getFullYear();
  return `ADM-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
};

export const initials = (name: string) =>
  name.split(" ").map((part) => part[0]).join("").slice(0, 2);
