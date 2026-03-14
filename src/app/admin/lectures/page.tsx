"use client"

import { useState } from "react"

export default function AddLecture(){

const [title,setTitle] = useState("")
const [category,setCategory] = useState("")
const [teacher,setTeacher] = useState("")
const [audioUrl,setAudioUrl] = useState("")
const [description,setDescription] = useState("")

async function save(){

await fetch("/api/lectures",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
title,
category,
teacher,
audioUrl,
description
})

})

alert("Lecture added")

}

return(

<div className="p-10">

<h1 className="text-2xl mb-4">Add Lecture</h1>

<input placeholder="Title" onChange={e=>setTitle(e.target.value)} className="border p-2 block mb-2"/>

<input placeholder="Category" onChange={e=>setCategory(e.target.value)} className="border p-2 block mb-2"/>

<input placeholder="Teacher" onChange={e=>setTeacher(e.target.value)} className="border p-2 block mb-2"/>

<input placeholder="Audio URL" onChange={e=>setAudioUrl(e.target.value)} className="border p-2 block mb-2"/>

<textarea placeholder="Description" onChange={e=>setDescription(e.target.value)} className="border p-2 block mb-2"/>

<button onClick={save} className="bg-green-600 text-white p-2">

Save

</button>

</div>

)

}