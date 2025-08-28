import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="mx-auto w-full max-w-screen-xl py-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Link href="/" className="flex items-center">
            <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center me-3">
              <span className="text-white font-bold text-lg">Oz</span>
            </div>
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ozonteck</span>
          </Link>
          
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/contact" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
              Contato
            </Link>
            <Link href="/privacy" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition-colors">
              Termos
            </Link>
          </div>
          
          <span className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © {new Date().getFullYear()} Ozonteck. Todos os direitos reservados.
          </span>
        </div>
      </div>
    </footer>
  );
}