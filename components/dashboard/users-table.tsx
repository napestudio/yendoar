"use client";
import { format, formatDate } from "date-fns";
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  UserPlus,
  Ban,
  ShieldAlert,
  Trash,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { User, UserType } from "@/types/user";
import { Badge } from "../ui/badge";
import { useState } from "react";

export default function UsersTable({ accounts }: { accounts: User[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const getRoleBadge = (role: UserType) => {
    switch (role) {
      case "SUPERADMIN":
        return (
          <Badge variant="outline" className="bg-yellow text-gray-800">
            SUPERADMIN
          </Badge>
        );
      case "ADMIN":
        return (
          <Badge variant="outline" className="bg-purple-500/20 text-purple-700">
            Admin
          </Badge>
        );
      case "PRODUCER":
        return (
          <Badge variant="outline" className="bg-blue-500/20 text-blue-700">
            Producer
          </Badge>
        );
      case "SELLER":
        return (
          <Badge variant="outline" className="bg-green-500/20 text-green-700">
            Seller
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };
  if (accounts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de usuarios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Producer">Productor</SelectItem>
                <SelectItem value="Seller">
                  Punto de venta / Vendedor
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuario</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Eventos Creados</TableHead>
                {/* <TableHead>Revenue Generated</TableHead>
                <TableHead>Last Active</TableHead> */}
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={account.image || undefined}
                          alt={account.name || "Avatar"}
                        />
                        <AvatarFallback>
                          {account.name!.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{account.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {account.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getRoleBadge(account.type as UserType | "PRODUCER")}
                  </TableCell>
                  <TableCell>{account.events?.length || 0}</TableCell>
                  {/* {customer.type !== "SUPERADMIN" && ( */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Editar Rol
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Editar configuración
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar cuenta
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  {/* )} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
