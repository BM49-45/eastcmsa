"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Register(){

const router = useRouter()

const [name,setName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [agree,setAgree] = useState(false)
const [loading,setLoading] = useState(false)

async function handleRegister(e:any){

e.preventDefault()

if(!agree){
alert("Please agree to terms")
return
}

setLoading(true)

await fetch("/api/auth/register",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
name,
email,
password
})

})

setLoading(false)

router.push("/login")

}

return(

<div className="flex items-center justify-center min-h-screen bg-gray-100">

<form
onSubmit={handleRegister}
className="bg-white p-8 rounded-xl shadow-lg w-[380px]"
>

<h1 className="text-2xl font-bold mb-6 text-center">
Create Account
</h1>

<input
placeholder="Full name"
required
className="w-full border p-3 rounded mb-4"
onChange={(e)=>setName(e.target.value)}
/>

<input
type="email"
placeholder="Email"
required
className="w-full border p-3 rounded mb-4"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
required
className="w-full border p-3 rounded mb-4"
onChange={(e)=>setPassword(e.target.value)}
/>

<div className="flex items-center mb-4">

<label className="flex items-center text-sm">
  <input
	type="checkbox"
	className="mr-2"
	onChange={(e)=>setAgree(e.target.checked)}
	checked={agree}
	required
  />
  I agree to the terms and privacy policy
</label>

</div>

<button
type="submit"
className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
>

{loading ? "Creating..." : "Register"}

</button>

<p className="text-sm text-center mt-4">

Already have account?

<a
href="/login"
className="text-green-600 ml-1"
>

Login

</a>

</p>

</form>

</div>

)

}