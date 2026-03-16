"use client"

import {useState} from "react"

export default function SearchBar({
onSearch
}:any){

const [query,setQuery] = useState("")

function submit(e:any){

e.preventDefault()

onSearch(query)

}

return(

<form
onSubmit={submit}
className="flex gap-2"
>

<input
value={query}
onChange={(e)=>setQuery(e.target.value)}
placeholder="Search lectures..."
className="border px-4 py-2 rounded w-full"
/>

<button
className="bg-black text-white px-4 py-2 rounded"
>

Search

</button>

</form>

)

}