import Link from "next/link"

const categories = [
  {
    name: "Tawhiid",
    slug: "tawhiid",
    description: "Masomo ya Tawhiid",
  },
  {
    name: "Fiqh",
    slug: "fiqh",
    description: "Masomo ya Fiqh",
  },
  {
    name: "Sirah",
    slug: "sirah",
    description: "Masomo ya Sirah",
  },
  {
    name: "Lectures",
    slug: "mihadhara",
    description: "Mihadhara mbalimbali",
  },
]

export default function ContentsPage() {
  return (
    <div className="max-w-5xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Contents
      </h1>

      <div className="grid md:grid-cols-2 gap-6">

        {categories.map((cat) => (

          <Link
            key={cat.slug}
            href={`/${cat.slug}`}
            className="border rounded-xl p-6 hover:bg-gray-50 transition"
          >

            <h2 className="text-xl font-semibold">
              {cat.name}
            </h2>

            <p className="text-gray-600 mt-2">
              {cat.description}
            </p>

          </Link>

        ))}

      </div>

    </div>
  )
}