import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Conexão com o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id_personalizado, telefone, idioma, fuso_horario, saldo } = req.body;

  if (!id_personalizado) {
    return res.status(400).json({ error: 'ID ausente.' });
  }

  const atualizacoes: Record<string, any> = {};

  if (telefone !== undefined) atualizacoes.telefone = telefone;
  if (idioma !== undefined) atualizacoes.idioma = idioma;
  if (fuso_horario !== undefined) atualizacoes.fuso_horario = fuso_horario;
  if (saldo !== undefined) atualizacoes.saldo = saldo;

  const { error } = await supabase
    .from('usuarios')
    .update(atualizacoes)
    .eq('id_personalizado', id_personalizado);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({ message: 'Dados atualizados com sucesso.' });
}
