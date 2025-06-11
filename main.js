// main.js

const fs = require('fs');
const path = require('path');
const CangaCodeLexer = require('./CangaCodeLexer.js');

// Função para formatar a saída conforme a especificação do relatório .LEX
function gerarRelatorioLex(tokens, nomeBaseArquivoFonte, infoEquipe) {
    let relatorio = "";
    relatorio += `Código da Equipe: ${infoEquipe.codigo}\n`;
    relatorio += `Componentes:\n`;
    infoEquipe.componentes.forEach(comp => {
        relatorio += `${comp.nome}; ${comp.email}; ${comp.telefone}\n`;
    });
    relatorio += `\nRELATÓRIO DA ANÁLISE LÉXICA\n`;
    relatorio += `Texto fonte analisado: ${nomeBaseArquivoFonte}.251\n\n`;
    relatorio += "Lexema".padEnd(35) + "Código Token".padEnd(15) + "ÍndiceTabSimb".padEnd(15) + "Linha".padEnd(7) + "Coluna\n";
    relatorio += "-".repeat(80) + "\n";
    tokens.forEach(token => {
        const indiceTabSimb = token.token_code === 'IDN02' ? '...' : '';
        relatorio += `${token.lexeme.padEnd(35)}${token.token_code.padEnd(15)}${indiceTabSimb.padEnd(15)}${String(token.line).padEnd(7)}${String(token.column)}\n`;
    });
    return relatorio;
}

// Função principal 
function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Uso: node main.js <nome_base_do_arquivo> [caminho_opcional]");
        return;
    }

    const nomeBaseArquivo = args[0];
    const diretorioOpcional = args[1] || '.';
    const caminhoCompletoArquivoFonte = path.join(diretorioOpcional, `${nomeBaseArquivo}.251`);

    const informacoesEquipe = {
        codigo: "EQ06",
        componentes: [
            { nome: "Carlos Artur Couto Marques", email: "carlos.marques@ucsal.edu.br", telefone: "(71) 8765-8226" },
            { nome: "Fabricio Maicon Felix Santos", email: "fabriciomaicon.santos@ucsal.edu.br", telefone: "(71) 997156606" },
            { nome: "Lucas Nascimento Alves", email: "lucas.alves@ucsal.edu.br", telefone: "(74) 9998-7422" },
            { nome: "Nicolas Raimundo Menezes de Araújo", email: "nicolas.araujo@ucsal.edu.br", telefone: "(71) 9987-9517" }
        ]
    };

    try {
        const codigoFonte = fs.readFileSync(caminhoCompletoArquivoFonte, 'utf-8');
        const lexer = new CangaCodeLexer(codigoFonte);
        const tokens = lexer.tokenizeAll();
        const relatorioLexConteudo = gerarRelatorioLex(tokens, nomeBaseArquivo, informacoesEquipe);
        
        console.log(relatorioLexConteudo); 

        const caminhoArquivoLex = path.join(path.dirname(caminhoCompletoArquivoFonte), `${nomeBaseArquivo}.LEX`);
        fs.writeFileSync(caminhoArquivoLex, relatorioLexConteudo, 'utf-8');
        console.log(`\n✅ Relatório léxico salvo em: ${caminhoArquivoLex}`);

    } catch (error) {
        console.error(`❌ Erro ao processar o arquivo: ${error.message}`);
    }
}

main(); 