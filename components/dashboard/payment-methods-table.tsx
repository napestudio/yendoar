"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash,
  Link,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { EditPaymentMethodDialog } from "./edit-payment-method-dialog"

// Sample data
const paymentMethods = [
  {
    id: "pm-001",
    name: "Stripe",
    type: "Credit Card",
    status: "Active",
    lastUsed: "2024-06-15T14:23:45",
    transactionsCount: 450,
    revenue: 25600.75,
    fees: 768.02,
    isDefault: true,
    connectedAccount: "acct_1N5qD2LkUtJ4Tw7z",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pm-002",
    name: "PayPal",
    type: "Digital Wallet",
    status: "Active",
    lastUsed: "2024-06-14T09:45:12",
    transactionsCount: 320,
    revenue: 18450.5,
    fees: 553.52,
    isDefault: false,
    connectedAccount: "business@example.com",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pm-003",
    name: "MercadoPago Julio",
    type: "Local Payment",
    status: "Active",
    lastUsed: "2024-06-13T16:10:32",
    transactionsCount: 280,
    revenue: 12750.25,
    fees: 382.51,
    isDefault: false,
    connectedAccount: "MP-134567890",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pm-004",
    name: "Cash Payments",
    type: "Offline",
    status: "Active",
    lastUsed: "2024-06-12T11:20:45",
    transactionsCount: 150,
    revenue: 8250.0,
    fees: 0,
    isDefault: false,
    connectedAccount: null,
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pm-005",
    name: "Bank Transfer",
    type: "Direct Deposit",
    status: "Inactive",
    lastUsed: "2024-05-20T10:15:30",
    transactionsCount: 45,
    revenue: 3200.0,
    fees: 0,
    isDefault: false,
    connectedAccount: "BANK-123456789",
    logo: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "pm-006",
    name: "Apple Pay",
    type: "Digital Wallet",
    status: "Pending",
    lastUsed: null,
    transactionsCount: 0,
    revenue: 0,
    fees: 0,
    isDefault: false,
    connectedAccount: "in-setup",
    logo: "/placeholder.svg?height=40&width=40",
  },
];

export function PaymentMethodsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const filteredPaymentMethods = paymentMethods.filter((method) => {
    const matchesSearch =
      method.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      method.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (method.connectedAccount &&
        method.connectedAccount
          .toLowerCase()
          .includes(searchQuery.toLowerCase()));

    const matchesType = typeFilter === "all" || method.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || method.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "Inactive":
        return (
          <Badge variant="outline" className="bg-gray-500/20 text-gray-700">
            Inactive
          </Badge>
        );
      case "Pending":
        return (
          <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleEditPaymentMethod = (method: any) => {
    setSelectedPaymentMethod(method);
    setIsEditDialogOpen(true);
  };

  const handleSavePaymentMethod = (updatedMethod: any) => {
    console.log("Saving payment method:", updatedMethod);
    // In a real app, you would update the payment method in your database
    setIsEditDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métodos de Pago</CardTitle>
        <CardDescription>
          Listado de los métodos de pago de la plataforma.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar método..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tipo</SelectItem>
                <SelectItem value="Credit Card">Online</SelectItem>
                <SelectItem value="Digital Wallet">Efectivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método de pago</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>

                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPaymentMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        {/* <img
                          src={method.logo || "/placeholder.svg"}
                          alt={method.name}
                          className="h-6 w-6"
                        /> */}
                      </div>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        {method.connectedAccount && (
                          <div className="text-sm text-muted-foreground truncate max-w-[150px]">
                            {method.connectedAccount}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{method.type}</TableCell>
                  <TableCell>{getStatusBadge(method.status)}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleEditPaymentMethod(method)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {/* {selectedPaymentMethod && (
        <EditPaymentMethodDialog
          paymentMethod={selectedPaymentMethod}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSavePaymentMethod}
        />
      )} */}
    </Card>
  );
}
