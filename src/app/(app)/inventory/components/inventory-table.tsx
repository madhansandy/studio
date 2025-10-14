"use client";

import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { InventoryItem } from "@/lib/api";

interface InventoryTableProps {
  data: InventoryItem[];
}

export default function InventoryTable({ data }: InventoryTableProps) {
  const { toast } = useToast();

  useEffect(() => {
    const lowStockItems = data.filter(item => item.status === 'Low Stock');
    const expiredItems = data.filter(item => item.status === 'Expired');

    if (lowStockItems.length > 0) {
      toast({
        variant: "destructive",
        title: "Low Stock Alert",
        description: `${lowStockItems.map(i => i.name).join(', ')} are running low.`,
      });
    }
    if (expiredItems.length > 0) {
      toast({
        variant: "destructive",
        title: "Expired Medication Alert",
        description: `Your ${expiredItems.map(i => i.name).join(', ')} has expired.`,
      });
    }
  }, [data, toast]);

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'In Stock':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">In Stock</Badge>;
      case 'Low Stock':
        return <Badge variant="destructive" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Low Stock</Badge>;
      case 'Expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Medication</TableHead>
          <TableHead className="text-center">Stock (days)</TableHead>
          <TableHead>Expiry Date</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id} className={cn(item.status === 'Expired' && 'bg-destructive/10')}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell className="text-center">{item.stock}</TableCell>
            <TableCell>{item.expiryDate}</TableCell>
            <TableCell>{getStatusBadge(item.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
