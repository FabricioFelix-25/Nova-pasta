class CangaCodeLexer {
    constructor(input) {
        this.input = input;
        this.currentIndex = 0;
        this.lineNumber = 1;
        this.columnNumber = 1;

        // Especificações dos tokens com expressões regulares.
        // A ordem é crucial: padrões mais longos/específicos devem vir primeiro.
        this.tokenSpecs = [
            // Símbolos Reservados (multi-caractere primeiro)
            { type: "SRS04", regex: /^:=/i }, { type: "SRS20", regex: /^<=/i },
            { type: "SRS22", regex: /^>=/i }, { type: "SRS17", regex: /^==/i },
            { type: "SRS18", regex: /^!=/i }, { type: "SRS18", regex: /^#/i },
            // Símbolos Reservados (um caractere)
            { type: "SRS01", regex: /^;/i }, { type: "SRS02", regex: /^,/i },
            { type: "SRS03", regex: /^:/i }, { type: "SRS05", regex: /^\?/i },
            { type: "SRS06", regex: /^\(/i }, { type: "SRS07", regex: /^\)/i },
            { type: "SRS08", regex: /^\[/i }, { type: "SRS09", regex: /^\]/i },
            { type: "SRS10", regex: /^\{/i }, { type: "SRS11", regex: /^\}/i },
            { type: "SRS12", regex: /^\+/i }, { type: "SRS13", regex: /^-/i },
            { type: "SRS14", regex: /^\*/i }, { type: "SRS15", regex: /^\//i },
            { type: "SRS16", regex: /^%/i }, { type: "SRS19", regex: /^</i },
            { type: "SRS21", regex: /^>/i },
            // Constantes Numéricas (real deve vir antes de inteiro)
            { type: "IDN05", regex: /^[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?/i },
            { type: "IDN04", regex: /^[0-9]+/i },
            // Padrão geral para identificadores
            { type: "IDENTIFIER_GENERAL", regex: /^[a-zA-Z_][a-zA-Z0-9_]*/i },
            // Constantes String e Char
            { type: "IDN06", regex: /^\"[a-zA-Z0-9 \t$_.]*\"/i },
            { type: "IDN07", regex: /^'[a-zA-Z]'/i },
        ];

        // Dicionário de Palavras Reservadas (em maiúsculas para comparação)
        this.reservedWords = {
            "REAL": "PRS02", "CHARACTER": "PRS03", "PARAMTYPE": "PRS04",
            "DECLARATIONS": "PRS05", "INTEGER": "PRS01", "STRING": "PRS06",
            "BOOLEAN": "PRS07", "VOID": "PRS08", "TRUE": "PRS09", "FALSE": "PRS10",
            "VARTYPE": "PRS11", "FUNCTYPE": "PRS12", "ENDDECLARATIONS": "PRS13",
            "PROGRAM": "PRS14", "ENDPROGRAM": "PRS15", "FUNCTIONS": "PRS16",
            "ENDFUNCTIONS": "PRS17", "ENDFUNCTION": "PRS18", "RETURN": "PRS19",
            "IF": "PRS20", "ELSE": "PRS21", "ENDIF": "PRS22", "WHILE": "PRS23",
            "ENDWHILE": "PRS24", "BREAK": "PRS25", "PRINT": "PRS26"
        };
    }

    _advanceCursor(textToConsume) {
        for (let i = 0; i < textToConsume.length; i++) {
            if (textToConsume[i] === '\n') { this.lineNumber++; this.columnNumber = 1; }
            else { this.columnNumber++; }
        }
        this.currentIndex += textToConsume.length;
    }

    _skipWhitespaceAndComments() {
        let skipped = true;
        while (skipped && this.currentIndex < this.input.length) {
            skipped = false;
            const sub = this.input.substring(this.currentIndex);
            if (sub.startsWith('/*')) {
                let end = this.input.indexOf('*/', this.currentIndex + 2);
                this._advanceCursor(sub.substring(0, end === -1 ? sub.length : end + 2));
                skipped = true; continue;
            }

            if (sub.startsWith('//')) {
                let end = this.input.indexOf('\n', this.currentIndex + 2);
                this._advanceCursor(sub.substring(0, end === -1 ? sub.length : end));
                skipped = true; continue;
            }
            const wsMatch = /^[ \t\r\n]+/.exec(sub);
            if (wsMatch) {
                this._advanceCursor(wsMatch[0]);
                skipped = true; continue;
            }
        }
    }

    getNextToken() {
        this._skipWhitespaceAndComments();
        if (this.currentIndex >= this.input.length) return null;

        const currentInput = this.input.substring(this.currentIndex);
        const tokenLine = this.lineNumber;
        const tokenColumn = this.columnNumber;

        for (const spec of this.tokenSpecs) {
            const match = spec.regex.exec(currentInput);
            if (match && match.index === 0) {
                const rawLexeme = match[0];
                this._advanceCursor(rawLexeme);
                
                let processedLexeme = rawLexeme.toUpperCase();
                if (processedLexeme.length > 32) {
                    processedLexeme = processedLexeme.substring(0, 32);
                }

                let finalTokenCode = spec.type;
                if (spec.type === "IDENTIFIER_GENERAL") {
                    finalTokenCode = this.reservedWords[processedLexeme] || "IDN02";
                }
                
                return {
                    lexeme: processedLexeme,
                    token_code: finalTokenCode,
                    line: tokenLine,
                    column: tokenColumn,
                    rawLexeme: rawLexeme 
                };
            }
        }
        
        // Ignora caractere inválido e tenta o próximo
        this._advanceCursor(this.input[this.currentIndex]);
        return this.getNextToken();
    }
}

module.exports = CangaCodeLexer;