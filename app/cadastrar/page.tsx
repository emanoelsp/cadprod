import FormProduto from "@/componentes/FormProduto";
import Link from "next/link";


export default function CadastrarPage() {
return (
  <main className="mx-auto max-w-2xl p-6">
    <div className="mb-6 flex gap-4">
      <Link href="/" className="underline">
        Home
      </Link>
      <Link href="/pesquisar" className="underline">
        Pesquisar produtos
      </Link>
    </div>

    <h1 className="mb-4 text-2xl font-bold">Cadastrar produto</h1>
    <FormProduto />
  </main>
);
}
