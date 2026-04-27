import { db } from "./firebaseconfig";
import {
  addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query,
  updateDoc, where, serverTimestamp
} from "firebase/firestore";

export type Produto = {
  id?: string;
  nome: string;
  preco: number;
  marca: string;
  createdAt?: unknown;
};

const COLLECTION_NAME = "produtos";

export async function testarConexaoFirestore() {
  const q = query(collection(db, COLLECTION_NAME), limit(1));
  const snapshot = await getDocs(q);

  return {
    ok: true,
    totalEncontrado: snapshot.size,
  };
}

export async function cadastrarProduto(produto: Produto) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    nome: produto.nome,
    preco: produto.preco,
    marca: produto.marca,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function listarProdutos() {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy("nome", "asc")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Produto[];
}

export async function pesquisarProdutosPorNome(nome: string) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("nome", ">=", nome),
    where("nome", "<=", nome + "\uf8ff")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  })) as Produto[];
}

export async function atualizarProduto(id: string, produto: Omit<Produto, "id">) {
  const docRef = doc(db, COLLECTION_NAME, id);


  await updateDoc(docRef, {
    nome: produto.nome,
    preco: produto.preco,
    marca: produto.marca,
  });
}


export async function excluirProduto(id: string) {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}
