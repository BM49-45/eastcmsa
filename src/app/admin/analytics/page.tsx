import { getAllStats } from "@/lib/r2"

export default async function Analytics(){

const stats = await getAllStats()

return(

<div className="p-10">

<h1 className="text-2xl font-bold mb-6">
Analytics
</h1>

<div className="space-y-3">

{/* <p>Total Users: {stats.users}</p> */}

<p>Total Audios: {stats.audios}</p>

<p>Total Categories: {stats.categories}</p>

<p>Total Speakers: {stats.speakers}</p>

</div>

</div>

)

}