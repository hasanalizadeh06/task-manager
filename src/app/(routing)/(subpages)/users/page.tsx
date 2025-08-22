"use client"
import React from 'react'
import UsersTable from '@/components/UsersTable'
import { useRoleStore } from '@/features/auth/model/role.store';
import { redirect } from 'next/navigation';

function Page() {
  const role = useRoleStore((s) => s.role);
  if (role !== "admin" && role !== "super_admin") {
    redirect("/");
  }
  return (
    <UsersTable />
  )
}

export default Page


