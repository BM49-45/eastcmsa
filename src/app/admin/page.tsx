"use client"

import { useEffect,useState } from "react"

export default function Admin(){

const [stats,setStats] = useState<any>({})

useEffect(()=>{

fetch("/api/stats")
.then(res=>res.json())
.then(data=>setStats(data))

},[])

return(

<div className="p-10">

<h1 className="text-2xl mb-6">

Admin Dashboard

</h1>

<div className="grid grid-cols-4 gap-6">

<div className="border p-4">

Users

<h2>{stats.users}</h2>

</div>

<div className="border p-4">

Lectures

<h2>{stats.lectures}</h2>

</div>

<div className="border p-4">

Views

<h2>{stats.views}</h2>

</div>

<div className="border p-4">

Likes

<h2>{stats.likes}</h2>

</div>

</div>

</div>

)

}