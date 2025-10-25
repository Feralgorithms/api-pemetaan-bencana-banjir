import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config';


export const getRisikoBanjir = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('risiko_banjir')
      .select('*')
      .order('terakhir_diperbarui', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });

  } catch (err) {
    console.error('Error getRisikoBanjir:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getRisikoByDesa = async (req, res) => {
  try {
    const { nama_desa } = req.params;

    const { data, error } = await supabase
      .from('risiko_banjir')
      .select('*')
      .eq('nama_desa', nama_desa)
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    res.json({ success: true, data });

  } catch (err) {
    console.error('Error getRisikoByDesa:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const updateRisikoByDesa = async (req, res) => {
  try {
    const { nama_desa } = req.params;
    const { rata_tinggi_air, kategori, jumlah_laporan } = req.body;

    const { data, error } = await supabase
      .from('risiko_banjir')
      .update({
        ...(rata_tinggi_air !== undefined && { rata_tinggi_air }),
        ...(kategori !== undefined && { kategori }),
        ...(jumlah_laporan !== undefined && { jumlah_laporan }),
        terakhir_diperbarui: new Date()
      })
      .eq('nama_desa', nama_desa)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ success: false, message: "Desa tidak ditemukan" });
    }

    res.json({ success: true, message: "Berhasil diperbarui", data });

  } catch (err) {
    console.error('Error updateRisikoByDesa:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteRisiko = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('risiko_banjir')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ success: true, message: 'Risiko berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
