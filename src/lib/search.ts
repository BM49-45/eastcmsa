import {categories,getCategoryData} from "./r2"

export async function searchAudio(query:string){

let results:any[]=[]

for(const cat of categories){

const data = await getCategoryData(cat)

if(!data) continue

const filtered = data.files.filter((f:any)=>

f.title.toLowerCase().includes(query.toLowerCase()) ||

f.speaker?.toLowerCase().includes(query.toLowerCase())

)

filtered.forEach((f:any)=>{

results.push({
...f,
category:cat
})

})

}

return results

}