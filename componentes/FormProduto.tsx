"use client";

import { useState } from "react";

export default function FormProduto() {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [marca, setMarca] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setMensagem("");
        if (!nome.trim() || !marca.trim() || !preco.trim()) {
            setMensagem("Preencha todos os campos.");
            return;
        }
        const precoNumero = Number(preco);
        if (Number.isNaN(precoNumero) || precoNumero < 0) {
            setMensagem("Preço inválido.");
            return;
        }
        try {
            setLoading(true);
            const response = await fetch("/api/produtos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nome: nome.trim(),
                    preco: precoNumero,
                    marca: marca.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMensagem(`Erro: ${data.erro}`);
                return;
            }

            setMensagem(`Produto cadastrado com sucesso. ID: ${data.id}`);
            setNome("");
            setPreco("");
            setMarca("");
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao cadastrar produto.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow">
            <div>
                <label className="mb-1 block text-sm font-medium">Nome do produto</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Ex: Notebook"
                />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium">Preço</label>
                <input
                    type="number"
                    step="0.01"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Ex: 3500.00"
                />
            </div>
            <div>
                <label className="mb-1 block text-sm font-medium">Marca</label>
                <input
                    type="text"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="Ex: Dell"
                />
            </div>
            <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {loading ? "Salvando..." : "Cadastrar"}
            </button>
            {mensagem && <p className="text-sm text-blue-700">{mensagem}</p>}
        </form>
    );
}
