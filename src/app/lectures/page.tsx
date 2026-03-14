"use client"

import { useEffect,useState } from "react"

export default function Lectures(){

const [lectures,setLectures] = useState<any[]>([])

useEffect(()=>{

fetch("/api/lectures")
.then(res=>res.json())
.then(data=>setLectures(data))

},[])

return(

<div className="p-10 grid grid-cols-3 gap-6">

{lectures.map(l=>(

<div key={l._id} className="border p-4">

<h2 className="font-bold">

{l.title}

</h2>

<p>{l.teacher}</p>

<p>{l.category}</p>

<p>Views: {l.views}</p>

<audio controls src={l.audioUrl}/>

</div>

))}

</div>

)

}