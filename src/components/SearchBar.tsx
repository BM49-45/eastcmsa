"use client"

import { useState } from "react"

export default function SearchBar(){

const [query,setQuery] = useState("")
const [results,setResults] = useState<any>(null)

async function handleSearch(){

const res = await fetch(`/api/search?q=${query}`)

const data = await res.json()

setResults(data)

}

return(

<div>

<input
placeholder="Search lectures or books"
value={query}
onChange={(e)=>setQuery(e.target.value)}
/>

<button onClick={handleSearch}>
Search
</button>

</div>

)

}