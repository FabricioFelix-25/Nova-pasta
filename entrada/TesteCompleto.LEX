Código da Equipe: EQ06
Componentes:
Carlos Artur Couto Marques; carlos.marques@ucsal.edu.br; (71) 8765-8226
Fabricio Maicon Felix Santos; fabriciomaicon.santos@ucsal.edu.br; (71) 997156606
Lucas Nascimento Alves; lucas.alves@ucsal.edu.br; (74) 9998-7422
Nicolas Raimundo Menezes de Araújo; nicolas.araujo@ucsal.edu.br; (71) 9987-9517

RELATÓRIO DA ANÁLISE LÉXICA
Texto fonte analisado: TesteCompleto.251

Lexema                             Código Token   ÍndiceTabSimb  Linha  Coluna
--------------------------------------------------------------------------------
PROGRAM                            PRS14                         1      1
TESTE_COMPLETO                     IDN02          ...            1      9
;                                  SRS01                         1      23
DECLARATIONS                       PRS05                         3      1
VARTYPE                            PRS11                         5      5
INTEGER                            PRS01                         5      13
:                                  SRS03                         5      20
CONTADOR                           IDN02          ...            5      22
,                                  SRS02                         5      30
IDADE                              IDN02          ...            5      32
;                                  SRS01                         5      37
VARTYPE                            PRS11                         6      5
REAL                               PRS02                         6      13
:                                  SRS03                         6      17
SALARIO                            IDN02          ...            6      19
,                                  SRS02                         6      26
IMPOSTO_RENDA                      IDN02          ...            6      28
;                                  SRS01                         6      41
VARTYPE                            PRS11                         7      5
STRING                             PRS06                         7      13
:                                  SRS03                         7      19
NOME_COMPLETO                      IDN02          ...            7      21
,                                  SRS02                         7      34
ENDERECO                           IDN02          ...            7      36
;                                  SRS01                         7      44
VARTYPE                            PRS11                         8      5
BOOLEAN                            PRS07                         8      13
:                                  SRS03                         8      20
EH_VALIDO                          IDN02          ...            8      22
;                                  SRS01                         8      31
VARTYPE                            PRS11                         9      5
CHARACTER                          PRS03                         9      13
:                                  SRS03                         9      22
INICIAL                            IDN02          ...            9      24
;                                  SRS01                         9      31
VARTYPE                            PRS11                         13     5
INTEGER                            PRS01                         13     13
[                                  SRS08                         13     21
]                                  SRS09                         13     22
:                                  SRS03                         13     23
NOTAS                              IDN02          ...            13     25
;                                  SRS01                         13     30
VARTYPE                            PRS11                         14     5
REAL                               PRS02                         14     13
[                                  SRS08                         14     18
]                                  SRS09                         14     19
:                                  SRS03                         14     20
MEDICOES                           IDN02          ...            14     22
;                                  SRS01                         14     30
ENDDECLARATIONS                    PRS13                         15     1
FUNCTIONS                          PRS16                         17     1
FUNCTYPE                           PRS12                         19     5
REAL                               PRS02                         19     14
:                                  SRS03                         19     18
CALCULA_MEDIA                      IDN02          ...            19     20
(                                  SRS06                         19     33
PARAMTYPE                          PRS04                         19     34
INTEGER                            PRS01                         19     44
:                                  SRS03                         19     51
N1                                 IDN02          ...            19     53
,                                  SRS02                         19     55
N2                                 IDN02          ...            19     57
)                                  SRS07                         19     59
RETURN                             PRS19                         20     9
(                                  SRS06                         20     16
N1                                 IDN02          ...            20     17
+                                  SRS12                         20     20
N2                                 IDN02          ...            20     22
)                                  SRS07                         20     24
/                                  SRS15                         20     26
2.0                                IDN05                         20     28
;                                  SRS01                         20     31
ENDFUNCTION                        PRS18                         21     5
ENDFUNCTIONS                       PRS17                         22     1
SALARIO                            IDN02          ...            26     1
:=                                 SRS04                         26     9
5000.75                            IDN05                         26     12
;                                  SRS01                         26     19
IMPOSTO_RENDA                      IDN02          ...            27     1
:=                                 SRS04                         27     15
SALARIO                            IDN02          ...            27     18
*                                  SRS14                         27     26
0.225                              IDN05                         27     28
;                                  SRS01                         27     33
EH_VALIDO                          IDN02          ...            28     1
:=                                 SRS04                         28     11
TRUE                               PRS09                         28     14
;                                  SRS01                         28     18
INICIAL                            IDN02          ...            29     1
:=                                 SRS04                         29     9
'S'                                IDN07                         29     12
;                                  SRS01                         29     15
NOME_COMPLETO                      IDN02          ...            30     1
:=                                 SRS04                         30     15
"FULANO DA SILVA $. _ 123"         IDN06                         30     18
;                                  SRS01                         30     44
UM_IDENTIFICADOR_MUITO_LONGO_CRI   IDN02          ...            33     1
:=                                 SRS04                         33     77
1                                  IDN04                         33     80
;                                  SRS01                         33     81
IF                                 PRS20                         36     1
(                                  SRS06                         36     4
IDADE                              IDN02          ...            36     5
>=                                 SRS22                         36     11
18                                 IDN04                         36     14
#                                  SRS18                         36     17
EH_VALIDO                          IDN02          ...            36     19
==                                 SRS17                         36     29
TRUE                               PRS09                         36     32
)                                  SRS07                         36     36
THEN                               IDN02          ...            36     38
PRINT                              PRS26                         37     5
"MAIOR DE IDADE E VALIDO"          IDN06                         37     11
;                                  SRS01                         37     36
ELSE                               PRS21                         38     1
PRINT                              PRS26                         39     5
"MENOR DE IDADE OU INVALIDO"       IDN06                         39     11
;                                  SRS01                         39     39
ENDIF                              PRS22                         40     1
;                                  SRS01                         40     6
CONTADOR                           IDN02          ...            43     1
:=                                 SRS04                         43     10
10                                 IDN04                         43     13
;                                  SRS01                         43     15
WHILE                              PRS23                         44     1
(                                  SRS06                         44     7
CONTADOR                           IDN02          ...            44     8
>                                  SRS21                         44     17
0                                  IDN04                         44     19
)                                  SRS07                         44     20
PRINT                              PRS26                         45     5
CONTADOR                           IDN02          ...            45     11
;                                  SRS01                         45     19
CONTADOR                           IDN02          ...            46     5
:=                                 SRS04                         46     14
CONTADOR                           IDN02          ...            46     17
-                                  SRS13                         46     26
1                                  IDN04                         46     28
;                                  SRS01                         46     29
INVALID                            IDN02          ...            47     5
CHAR                               IDN02          ...            47     13
%                                  SRS16                         47     17
AQUI                               IDN02          ...            47     18
;                                  SRS01                         47     22
ENDWHILE                           PRS24                         48     1
;                                  SRS01                         48     9
