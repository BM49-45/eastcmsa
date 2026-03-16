export const R2_BASE =
  "https://pub-7729259c73e646759f7039886bf31b23.r2.dev/audio"

export async function getCategory(category: string) {
  const res = await fetch(
    `${R2_BASE}/${category}/metadata.json`,
    {
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Failed to load metadata")
  }

  return res.json()
}

export function audioUrl(
  category: string,
  filename: string
) {
  return `${R2_BASE}/${category}/${filename}`
}