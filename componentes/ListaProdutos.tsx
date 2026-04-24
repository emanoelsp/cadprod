"use client";

import { Produto } from "@/lib/produtoService";

interface ListaProdutosProps {
  produtos: Produto[];
}

export default function ListaProdutos({ produtos }: ListaProdutosProps) {
  if (produtos.length === 0) {
    return <p className="text-center text-gray-500">Nenhum produto encontrado.</p>;
  }

  return (
    <div className="space-y-4">
      {produtos.map((produto) => (
        <div key={produto.id} className="rounded-xl bg-white p-4 shadow">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{produto.nome}</h3>
            <span className="text-sm text-gray-600">ID: {produto.id}</span>
          </div>
          <p className="mb-2 text-gray-700">
            <strong>Marca:</strong> {produto.marca}
          </p>
          <p className="text-lg font-bold text-green-600">
            R$ {Number(produto.preco).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
}

