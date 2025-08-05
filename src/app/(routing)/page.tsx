'use client'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (pathname === '/') {
            router.replace('/dashboard')
        }
    }, [pathname, router])

    return null
}