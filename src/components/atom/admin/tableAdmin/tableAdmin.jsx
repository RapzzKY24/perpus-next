"use client";
import {
  Table,
  TableBody,
  TableHeader,
  TableFooter,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const TableAdmin = ({ columns, data, onEdit, onDelete }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.key}>{column.label}</TableHead>
          ))}
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            {columns.map((column) => (
              <TableCell key={column.key}>
                {/* INI BAGIAN YANG DISEMPURNAKAN */}
                {column.render ? column.render(item) : item[column.key]}
              </TableCell>
            ))}
            <TableCell className="text-right space-x-2">
              {/* Handler yang disederhanakan */}
              <Button size="sm" onClick={() => onEdit(item)}>
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => onDelete(item)}
                variant="destructive"
              >
                Hapus
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={columns.length + 1}>
            Total: {data.length} item
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TableAdmin;
