"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateLecture(){

const router = useRouter()

const [title,setTitle] = useState("")
const [speaker,setSpeaker] = useState("")

async function handleSubmit(e:any){

e.preventDefault()

await fetch("/api/lectures",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title,
speaker
})

})

router.push("/admin/lectures")

}

return(

<form onSubmit={handleSubmit}>

<h1>Add Lecture</h1>

<input
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
/>

<input
placeholder="Speaker"
value={speaker}
onChange={(e)=>setSpeaker(e.target.value)}
/>

<button type="submit">
Create Lecture
</button>

</form>

)

}