"use client";

import { useState } from "react";
import ListaProdutos from "@/componentes/ListaProdutos";
import Link from "next/link";
import type { Produto } from "@/lib/produtoService";

export default function PesquisarPage() {
  const [nome, setNome] = useState("");
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function handlePesquisar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensagem("");
    setProdutos([]);

    if (!nome.trim()) {
      setMensagem("Digite um nome para pesquisar.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/produtos?nome=${encodeURIComponent(nome)}`);
      const data = await response.json();

      if (!response.ok) {
        setMensagem(`Erro: ${data.erro}`);
        return;
      }

      setProdutos(data.produtos);
      if (data.total === 0) {
        setMensagem("Nenhum produto encontrado.");
      }
    } catch (error) {
      console.error(error);
      setMensagem("Erro ao pesquisar produtos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex gap-4">
        <Link href="/" className="underline">
          Home
        </Link>
        <Link href="/cadastrar" className="underline">
          Cadastrar produto
        </Link>
      </div>

      <h1 className="mb-6 text-2xl font-bold">Pesquisar produtos</h1>

      <form onSubmit={handlePesquisar} className="mb-8 rounded-xl bg-white p-6 shadow">
        <div className="flex gap-2">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome do produto..."
            className="flex-1 rounded-md border px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Pesquisando..." : "Pesquisar"}
          </button>
        </div>
      </form>

      {mensagem && <p className="mb-4 text-sm text-blue-700">{mensagem}</p>}

      {produtos.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">
            Encontrados: {produtos.length}
          </h2>
          <ListaProdutos produtos={produtos} />
        </div>
      )}
    </main>
  );
}
