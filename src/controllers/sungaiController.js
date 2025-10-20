import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config';


export const getSungaiByKecamatan = async (req, res) => {
  try {
    const { id } = req.params; // id kecamatan

    const { data, error } = await supabase
      .from('sungai')
      .select('id, kode_sungai, nama_sungai, remark, kelas_sungai, tipe_sungai, panjang_m, file_path, kecamatan_id')
      .eq('kecamatan_id', id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.json({ success: true, data: [], message: 'Tidak ada data sungai di kecamatan ini' });
    }

    // Konversi hasil ke GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: data.map((row) => ({
        type: 'Feature',
        properties: {
          id: row.id,
          kode_sungai: row.kode_sungai,
          nama_sungai: row.nama_sungai,
          remark: row.remark,
          kelas_sungai: row.kelas_sungai,
          tipe_sungai: row.tipe_sungai,
          panjang_m: row.panjang_m,
          file_path: row.file_path,
        },
      })),
    };

    res.json({ success: true, data: geojson });
  } catch (err) {
    console.error('Error getSungaiByKecamatan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
