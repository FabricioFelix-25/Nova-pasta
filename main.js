

// gerencia a tabela de símbolos e gera os relatórios de saída .LEX e .TAB.

const fs = require('fs');
const path = require('path');
const CangaCodeLexer = require('./CangaCodeLexer.js');
const SymbolTable = require('./SymbolTable.js');

// Função para gerar o conteúdo formatado do relatório .LEX
function gerarRelatorioLex(tokens, nomeBaseArquivoFonte, infoEquipe) {
    let relatorio = `Código da Equipe: ${infoEquipe.codigo}\n`;
    relatorio += `Componentes:\n`;
    infoEquipe.componentes.forEach(comp => {
        relatorio += `${comp.nome}; ${comp.email}; ${comp.telefone}\n`;
    });
    relatorio += `\nRELATÓRIO DA ANÁLISE LÉXICA\nTexto fonte analisado: ${nomeBaseArquivoFonte}.251\n\n`;
    relatorio += "Lexema".padEnd(35) + "Código Token".padEnd(15) + "ÍndiceTabSimb".padEnd(15) + "Linha\n";
    relatorio += "-".repeat(75) + "\n";

    tokens.forEach(token => {
        const indice = token.symTabIndex !== null && token.symTabIndex !== undefined ? token.symTabIndex + 1 : '';
        relatorio += `${token.lexeme.padEnd(35)}${token.token_code.padEnd(15)}${String(indice).padEnd(15)}${token.line}\n`;
    });
    return relatorio;
}

// Função para gerar o conteúdo formatado do relatório .TAB
function gerarRelatorioTab(symbolTable, nomeBaseArquivoFonte, infoEquipe) {
    let relatorio = `Código da Equipe: ${infoEquipe.codigo}\n`;
    relatorio += `Componentes:\n`;
    infoEquipe.componentes.forEach(comp => {
        relatorio += `${comp.nome}; ${comp.email}; ${comp.telefone}\n`;
    });
    relatorio += `\nRELATÓRIO DA TABELA DE SÍMBOLOS\nTexto fonte analisado: ${nomeBaseArquivoFonte}.251\n\n`;
    
    symbolTable.getTable().forEach(entry => {
        relatorio += `Entrada: ${entry.entrada}, `;
        relatorio += `Codigo: ${entry.codigo}, `;
        relatorio += `Lexeme: ${entry.lexeme}, `;
        relatorio += `QtdCharAntesTrunc: ${entry.qtdCharAntesTrunc}, `;
        relatorio += `QtdCharDepoisTrunc: ${entry.qtdCharDepoisTrunc}, `;
        relatorio += `TipoSimb: ${entry.tipoSimb}, `;
        relatorio += `Linhas: (${entry.linhas.join(', ')})\n`;
    });
    return relatorio;
}

// Função principal do programa
function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.error("Uso: node main.js <nome_base_do_arquivo> [caminho_opcional_para_pasta]");
        return;
    }

    const nomeBaseArquivo = args[0];
    const diretorioOpcional = args[1] || '.';
    const caminhoCompletoArquivoFonte = path.join(diretorioOpcional, `${nomeBaseArquivo}.251`);
    
    // Preencha com os dados corretos da sua equipe
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
        const symbolTable = new SymbolTable();
        
        const tokens = [];
        let token;
        
        while ((token = lexer.getNextToken())) {
            const symTabIndex = symbolTable.addSymbol(token, token.rawLexeme);
            token.symTabIndex = symTabIndex; // Anexa o índice ao token para uso no relatório .LEX
            tokens.push(token);
        }

        // Geração do Relatório .LEX
        const relatorioLexConteudo = gerarRelatorioLex(tokens, nomeBaseArquivo, informacoesEquipe);
        const caminhoArquivoLex = path.join(path.dirname(caminhoCompletoArquivoFonte), `${nomeBaseArquivo}.LEX`);
        fs.writeFileSync(caminhoArquivoLex, relatorioLexConteudo, 'utf-8');
        console.log(`✅ Relatório .LEX salvo em: ${caminhoArquivoLex}`);
        
        // Geração do Relatório .TAB
        const relatorioTabConteudo = gerarRelatorioTab(symbolTable, nomeBaseArquivo, informacoesEquipe);
        const caminhoArquivoTab = path.join(path.dirname(caminhoCompletoArquivoFonte), `${nomeBaseArquivo}.TAB`);
        fs.writeFileSync(caminhoArquivoTab, relatorioTabConteudo, 'utf-8');
        console.log(`✅ Relatório .TAB salvo em: ${caminhoArquivoTab}`);

    } catch (error) {
        console.error(`❌ Erro: ${error.message}`);
    }
}

// Executa a função principal
main();
