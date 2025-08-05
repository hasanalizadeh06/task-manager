"use client"
import { redirect, useParams } from 'next/navigation'

function Page() {
    const { name } = useParams()
    return redirect(name+"/overview")
}

export default Page