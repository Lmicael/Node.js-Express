import express, { json } from 'express';
import { readFile, writeFile } from 'fs';
import fs from 'fs';
const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

app.get('/api/pessoas', (req, res) => {
    readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo data.json:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData.pessoas);
        } catch (parseError) {
            console.error('Erro ao fazer o parse do JSON:', parseError);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
});

app.post('/api/pessoas', (req, res) => {
    const { nome, idade } = req.body;

    if (!nome || !idade) {
        return res.status(400).json({ error: 'Nome e idade são obrigatórios' });
    }

    readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo data.json:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        try {
            const jsonData = JSON.parse(data);
            const id = jsonData.pessoas.length + 1;
            const novaPessoa = { id, nome, idade };
            jsonData.pessoas.push(novaPessoa);

            writeFile('data.json', JSON.stringify(jsonData), (err) => {
                if (err) {
                    console.error('Erro ao escrever no arquivo data.json:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }
                res.status(201).json(novaPessoa);
            });
        } catch (parseError) {
            console.error('Erro ao fazer o parse do JSON:', parseError);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
});

app.put('/api/pessoas/:id', (req, res) => {
    const { id } = req.params;
    const { nome, idade } = req.body;

    if (!nome || !idade) {
        return res.status(400).json({ error: 'Nome e idade são obrigatórios' });
    }

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo data.json:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        try {
            const jsonData = JSON.parse(data);
            const pessoaIndex = jsonData.pessoas.findIndex((p) => p.id === parseInt(id));

            if (pessoaIndex === -1) {
                return res.status(404).json({ error: 'Pessoa não encontrada' });
            }

            jsonData.pessoas[pessoaIndex].nome = nome;
            jsonData.pessoas[pessoaIndex].idade = idade;

            fs.writeFile('data.json', JSON.stringify(jsonData), (err) => {
                if (err) {
                    console.error('Erro ao escrever no arquivo data.json:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }
                res.json(jsonData.pessoas[pessoaIndex]);
            });
        } catch (parseError) {
            console.error('Erro ao fazer o parse do JSON:', parseError);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
});

app.delete('/api/pessoas/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo data.json:', err);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

        try {
            const jsonData = JSON.parse(data);
            const pessoaIndex = jsonData.pessoas.findIndex((p) => p.id === parseInt(id));

            if (pessoaIndex === -1) {
                return res.status(404).json({ error: 'Pessoa não encontrada' });
            }

            const pessoaRemovida = jsonData.pessoas.splice(pessoaIndex, 1)[0];

            fs.writeFile('data.json', JSON.stringify(jsonData), (err) => {
                if (err) {
                    console.error('Erro ao escrever no arquivo data.json:', err);
                    return res.status(500).json({ error: 'Erro interno do servidor' });
                }
                res.json(pessoaRemovida);
            });
        } catch (parseError) {
            console.error('Erro ao fazer o parse do JSON:', parseError);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
