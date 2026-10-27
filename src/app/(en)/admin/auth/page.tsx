import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { isAdmin } from '@/lib/auth/cookie'

import { AdminAuthForm } from './AdminAuthForm'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin sign-in - JisokuDict Support',
  robots: { index: false, follow: false },
}

export default async function AdminAuthPage() {
  if (await isAdmin()) {
    redirect('/admin')
  }
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader active="support" />
      <main className="flex-1 py-12">
        <div className="max-w-sm mx-auto px-4">
          <h1 className="text-2xl font-bold text-ink-900 mb-2">Admin sign-in</h1>
          <p className="text-ink-600 mb-6 text-sm">Enter the admin password to manage tickets.</p>
          <AdminAuthForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
