"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const t = useTranslations("Projects.table");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div>
      {searchKey && (
        <div className="flex items-center py-4 space-x-4">
          <Input
            placeholder={t("search")}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />

          {/* Status filter */}
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(val) =>
              table
                .getColumn("status")
                ?.setFilterValue(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue placeholder={t("filter.status")} />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value="all">{t("filter.all")}</SelectItem>
              <SelectItem value="todo">{t("setStatus.todo")}</SelectItem>
              <SelectItem value="inprogress">
                {t("setStatus.inprogress")}
              </SelectItem>
              <SelectItem value="unscheduled">
                {t("setStatus.unscheduled")}
              </SelectItem>
              <SelectItem value="completed">
                {t("setStatus.completed")}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Priority filter */}
          <Select
            value={
              (table.getColumn("priority")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(val) =>
              table
                .getColumn("priority")
                ?.setFilterValue(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger className="h-8 w-36">
              <SelectValue placeholder={t("filter.priority")} />
            </SelectTrigger>
            <SelectContent side="bottom">
              <SelectItem value="all">{t("filter.all")}</SelectItem>
              <SelectItem value="low">{t("setPriority.low")}</SelectItem>
              <SelectItem value="medium">{t("setPriority.medium")}</SelectItem>
              <SelectItem value="high">{t("setPriority.high")}</SelectItem>
              <SelectItem value="urgent">{t("setPriority.urgent")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center gap-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm font-medium hidden md:block">
            {t("rowsPerPage")}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:flex w-fit mr-4 items-center justify-center text-sm font-medium">
            {t("pagePerPage", {
              page: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </div>
          <div className="flex md:hidden w-fit mr-4 items-center justify-center text-sm font-medium">
            {table.getState().pagination.pageIndex + 1}/{table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
