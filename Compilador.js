
const fs = require('fs');
const path = require('path');

// ===== CLASSE LÉXICA =====
class CangaCodeLexer {
    constructor(input) {
        this.input = input;
        this.currentIndex = 0;
        this.lineNumber = 1;
        this.columnNumber = 1;
        this.tokenSpecs = [
            { type: "SRS04", regex: /^:=/i }, { type: "SRS20", regex: /^<=/i },
            { type: "SRS22", regex: /^>=/i }, { type: "SRS17", regex: /^==/i },
            { type: "SRS18", regex: /^!=/i }, { type: "SRS18", regex: /^#/i },
            { type: "SRS01", regex: /^;/i }, { type: "SRS02", regex: /^,/i },
            { type: "SRS03", regex: /^:/i }, { type: "SRS06", regex: /^\(/i },
            { type: "SRS07", regex: /^\)/i }, { type: "SRS08", regex: /^\[/i },
            { type: "SRS09", regex: /^\]/i }, { type: "SRS10", regex: /^\{/i },
            { type: "SRS11", regex: /^\}/i }, { type: "SRS12", regex: /^\+/i },
            { type: "SRS13", regex: /^-/i }, { type: "SRS14", regex: /^\*/i },
            { type: "SRS15", regex: /^\//i }, { type: "SRS16", regex: /^%/i },
            { type: "SRS19", regex: /^</i }, { type: "SRS21", regex: /^>/i },
            { type: "IDN05", regex: /^[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?/i },
            { type: "IDN04", regex: /^[0-9]+/i },
            { type: "IDENTIFIER_GENERAL", regex: /^[a-zA-Z_][a-zA-Z0-9_]*/i },
            { type: "IDN06", regex: /^\"[a-zA-Z0-9 \t$_.]*\"/i },
            { type: "IDN07", regex: /^'[a-zA-Z]'/i }
        ];
        this.reservedWords = {
            "REAL": "PRS02", "CHARACTER": "PRS03", "PARAMTYPE": "PRS04",
            "DECLARATIONS": "PRS05", "INTEGER": "PRS01", "STRING": "PRS06",
            "BOOLEAN": "PRS07", "VOID": "PRS08", "TRUE": "PRS09",
            "FALSE": "PRS10", "VARTYPE": "PRS11", "FUNCTYPE": "PRS12",
            "ENDDECLARATIONS": "PRS13", "PROGRAM": "PRS14", "ENDPROGRAM": "PRS15",
            "FUNCTIONS": "PRS16", "ENDFUNCTIONS": "PRS17", "ENDFUNCTION": "PRS18",
            "RETURN": "PRS19", "IF": "PRS20", "ELSE": "PRS21", "ENDIF": "PRS22",
            "WHILE": "PRS23", "ENDWHILE": "PRS24", "BREAK": "PRS25",
            "PRINT": "PRS26"
        };
    }
    _advanceCursor(text) {
        for (let ch of text) {
            if (ch === '\n') { this.lineNumber++; this.columnNumber = 1; }
            else { this.columnNumber++; }
        }
        this.currentIndex += text.length;
    }
    _skipWhitespaceAndComments() {
        let again = true;
        while (again && this.currentIndex < this.input.length) {
            again = false;
            const rest = this.input.substring(this.currentIndex);
            if (rest.startsWith('/*')) {
                const end = this.input.indexOf('*/', this.currentIndex + 2);
                this._advanceCursor(rest.substring(0, end === -1 ? rest.length : end + 2));
                again = true; continue;
            }
            if (rest.startsWith('//')) {
                const end = this.input.indexOf('\n', this.currentIndex + 2);
                this._advanceCursor(rest.substring(0, end === -1 ? rest.length : end));
                again = true; continue;
            }
            const m = /^[ \t\r\n]+/.exec(rest);
            if (m) { this._advanceCursor(m[0]); again = true; }
        }
    }
    getNextToken() {
        this._skipWhitespaceAndComments();
        if (this.currentIndex >= this.input.length) return null;
        const slice = this.input.substring(this.currentIndex);
        const line = this.lineNumber;
        const col = this.columnNumber;
        for (const spec of this.tokenSpecs) {
            const m = spec.regex.exec(slice);
            if (m && m.index === 0) {
                const raw = m[0];
                this._advanceCursor(raw);
                let lex = raw.toUpperCase();
                if (lex.length > 32) lex = lex.substring(0, 32);
                let code = spec.type;
                if (spec.type === "IDENTIFIER_GENERAL") {
                    code = this.reservedWords[lex] || "IDN02";
                }
                return { lexeme: lex, token_code: code, line, column: col, rawLexeme: raw };
            }
        }
        // ignora caractere inválido
        this._advanceCursor(this.input[this.currentIndex]);
        return this.getNextToken();
    }
}

// ===== TABELA DE SÍMBOLOS =====
class SymbolTable {
    constructor() { this.table = []; this.lexemeMap = new Map(); }
    addSymbol(token, raw) {
        if (!token.token_code.startsWith('IDN')) return null;
        const lex = token.lexeme;
        if (this.lexemeMap.has(lex)) {
            const idx = this.lexemeMap.get(lex);
            const entry = this.table[idx];
            if (entry.linhas.length < 5 && !entry.linhas.includes(token.line)) entry.linhas.push(token.line);
            return idx;
        }
        const idx = this.table.length;
        this.lexemeMap.set(lex, idx);
        this.table.push({
            entrada: idx+1, codigo: token.token_code, lexeme: lex,
            qtdCharAntesTrunc: raw.length, qtdCharDepoisTrunc: lex.length,
            tipoSimb: 'N/D', linhas: [token.line]
        });
        return idx;
    }
    updateSymbolType(lexeme, newType) {
        if (this.lexemeMap.has(lexeme)) {
            const idx = this.lexemeMap.get(lexeme);
            this.table[idx].tipoSimb = newType;
        }
    }
    getTable() { return this.table; }
}

// ===== PARSER =====
class CangaCodeParser {
    constructor(lexer, symbolTable) {
        this.lexer = lexer;
        this.symbolTable = symbolTable;
        this.currentToken = null;
        this.typeMapping = { 'INTEGER':'IN','REAL':'FP','STRING':'ST','CHARACTER':'CH','BOOLEAN':'BL','VOID':'VD' };
    }
    _nextToken() { this.currentToken = this.lexer.getNextToken(); }
    _match(expected) {
        if (this.currentToken && this.currentToken.token_code === expected) {
            this._nextToken();
        } else {
            const rc = this.currentToken ? `'${this.currentToken.lexeme}' (${this.currentToken.token_code})` : 'Fim de Arquivo';
            throw new Error(`Erro Sintático: Esperava '${expected}' mas recebeu ${rc} na linha ${this.currentToken ? this.currentToken.line : 'final'}.`);
        }
    }
    parse() {
        this._nextToken();
        this.parseProgram();
        console.log("Análise Sintática concluída com sucesso.");
    }
    parseProgram() {
        if (this.currentToken && this.currentToken.token_code === 'PRS14') {
            this._match('PRS14'); this._match('IDN02'); this._match('SRS01');
        }
        if (this.currentToken && this.currentToken.token_code === 'PRS05') {
            this.parseDeclarations();
        }
        // futuras chamadas: parseFunctions(), etc.
    }
    parseDeclarations() {
        this._match('PRS05'); // DECLARATIONS
        this.parseDeclarationList();
        this._match('PRS13'); // ENDDECLARATIONS
    }
    parseDeclarationList() {
        this.parseDeclarationVar();
        while (this.currentToken && this.currentToken.token_code === 'SRS01') {
            this._match('SRS01');
            if (this.currentToken.token_code !== 'PRS11') break;
            this.parseDeclarationVar();
        }
    }
    parseDeclarationVar() {
        this._match('PRS11'); // VARTYPE
        const typeToken = this.currentToken;
        const baseType = this.typeMapping[typeToken.lexeme];
        if (!baseType) throw new Error(`Tipo desconhecido '${typeToken.lexeme}' na linha ${typeToken.line}`);
        this._nextToken();
        let finalType = baseType;
        if (this.currentToken && this.currentToken.token_code === 'SRS08') {
            this._match('SRS08'); this._match('SRS09');
            finalType = 'A' + baseType.charAt(0);
        }
        this._match('SRS03'); // ':'
        this.parseVariableList(finalType);
    }
    parseVariableList(typeToApply) {
        this.symbolTable.updateSymbolType(this.currentToken.lexeme, typeToApply);
        this._match('IDN02');
        while (this.currentToken && this.currentToken.token_code === 'SRS02') {
            this._match('SRS02');
            this.symbolTable.updateSymbolType(this.currentToken.lexeme, typeToApply);
            this._match('IDN02');
        }
    }
}

// ===== RELATÓRIOS =====
function gerarRelatorioLex(tokens, nomeBase, infoEq) {
    let r = `Código da Equipe: ${infoEq.codigo}\n`;
    r += `Componentes:\n`;
    infoEq.componentes.forEach(c => r += `${c.nome}; ${c.email}; ${c.telefone}\n`);
    r += `\nRELATÓRIO DA ANÁLISE LÉXICA\nFonte: ${nomeBase}.251\n\n`;
    r += `Lexema`.padEnd(35)+`Código Token`.padEnd(15)+`IdxTab`.padEnd(8)+`Linha\n`;
    r += `-`.repeat(70)+`\n`;
    tokens.forEach(t => {
        const idx = t.symTabIndex!=null?t.symTabIndex+1:'';
        r += `${t.lexeme.padEnd(35)}${t.token_code.padEnd(15)}${String(idx).padEnd(8)}${t.line}\n`;
    });
    return r;
}
function gerarRelatorioTab(table, nomeBase, infoEq) {
    let r = `Código da Equipe: ${infoEq.codigo}\n`;
    r += `Componentes:\n`;
    infoEq.componentes.forEach(c => r += `${c.nome}; ${c.email}; ${c.telefone}\n`);
    r += `\nRELATÓRIO DA TABELA DE SÍMBOLOS\nFonte: ${nomeBase}.251\n\n`;
    table.getTable().forEach(e => {
        r += `Entrada: ${e.entrada}, Código: ${e.codigo}, Lexeme: ${e.lexeme}, `;
        r += `CharsAntes: ${e.qtdCharAntesTrunc}, CharsDepois: ${e.qtdCharDepoisTrunc}, `;
        r += `Tipo: ${e.tipoSimb}, Linhas: (${e.linhas.join(', ')})\n`;
    });
    return r;
}

// ===== MAIN =====
function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) { console.error("Uso: node Compilador.js <nome_base>"); return; }
    const nomeBase = args[0];
    const dir = args[1]||'.';
    const src = path.join(dir, `${nomeBase}.251`);
    const infoEq = {
        codigo: "EQ06",
        componentes: [
            { nome: "Carlos Artur Couto Marques", email: "carlos.marques@ucsal.edu.br", telefone: "(71) 8765-8226" },
            { nome: "Fabricio Maicon Felix Santos", email: "fabriciomaicon.santos@ucsal.edu.br", telefone: "(71) 997156606" },
            { nome: "Lucas Nascimento Alves", email: "lucas.alves@ucsal.edu.br", telefone: "(74) 9998-7422" },
            { nome: "Nicolas Raimundo Menezes de Araújo", email: "nicolas.araujo@ucsal.edu.br", telefone: "(71) 9987-9517" }
        ]
    };
    try {
        const input = fs.readFileSync(src, 'utf-8');
        const lexer1 = new CangaCodeLexer(input);
        const symTab = new SymbolTable();
        const tokens = [];
        let tk;
        while ((tk = lexer1.getNextToken())) {
            tk.symTabIndex = symTab.addSymbol(tk, tk.rawLexeme);
            tokens.push(tk);
        }
        const lexer2 = new CangaCodeLexer(input);
        const parser = new CangaCodeParser(lexer2, symTab);
        parser.parse();
        console.log("Gerando relatórios...");
        fs.writeFileSync(path.join(dir, `${nomeBase}.LEX`), gerarRelatorioLex(tokens, nomeBase, infoEq));
        console.log(`✅ .LEX gerado: ${nomeBase}.LEX`);
        fs.writeFileSync(path.join(dir, `${nomeBase}.TAB`), gerarRelatorioTab(symTab, nomeBase, infoEq));
        console.log(`✅ .TAB gerado: ${nomeBase}.TAB`);
    } catch (e) {
        console.error(`❌ Erro: ${e.message}`);
    }
}

main();
