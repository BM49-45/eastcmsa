import Link from "next/link"

export default function AdminMenu(){

return(

<div className="space-y-3">

<Link href="/admin">Dashboard</Link>

<Link href="/admin/contents">Contents</Link>

<Link href="/admin/users">Users</Link>

<Link href="/admin/events">Events</Link>

<Link href="/admin/analytics">Analytics</Link>

</div>

)

}