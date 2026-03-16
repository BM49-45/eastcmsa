import { getCategory } from "./audio"

export async function getStats() {

  const categories = [
    "tawhiid",
    "fiqh",
    "sirah",
    "mihadhara",
  ]

  let totalAudios = 0

  for (const cat of categories) {

    const data = await getCategory(cat)

    totalAudios += data.files.length
  }

  return {
    totalAudios,
    totalCategories: categories.length,
  }
}