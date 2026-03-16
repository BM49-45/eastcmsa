"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

async function handleLogin(e:any){

e.preventDefault()

setLoading(true)

const res = await signIn("credentials",{
email,
password,
redirect:false
})

setLoading(false)

if(res?.error){
setError(res.error)
}else{
router.replace("/dashboard")
router.refresh()
}

}

return(

<div className="flex items-center justify-center min-h-screen bg-gray-100">

<form
onSubmit={handleLogin}
className="bg-white p-8 rounded-xl shadow-lg w-[380px]"
>

<h1 className="text-2xl font-bold mb-6 text-center">
Login
</h1>

<input
type="email"
placeholder="Email"
required
className="w-full border p-3 rounded mb-4"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

<div className="relative mb-4">

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
required
className="w-full border p-3 rounded"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button
type="button"
onClick={()=>setShowPassword(!showPassword)}
className="absolute right-3 top-3 text-sm text-gray-600"
>
{showPassword ? "Hide" : "Show"}
</button>

</div>

<button
type="submit"
className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
>

{loading ? "Signing in..." : "Login"}

</button>

{error && (

<p className="text-red-600 text-sm mt-3 text-center">
{error}
</p>

)}

<p className="text-sm text-center mt-4">

No account?

<a href="/register" className="text-green-600 ml-1">
Register
</a>

</p>

</form>

</div>

)

}