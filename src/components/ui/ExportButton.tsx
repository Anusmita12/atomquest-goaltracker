"use client";

import Papa from "papaparse";

type ExportButtonProps<T> = {
  data: T[];
  filename: string;
};

export function ExportButton<T>({ data, filename }: ExportButtonProps<T>) {
  const onClick = () => {
    const csv = Papa.unparse(data as unknown as object[]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={onClick} className="rounded bg-black px-3 py-2 text-sm text-white hover:bg-zinc-700">
      Export CSV
    </button>
  );
}
