"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import Button from "./Button";
import Input from "./Input";
import Card, { CardContent, CardHeader } from "./Card";
import { clsx } from "clsx";

export interface DataTableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface DataTableAction<T = any> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: "primary" | "secondary" | "danger";
  show?: (row: T) => boolean;
}

export interface DataTableProps<T = any> {
  title: string;
  description?: string;
  data: T[];
  columns: DataTableColumn<T>[];
  actions?: DataTableAction<T>[];
  searchPlaceholder?: string;
  itemsPerPage?: number;
  showExport?: boolean;
  showFilter?: boolean;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  title,
  description,
  data,
  columns,
  actions = [],
  searchPlaceholder = "Pesquisar...",
  itemsPerPage = 10,
  showExport = true,
  showFilter = true,
  onRowClick,
  loading = false,
  emptyMessage = "Nenhum item encontrado.",
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Get searchable columns
  const searchableColumns = columns.filter((col) => col.searchable);

  // Filter data based on search
  const filteredData = data.filter((row) => {
    if (!searchTerm) return true;

    return searchableColumns.some((column) => {
      const value = row[column.key];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === "asc" ? -1 : 1;
    if (bValue == null) return sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (sortDirection === "asc") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const handleExport = () => {
    // Implement CSV export
    const csvContent = [
      columns.map((col) => col.label).join(","),
      ...sortedData.map((row) =>
        columns
          .map((col) => {
            const value = row[col.key];
            return typeof value === "string" ? `"${value}"` : value || "";
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionColor = (variant?: string) => {
    switch (variant) {
      case "primary":
        return "text-blue-600 hover:text-blue-700 hover:bg-blue-50";
      case "danger":
        return "text-red-600 hover:text-red-700 hover:bg-red-50";
      default:
        return "text-gray-600 hover:text-gray-700 hover:bg-gray-50";
    }
  };

  return (
    <Card className={clsx("border-0 shadow-lg", className)}>
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
              {description && (
                <p className="text-sm text-gray-600 mt-1">{description}</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {showFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={clsx(
                    "border-gray-200",
                    showFilters ? "bg-gray-50 text-gray-700" : "text-gray-600"
                  )}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              )}

              {showExport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExport}
                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="h-5 w-5 text-gray-400" />}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                Mostrando {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, sortedData.length)} de{" "}
                {sortedData.length} itens
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-y border-gray-200">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={clsx(
                      "px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider",
                      column.sortable &&
                        "cursor-pointer hover:bg-gray-100 transition-colors",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right"
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      <span>{column.label}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={clsx(
                              "h-3 w-3",
                              sortColumn === column.key &&
                                sortDirection === "asc"
                                ? "text-purple-600"
                                : "text-gray-400"
                            )}
                          />
                          <ChevronDown
                            className={clsx(
                              "h-3 w-3 -mt-1",
                              sortColumn === column.key &&
                                sortDirection === "desc"
                                ? "text-purple-600"
                                : "text-gray-400"
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      <span className="ml-2">Carregando...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className={clsx(
                      "hover:bg-gray-50 transition-colors",
                      onRowClick && "cursor-pointer"
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={clsx(
                          "px-6 py-4 whitespace-nowrap text-sm",
                          column.align === "center" && "text-center",
                          column.align === "right" && "text-right"
                        )}
                      >
                        {column.render
                          ? column.render(row[column.key], row)
                          : String(row[column.key] || "")}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          {actions.map((action, actionIndex) => {
                            if (action.show && !action.show(row)) return null;

                            const Icon = action.icon;
                            return (
                              <button
                                key={actionIndex}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                className={clsx(
                                  "p-2 rounded-lg transition-colors",
                                  getActionColor(action.variant)
                                )}
                                title={action.label}
                              >
                                {Icon && <Icon className="h-4 w-4" />}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="border-gray-300"
              >
                Anterior
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className={clsx(
                        "w-10 h-10",
                        currentPage === pageNum
                          ? "bg-purple-600 hover:bg-purple-700 border-purple-600"
                          : "border-gray-300"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="border-gray-300"
              >
                Próximo
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
