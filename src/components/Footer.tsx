import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-16">
      <div className="mx-auto w-full max-w-screen-xl py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center me-3">
                <span className="text-white font-bold text-lg">Oz</span>
              </div>
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ozonteck</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Sua loja online de confiança com os melhores produtos e preços.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Produtos</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/products" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Todos os Produtos</Link>
                </li>
                <li className="mb-4">
                  <Link href="/categories" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Categorias</Link>
                </li>
                <li>
                  <Link href="/offers" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Ofertas</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Atendimento</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/contact" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Contato</Link>
                </li>
                <li className="mb-4">
                  <Link href="/faq" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">FAQ</Link>
                </li>
                <li>
                  <Link href="/support" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Suporte</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Empresa</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/about" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Sobre Nós</Link>
                </li>
                <li className="mb-4">
                  <Link href="/careers" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Trabalhe Conosco</Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Blog</Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <Link href="/privacy" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Política de Privacidade</Link>
                </li>
                <li className="mb-4">
                  <Link href="/terms" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Termos de Uso</Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Trocas e Devoluções</Link>
                </li>
              </ul>
            </div>
          </div>
      </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()} <Link href="/" className="hover:underline hover:text-teal-600 dark:hover:text-teal-400">Ozonteck</Link>. Todos os direitos reservados.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0 space-x-5">
             <Link href="#" className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
               <span className="text-lg font-semibold">Facebook</span>
             </Link>
             <Link href="#" className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
               <span className="text-lg font-semibold">WhatsApp</span>
             </Link>
             <Link href="#" className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
               <span className="text-lg font-semibold">YouTube</span>
             </Link>
           </div>
        </div>
    </div>
</footer>

  );
}