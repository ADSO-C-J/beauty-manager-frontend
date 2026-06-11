import { useState } from "react";

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lastVisit: string;
  frequency: string;
  initials: string;
};

const initialClients: Client[] = [
  {
    id: 1,
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+1 (555) 234-5678",
    visits: 24,
    lastVisit: "2026-04-20",
    frequency: "Alta",
    initials: "AM",
  },
  {
    id: 2,
    name: "Carlos Ruiz",
    email: "carlos.ruiz@email.com",
    phone: "+1 (555) 345-6789",
    visits: 12,
    lastVisit: "2026-04-18",
    frequency: "Media",
    initials: "CR",
  },
  {
    id: 3,
    name: "Sofía Hernández",
    email: "sofia.h@email.com",
    phone: "+1 (555) 456-7890",
    visits: 36,
    lastVisit: "2026-04-22",
    frequency: "Alta",
    initials: "SH",
  },
  {
    id: 4,
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+1 (555) 567-8901",
    visits: 8,
    lastVisit: "2026-04-15",
    frequency: "Baja",
    initials: "JP",
  },
  {
    id: 5,
    name: "Elena Torres",
    email: "elena.torres@email.com",
    phone: "+1 (555) 678-9012",
    visits: 18,
    lastVisit: "2026-04-21",
    frequency: "Media",
    initials: "ET",
  },
  {
    id: 6,
    name: "Roberto García",
    email: "roberto.g@email.com",
    phone: "+1 (555) 789-0123",
    visits: 42,
    lastVisit: "2026-04-23",
    frequency: "Alta",
    initials: "RG",
  },
];

export const useClientPresenter = () => {
  const [clientList, setClientList] = useState<Client[]>(initialClients);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "" });

  const filteredClients = clientList.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleCreateClient = () => {
    const initials = newClient.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const client: Client = {
      id: Date.now(),
      name: newClient.name.trim(),
      email: newClient.email.trim(),
      phone: newClient.phone.trim(),
      visits: 0,
      lastVisit: new Date().toISOString().split("T")[0],
      frequency: "Baja",
      initials,
    };

    setClientList((prev) => [...prev, client]);
    setIsDialogOpen(false);
    setNewClient({ name: "", email: "", phone: "" });
  };

  return {
    newClient,
    searchTerm,
    isDialogOpen,
    setNewClient,
    setSearchTerm,
    filteredClients,
    setIsDialogOpen,
    handleCreateClient
  }
};