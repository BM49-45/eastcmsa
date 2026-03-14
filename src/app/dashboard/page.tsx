import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Dashboard(){

const session = await getServerSession(authOptions)

if(!session){

return <div>Access denied</div>

}

return(

<div>

<h1>Dashboard</h1>

<p>{session.user?.email}</p>

</div>

)

}