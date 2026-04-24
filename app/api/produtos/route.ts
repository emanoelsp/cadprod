import { NextRequest, NextResponse } from "next/server";
import { 
  cadastrarProduto, 
  Produto, 
  listarProdutos, 
  pesquisarProdutosPorNome 
} from "@/lib/produtoService";

export async function GET(request: NextRequest) {
  try {
    console.log("📌 [GET /api/produtos] Iniciando listagem...");
    const searchParams = request.nextUrl.searchParams;
    const nome = searchParams.get("nome");

    let produtos;

    if (nome) {
      console.log("🔍 [GET /api/produtos] Pesquisando por nome:", nome);
      produtos = await pesquisarProdutosPorNome(nome);
    } else {
      console.log("📋 [GET /api/produtos] Listando todos os produtos");
      produtos = await listarProdutos();
    }

    console.log("✅ [GET /api/produtos] Encontrados:", produtos.length);
    return NextResponse.json({
      sucesso: true,
      total: produtos.length,
      produtos,
    });
  } catch (error) {
    console.error("❌ [GET /api/produtos] Erro ao listar produtos:", error);
    return NextResponse.json(
      { erro: "Erro ao listar produtos", detalhes: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📌 [POST /api/produtos] Iniciando cadastro...");
    
    const body: Produto = await request.json();
    console.log("📌 [POST /api/produtos] Body recebido:", body);

    if (!body.nome?.trim() || !body.marca?.trim() || typeof body.preco !== "number") {
      console.warn("⚠️ [POST /api/produtos] Validação falhou - dados inválidos");
      return NextResponse.json(
        { erro: "Dados inválidos: nome, marca e preço são obrigatórios" },
        { status: 400 }
      );
    }

    if (body.preco < 0) {
      console.warn("⚠️ [POST /api/produtos] Validação falhou - preço negativo");
      return NextResponse.json(
        { erro: "Preço deve ser maior que 0" },
        { status: 400 }
      );
    }

    console.log("✅ [POST /api/produtos] Validações passaram. Dados:", { nome: body.nome, preco: body.preco, marca: body.marca });
    
    const id = await cadastrarProduto(body);
    console.log("✅ [POST /api/produtos] Produto cadastrado com sucesso. ID:", id);

    return NextResponse.json(
      { sucesso: true, id, mensagem: "Produto cadastrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ [POST /api/produtos] Erro ao cadastrar produto:", error);
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "N/A");
    return NextResponse.json(
      { erro: "Erro ao cadastrar produto", detalhes: String(error) },
      { status: 500 }
    );
  }
}
