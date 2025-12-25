"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Edit, Trash2, Search, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Column {
  key: string
  label: string
  render?: (value: any, row: any) => React.ReactNode
}

interface AdminDataTableProps {
  data: any[]
  columns: Column[]
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  searchable?: boolean
  searchPlaceholder?: string
  loading?: boolean
}

export function AdminDataTable({
  data,
  columns,
  onEdit,
  onDelete,
  searchable = true,
  searchPlaceholder = "Search...",
  loading = false,
}: AdminDataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [loadingOperations, setLoadingOperations] = useState<Set<string>>(new Set())

  const filteredData = data.filter((item) =>
    searchable
      ? Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true
  )

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="w-[70px]">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((item, index) => (
                <TableRow key={item.id || index}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render
                        ? column.render(item[column.key], item)
                        : item[column.key]}
                    </TableCell>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {onEdit && (
                            <DropdownMenuItem
                              onClick={async () => {
                                const operationId = `edit-${item.id}`
                                setLoadingOperations(prev => new Set(prev).add(operationId))
                                try {
                                  await onEdit(item)
                                } finally {
                                  setLoadingOperations(prev => {
                                    const newSet = new Set(prev)
                                    newSet.delete(operationId)
                                    return newSet
                                  })
                                }
                              }}
                              disabled={loadingOperations.has(`edit-${item.id}`)}
                            >
                              {loadingOperations.has(`edit-${item.id}`) ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Edit className="mr-2 h-4 w-4" />
                              )}
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <DropdownMenuItem
                              onClick={async () => {
                                const operationId = `delete-${item.id}`
                                setLoadingOperations(prev => new Set(prev).add(operationId))
                                try {
                                  await onDelete(item)
                                } finally {
                                  setLoadingOperations(prev => {
                                    const newSet = new Set(prev)
                                    newSet.delete(operationId)
                                    return newSet
                                  })
                                }
                              }}
                              disabled={loadingOperations.has(`delete-${item.id}`)}
                              className="text-destructive"
                            >
                              {loadingOperations.has(`delete-${item.id}`) ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}