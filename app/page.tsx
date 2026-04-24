import Link from "next/link";


export default function Home() {
return (
  <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center p-6">
    <h1 className="mb-6 text-3xl font-bold">Sistema de Produtos</h1>


    <div className="flex gap-4">
      <Link
        href="/cadastrar"
        className="rounded-md bg-black px-4 py-2 text-white"
      >
        Ir para cadastro
      </Link>


      <Link
        href="/pesquisar"
        className="rounded-md border px-4 py-2"
      >
        Ir para pesquisa
      </Link>
    </div>
  </main>
);
}
