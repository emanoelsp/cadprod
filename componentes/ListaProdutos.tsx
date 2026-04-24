"use client";

import { useEffect, useState } from "react";
import { atualizarProduto, excluirProduto, listarProdutos,
    pesquisarProdutosPorNome,
    Produto,
} from "@/lib/produtoService";


export default function ListaProdutos() {
    const [busca, setBusca] = useState("");
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [mensagem, setMensagem] = useState("");
    const [loading, setLoading] = useState(false);

    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [nomeEdit, setNomeEdit] = useState("");
    const [precoEdit, setPrecoEdit] = useState("");
    const [marcaEdit, setMarcaEdit] = useState("");

    async function carregarProdutos() {
        try {
            setLoading(true);
            const dados = await listarProdutos();
            setProdutos(dados);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao carregar produtos.");
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        carregarProdutos();
    }, []);
    async function handlePesquisar() {
        try {
            setLoading(true);
            setMensagem("");
            if (!busca.trim()) {
                await carregarProdutos();
                return;
            }
            const dados = await pesquisarProdutosPorNome(busca.trim());
            setProdutos(dados);
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao pesquisar produtos.");
        } finally {
            setLoading(false);
        }
    }
    function iniciarEdicao(produto: Produto) {
        setEditandoId(produto.id || null);
        setNomeEdit(produto.nome);
        setPrecoEdit(String(produto.preco));
        setMarcaEdit(produto.marca);
    }
    function cancelarEdicao() {
        setEditandoId(null);
        setNomeEdit("");
        setPrecoEdit("");
        setMarcaEdit("");
    }
    async function salvarEdicao(id: string) {
        try {
            const precoNumero = Number(precoEdit);
            if (!nomeEdit.trim() || !marcaEdit.trim() || Number.isNaN(precoNumero)) {
                setMensagem("Preencha corretamente os dados da edição.");
                return;
            }
            await atualizarProduto(id, {
                nome: nomeEdit.trim(),
                preco: precoNumero,
                marca: marcaEdit.trim(),
            });
            setMensagem("Produto atualizado com sucesso.");
            cancelarEdicao();
            await handlePesquisar();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao atualizar produto.");
        }
    }
    async function handleExcluir(id: string) {
        const confirmar = window.confirm("Deseja realmente excluir este produto?");
        if (!confirmar) return;
        try {
            await excluirProduto(id);
            setMensagem("Produto excluído com sucesso.");
            await handlePesquisar();
        } catch (error) {
            console.error(error);
            setMensagem("Erro ao excluir produto.");
        }
    }
    return (
        <div className="space-y-6">
            <div className="rounded-xl bg-white p-4 shadow">
                <label className="mb-2 block text-sm font-medium">Pesquisar por nome</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="w-full rounded-md border px-3 py-2"
                        placeholder="Digite o nome do produto"
                    />
                    <button
                        onClick={handlePesquisar}
                        className="rounded-md bg-black px-4 py-2 text-white"
                    >
                        Pesquisar
                    </button>
                </div>
            </div>
            {mensagem && <p className="text-sm text-blue-700">{mensagem}</p>}
            {loading && <p>Carregando...</p>}
            <div className="space-y-4">
                {produtos.map((produto) => (
                    <div key={produto.id} className="rounded-xl bg-white p-4 shadow">
                        {editandoId === produto.id ? (
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    value={nomeEdit}
                                    onChange={(e) => setNomeEdit(e.target.value)}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <input
                                    type="number"
                                    step="0.01"
                                    value={precoEdit}
                                    onChange={(e) => setPrecoEdit(e.target.value)}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <input
                                    type="text"
                                    value={marcaEdit}
                                    onChange={(e) => setMarcaEdit(e.target.value)}
                                    className="w-full rounded-md border px-3 py-2"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => salvarEdicao(produto.id!)}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white"
                                    >
                                        Salvar
                                    </button>
                                    <button
                                        onClick={cancelarEdicao}
                                        className="rounded-md bg-gray-500 px-4 py-2 text-white"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h2 className="text-lg font-bold">{produto.nome}</h2>
                                <p>Marca: {produto.marca}</p>
                                <p>Preço: R$ {Number(produto.preco).toFixed(2)}</p>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => iniciarEdicao(produto)}
                                        className="rounded-md bg-yellow-500 px-4 py-2 text-white"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleExcluir(produto.id!)}
                                        className="rounded-md bg-red-600 px-4 py-2 text-white"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {!loading && produtos.length === 0 && (
                    <p>Nenhum produto encontrado.</p>
                )}
            </div>
        </div>
    );
}
