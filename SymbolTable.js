
// Responsável por armazenar e gerenciar os símbolos (identificadores) encontrados.

class SymbolTable {
    constructor() {
        this.table = [];    
        this.lexemeMap = new Map(); 
    }

    /**
     * Adiciona um símbolo à tabela. Se já existir, atualiza. Se for novo, insere.
     * Apenas tokens do tipo identificador (IDNxx) são armazenados.
     * @param {object} token - O objeto token vindo do lexer.
     * @param {string} rawLexeme - O lexema original, antes de ser truncado.
     * @returns {number | null} O índice (0-based) do símbolo na tabela, ou null se não for um identificador.
     */
    addSymbol(token, rawLexeme) {
        if (!token.token_code.startsWith('IDN')) {
            return null;
        }
        
        const lexeme = token.lexeme;

        if (this.lexemeMap.has(lexeme)) {
            // Símbolo já existe: atualiza a lista de linhas onde apareceu
            const index = this.lexemeMap.get(lexeme);
            const entry = this.table[index];

            // Adiciona a nova linha se ainda não estiver na lista e se houver espaço (limite de 5)
            if (entry.linhas.length < 5 && !entry.linhas.includes(token.line)) {
                entry.linhas.push(token.line);
            }
            return index;

        } else {
            // Símbolo novo: cria uma nova entrada na tabela
            const index = this.table.length;
            this.lexemeMap.set(lexeme, index);

            const newEntry = {
                entrada: index + 1, 
                codigo: token.token_code,
                lexeme: lexeme,
                qtdCharAntesTrunc: rawLexeme.length,
                qtdCharDepoisTrunc: lexeme.length,
                tipoSimb: 'N/D', // O tipo do símbolo (Integer, String, etc.) será definido pela análise semântica
                linhas: [token.line]
            };
            
            this.table.push(newEntry);
            return index;
        }
    }

    /**
     * Retorna a tabela completa para a geração do relatório .TAB.
     * @returns {Array} A tabela de símbolos.
     */
    getTable() {
        return this.table;
    }
}


module.exports = SymbolTable;
