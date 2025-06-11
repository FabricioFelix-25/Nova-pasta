// CangaCodeLexer.js

class CangaCodeLexer {
    constructor(input) {
        this.input = input; 
        this.currentIndex = 0; 
        this.lineNumber = 1; 
        this.columnNumber = 1; 

        // Definição dos especificadores de token.
        this.tokenSpecs = [
            // Símbolos Reservados (multi-caractere primeiro para evitar casamento parcial)
            { type: "SRS04", regex: /^:=/i },
            { type: "SRS20", regex: /^<=/i },
            { type: "SRS22", regex: /^>=/i },
            { type: "SRS17", regex: /^==/i },
            { type: "SRS18", regex: /^!=/i },
            { type: "SRS18", regex: /^#/i },

            // Símbolos Reservados (um caractere)
            { type: "SRS01", regex: /^;/i },
            { type: "SRS02", regex: /^,/i },
            { type: "SRS03", regex: /^:/i },
            { type: "SRS05", regex: /^\?/i },
            { type: "SRS06", regex: /^\(/i },
            { type: "SRS07", regex: /^\)/i },
            { type: "SRS08", regex: /^\[/i },
            { type: "SRS09", regex: /^\]/i },
            { type: "SRS10", regex: /^\{/i },
            { type: "SRS11", regex: /^\}/i },
            { type: "SRS12", regex: /^\+/i },
            { type: "SRS13", regex: /^-/i },
            { type: "SRS14", regex: /^\*/i },
            { type: "SRS15", regex: /^\//i },
            { type: "SRS16", regex: /^%/i },
            { type: "SRS19", regex: /^</i },
            { type: "SRS21", regex: /^>/i },

            // Constantes Numéricas
            { type: "IDN05", regex: /^[0-9]+\.[0-9]+([eE][+-]?[0-9]+)?/i }, 
            { type: "IDN04", regex: /^[0-9]+/i }, 

            // Identificadores (genérico)
            { type: "IDENTIFIER_GENERAL", regex: /^[a-zA-Z_][a-zA-Z0-9_]*/i },

            // Constantes String e Char
            { type: "IDN06", regex: /^\"[a-zA-Z0-9 \t$_.]*\"/i },
            { type: "IDN07", regex: /^'[a-zA-Z]'/i },
        ];

        // Palavras Reservadas (em MAIÚSCULAS)
        this.reservedWords = {
            "REAL": "PRS02", "CHARACTER": "PRS03", "PARAMTYPE": "PRS04",
            "DECLARATIONS": "PRS05", "INTEGER": "PRS01", "STRING": "PRS06",
            "BOOLEAN": "PRS07", "VOID": "PRS08", "TRUE": "PRS09",
            "FALSE": "PRS10", "VARTYPE": "PRS11", "FUNCTYPE": "PRS12",
            "ENDDECLARATIONS": "PRS13", "PROGRAM": "PRS14", "ENDPROGRAM": "PRS15",
            "FUNCTIONS": "PRS16", "ENDFUNCTIONS": "PRS17", "ENDFUNCTION": "PRS18",
            "RETURN": "PRS19", "IF": "PRS20", "ELSE": "PRS21",
            "ENDIF": "PRS22", "WHILE": "PRS23", "ENDWHILE": "PRS24",
            "BREAK": "PRS25", "PRINT": "PRS26"
        };
    }

    _advanceCursor(textToConsume) {
        for (let i = 0; i < textToConsume.length; i++) {
            if (textToConsume[i] === '\n') {
                this.lineNumber++;
                this.columnNumber = 1;
            } else {
                this.columnNumber++;
            }
        }
        this.currentIndex += textToConsume.length;
    }

    _skipWhitespaceAndComments() {
        let somethingSkipped = true;
        while (somethingSkipped && this.currentIndex < this.input.length) {
            somethingSkipped = false;
            if (this.input.substring(this.currentIndex).startsWith('/*')) {
                let commentEndIndex = this.input.indexOf('*/', this.currentIndex + 2);
                this._advanceCursor(this.input.substring(this.currentIndex, commentEndIndex === -1 ? this.input.length : commentEndIndex + 2));
                somethingSkipped = true;
                continue;
            }
            if (this.input.substring(this.currentIndex).startsWith('//')) {
                let lineEndIndex = this.input.indexOf('\n', this.currentIndex + 2);
                this._advanceCursor(this.input.substring(this.currentIndex, lineEndIndex === -1 ? this.input.length : lineEndIndex));
                somethingSkipped = true;
                continue;
            }
            const whitespaceMatch = /^[ \t\r\n]+/.exec(this.input.substring(this.currentIndex));
            if (whitespaceMatch) {
                this._advanceCursor(whitespaceMatch[0]);
                somethingSkipped = true;
                continue;
            }
        }
    }

    getNextToken() {
        this._skipWhitespaceAndComments();
        if (this.currentIndex >= this.input.length) return null;
        const currentInputSubstring = this.input.substring(this.currentIndex);
        const tokenLine = this.lineNumber;
        const tokenColumn = this.columnNumber;
        for (const spec of this.tokenSpecs) {
            const match = spec.regex.exec(currentInputSubstring);
            if (match && match.index === 0) {
                let rawLexeme = match[0];
                this._advanceCursor(rawLexeme);
                let processedLexeme = rawLexeme.toUpperCase().substring(0, 32);
                let finalTokenCode = spec.type;
                if (spec.type === "IDENTIFIER_GENERAL") {
                    finalTokenCode = this.reservedWords[processedLexeme] || "IDN02";
                }
                return { lexeme: processedLexeme, token_code: finalTokenCode, line: tokenLine, column: tokenColumn };
            }
        }
        this._advanceCursor(this.input[this.currentIndex]);
        return this.getNextToken();
    }

    tokenizeAll() {
        const tokens = [];
        let token;
        while ((token = this.getNextToken())) {
            tokens.push(token);
        }
        return tokens;
    }
}


module.exports = CangaCodeLexer;