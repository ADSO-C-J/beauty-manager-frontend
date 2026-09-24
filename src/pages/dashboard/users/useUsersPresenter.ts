import { useCallback, useEffect, useState } from 'react';
import { userService } from '@modules/users/application/userServices';
import type { SystemUser, UserRole } from '@modules/users/domain/models/SystemUser';

export interface UserForm {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export interface UserFormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

const emptyForm: UserForm = {
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'cliente',
};

export function useUsersPresenter() {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [errors, setErrors] = useState<UserFormErrors>({});

  const loadUsers = useCallback(async (isCancelled?: () => boolean) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      if (isCancelled?.()) return;
      setUsers(data);
    } catch {
      if (isCancelled?.()) return;
      setError('No se pudieron cargar los usuarios');
    } finally {
      if (!isCancelled?.()) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const isCancelled = () => cancelled;
    // Diferido para evitar setState sincrónico dentro del effect (patrón del proyecto).
    Promise.resolve()
      .then(() => loadUsers(isCancelled))
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [loadUsers]);

  const reload = useCallback(async () => {
    await loadUsers();
  }, [loadUsers]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (user: SystemUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      phone: user.phone ?? '',
      role: user.role,
    });
    setErrors({});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const validate = (): boolean => {
    const next: UserFormErrors = {};
    if (!form.name.trim()) next.name = 'El nombre es obligatorio';
    if (!form.email.trim()) {
      next.email = 'El email es obligatorio';
    } else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email.trim())) {
      next.email = 'Formato de email inválido';
    }
    // El backend exige contraseña tanto al crear como al actualizar.
    if (!form.password.trim()) {
      next.password = editingId
        ? 'Introduce una contraseña (se guardará de nuevo)'
        : 'La contraseña es obligatoria';
    } else if (form.password.length < 6) {
      next.password = 'La contraseña debe tener mínimo 6 caracteres';
    }
    if (!form.role) next.role = 'El rol es obligatorio';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || undefined,
        role: form.role,
      };
      if (editingId) {
        await userService.updateUser(editingId, payload);
      } else {
        await userService.createUser(payload);
      }
      handleClose();
      await reload();
    } catch {
      setError(
        editingId
          ? 'No se pudo actualizar el usuario'
          : 'No se pudo crear el usuario (¿email duplicado?)'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUser = async (user: SystemUser) => {
    try {
      await userService.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch {
      setError('No se pudo eliminar el usuario');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const term = searchTerm.trim().toLowerCase();
    const matchesTerm =
      term === '' ||
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (u.phone ?? '').toLowerCase().includes(term);
    return matchesRole && matchesTerm;
  });

  const activeCount = users.filter((u) => u.isActive).length;

  return {
    users,
    isLoading,
    isSaving,
    error,
    clearError: () => setError(null),
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    open,
    editingId,
    form,
    setForm,
    errors,
    openCreate,
    openEdit,
    handleClose,
    handleSubmit,
    deleteUser,
    filteredUsers,
    activeCount,
    reload,
  };
}