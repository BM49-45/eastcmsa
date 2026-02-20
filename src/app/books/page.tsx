export default function BooksPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6 text-green-700 dark:text-green-400">📚 Islamic Books & Resources</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          This page is under construction. Check back soon for our collection of Islamic books and resources.
        </p>
        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border border-green-200 dark:border-gray-600">
          <p>You will soon be able to browse and download books like:</p>
          <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
            <li>Al Usuul Athalatha</li>
            <li>Alqawaidul Arbaa</li>
            <li> Al Usuul Sita</li>
            <li>Umdatul Ahkaam</li>
            <li>And many more...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}